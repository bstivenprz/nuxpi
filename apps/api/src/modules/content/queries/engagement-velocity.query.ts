import { IQuery } from '@nestjs/cqrs';

export class EngagementVelocityQuery implements IQuery {
  constructor(
    readonly likes_count: number,
    readonly comments_count: number,
    readonly sales_count: number,
    readonly views_count: number,
    readonly created_at: Date,
  ) {}
}
