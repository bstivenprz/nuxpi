import { RedisService } from '@/services/redis/redis.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Publication } from '../entities/publication.entity';
import { In, LessThan } from 'typeorm';

@Injectable()
export class CleanUpFeedTask {
  private readonly logger = new Logger(CleanUpFeedTask.name);
  private readonly DAYS_OLD = 30; // 1 mes

  constructor(private readonly redis: RedisService) {}

  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    this.logger.log('Cleaning up old posts from feeds');

    const feed_keys = await this.redis.client.keys('*:feed');
    if (feed_keys.length === 0) {
      this.logger.log('No feeds found');
      return;
    }

    // Calcular el cutoff time: hace 30 días en segundos (Unix timestamp)
    const cutoff_time = Math.floor(Date.now() / 1000) - this.DAYS_OLD * 86400;
    const cutoff_date = new Date(cutoff_time * 1000);

    // Recopilar todos los IDs de publicaciones de todos los feeds
    // y mantener un mapa de feed -> publication_ids para optimizar las eliminaciones
    const feed_publications_map = new Map<string, Set<string>>();
    const all_publication_ids = new Set<string>();

    for (const feed_key of feed_keys) {
      const publication_ids = (await this.redis.client.zrevrange(
        feed_key,
        0,
        -1,
      )) as string[];
      const publication_ids_set = new Set(publication_ids);
      feed_publications_map.set(feed_key, publication_ids_set);
      publication_ids.forEach((id) => all_publication_ids.add(id));
    }

    if (all_publication_ids.size === 0) {
      this.logger.log('No publications found in feeds');
      return;
    }

    // Consultar la base de datos para obtener las publicaciones antiguas
    const old_publications = await Publication.find({
      where: {
        id: In(Array.from(all_publication_ids)),
        created_at: LessThan(cutoff_date),
      },
      select: ['id'],
    });

    const old_publication_ids = new Set(old_publications.map((p) => p.id));

    if (old_publication_ids.size === 0) {
      this.logger.log('No old publications to remove');
      return;
    }

    // Eliminar las publicaciones antiguas solo de los feeds que las contienen
    let total_removed = 0;
    const pipeline = this.redis.client.pipeline();

    for (const [feed_key, publication_ids] of feed_publications_map) {
      for (const publication_id of old_publication_ids) {
        // Solo intentar eliminar si la publicación está en este feed
        if (publication_ids.has(publication_id)) {
          pipeline.zrem(feed_key, publication_id);
          total_removed++;
        }
      }
    }

    await pipeline.exec();

    this.logger.log(
      `Cleaned up ${old_publication_ids.size} old publications from ${feed_keys.length} feeds (${total_removed} total removals)`,
    );
  }
}
