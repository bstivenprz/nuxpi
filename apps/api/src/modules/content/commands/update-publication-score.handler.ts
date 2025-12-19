import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdatePublicationScoreCommand } from './update-publication-score.command';
import { EngagementRankerService } from '../services/engagement';
import { RedisService } from '@/services/redis/redis.service';
import { Follow } from '@/modules/profile/entities/follow.entity';

@CommandHandler(UpdatePublicationScoreCommand)
export class UpdatePublicationScoreCommandHandler
  implements ICommandHandler<UpdatePublicationScoreCommand, void>
{
  constructor(
    private readonly engagement_ranker: EngagementRankerService,
    private readonly redis: RedisService,
  ) {}

  async execute(command: UpdatePublicationScoreCommand): Promise<void> {
    const { publication } = command;

    const score = this.engagement_ranker.velocity(
      {
        likes_count: publication.likes_count,
        comments_count: publication.comments_count,
        sales_count: publication.sales_count,
        views_count: publication.views_count,
      },
      publication.created_at,
    );

    const followers_ids = await Follow.find_followers_ids(
      publication.author.id,
    );

    const pipeline = this.redis.client.pipeline();
    if (followers_ids.length > 0) {
      followers_ids.forEach((follower_id) => {
        pipeline.sadd(`${follower_id}:feed`, score, publication.id);
      });
    }
    pipeline.zadd(`${publication.author.id}:feed`, score, publication.id);
    await pipeline.exec();
  }
}
