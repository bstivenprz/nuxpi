import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { EngagementVelocityQuery } from './engagement-velocity.query';

@QueryHandler(EngagementVelocityQuery)
export class EngagementVelocityQueryHandler
  implements IQueryHandler<EngagementVelocityQuery, number>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: EngagementVelocityQuery): Promise<number> {
    const {
      likes_count,
      comments_count,
      sales_count,
      views_count,
      created_at,
    } = query;

    const now = Date.now() / 1000;
    const age_hours = Math.max((now - created_at.getTime()) / 3600, 1);

    const total_egagement =
      likes_count + comments_count * 2 + sales_count * 3 + views_count * 0.1;

    const velocity = total_egagement / age_hours;

    let recency_boost = 1.0;
    if (age_hours < 6) {
      recency_boost = 2.0 - age_hours / 6;
    }

    let time_penalty = 1.0;
    if (age_hours > 24) {
      const days_old = age_hours / 24;
      time_penalty = Math.exp(-0.2 * days_old);
    }

    return velocity * recency_boost * time_penalty;
  }
}
