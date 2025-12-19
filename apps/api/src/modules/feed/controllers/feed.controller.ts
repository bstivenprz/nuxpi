import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FeedSuggestionsQuery } from '../queries/feed-suggestions.query';
import { PaginationQuery } from '@/common/models/pagination';
import { Session } from '@/auth/decorators/session.decorator';
import { FeedQuery } from '@/modules/content/queries/feed.query';

@Controller('feed')
export class FeedController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('suggestions')
  suggestions() {
    return this.queryBus.execute(new FeedSuggestionsQuery());
  }

  @Get()
  feed(
    @Session('profile_id') profile_id: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(new FeedQuery(profile_id, pagination));
  }
}
