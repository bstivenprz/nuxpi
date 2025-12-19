import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FeedQuery } from './feed.query';

@QueryHandler(FeedQuery)
export class FeedQueryHandler implements IQueryHandler<FeedQuery, void> {
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: FeedQuery): Promise<void> {
    const { current_profile_id, pagination } = query;
  }
}
