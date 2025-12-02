import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FeedSuggestionsQuery } from '../queries/feed-suggestions.query';

@Controller('feed')
export class FeedController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('suggestions')
  suggestions() {
    return this.queryBus.execute(new FeedSuggestionsQuery());
  }
}
