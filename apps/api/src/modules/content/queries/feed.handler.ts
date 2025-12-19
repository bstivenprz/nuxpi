import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FeedQuery } from './feed.query';
import { RedisService } from '@/services/redis/redis.service';
import { Audience, Publication } from '../entities/publication.entity';
import { In } from 'typeorm';
import { PublicationObject } from '../objects/publication.object';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { Like } from '../entities/like.entity';
import { Asset, AssetType } from '../entities/asset.entity';
import { AssetObject } from '../objects/asset.object';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@QueryHandler(FeedQuery)
export class FeedQueryHandler
  implements IQueryHandler<FeedQuery, PaginationObject<PublicationObject>>
{
  @InjectMapper() mapper: Mapper;

  constructor(
    private readonly redis: RedisService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    query: FeedQuery,
  ): Promise<PaginationObject<PublicationObject>> {
    const { current_profile_id, pagination } = query;

    const feed_key = `${current_profile_id}:feed`;

    // Obtener el total de publicaciones en el feed desde Redis
    const total_count = await this.redis.client.zcard(feed_key);

    if (total_count === 0) {
      return new PaginationObject(
        [],
        new PaginationMetaObject({
          options: pagination,
          total_count: 0,
        }),
      );
    }

    // ZREVRANGE devuelve un rango inclusivo [start, stop]
    // Para obtener exactamente 'take' elementos, debemos usar: skip hasta (skip + take - 1)
    const cached_publications_ids = (await this.redis.client.zrevrange(
      feed_key,
      pagination.skip,
      pagination.skip + pagination.take - 1,
    )) as unknown as string[];

    if (cached_publications_ids.length === 0) {
      return new PaginationObject(
        [],
        new PaginationMetaObject({
          options: pagination,
          total_count: total_count,
        }),
      );
    }

    // Obtener las publicaciones de la base de datos
    // No necesitamos skip/take aquí porque ya filtramos por IDs específicos de Redis
    // No necesitamos order porque Redis ya devuelve el orden correcto
    const publications = await Publication.find({
      where: {
        id: In(cached_publications_ids),
      },
      relations: {
        author: true,
        assets: true,
      },
    });

    // Mantener el orden de Redis usando un Map para búsqueda O(1)
    const publication_order_map = new Map(
      cached_publications_ids.map(([id], index) => [id, index]),
    );

    // Ordenar las publicaciones según el orden de Redis
    const ordered_publications = publications.sort(
      (a, b) =>
        (publication_order_map.get(a.id) ?? Infinity) -
        (publication_order_map.get(b.id) ?? Infinity),
    );

    // Obtener los IDs de publicaciones que el usuario ha dado like
    const liked_publications_ids = await Like.find({
      where: {
        profile: {
          id: current_profile_id,
        },
        publication: {
          id: In(ordered_publications.map((p) => p.id)),
        },
      },
      relations: {
        publication: true,
      },
      select: ['publication'],
    }).then((likes) => new Set(likes.map((like) => like.publication.id)));

    const mapped_publications = this.mapper.mapArray(
      ordered_publications,
      Publication,
      PublicationObject,
    );

    const transformed_publications = mapped_publications.map(
      (publication, index) => {
        const source = ordered_publications[index];
        return {
          ...publication,
          assets: this.mapper
            .mapArray(source.assets, Asset, AssetObject)
            .map((asset) => ({
              ...asset,
              public_url: this.cloudinaryService.get_public_url(
                asset.cloudinary_public_id,
                asset.type === AssetType.IMAGE ? 'image' : 'video',
                source.audience === Audience.PAID_ONLY,
              ),
              placeholder_url: this.cloudinaryService.get_placeholder_url(
                asset.cloudinary_public_id,
              ),
            })),
          is_owner: source.author.id === current_profile_id,
          is_liked: liked_publications_ids.has(source.id),
        };
      },
    );

    return new PaginationObject(
      transformed_publications,
      new PaginationMetaObject({
        options: pagination,
        total_count: total_count,
      }),
    );
  }
}
