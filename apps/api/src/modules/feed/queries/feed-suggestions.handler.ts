import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FeedSuggestionsQuery } from './feed-suggestions.query';
import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { Profile } from '@/modules/profile/entities/profile.entity';

@QueryHandler(FeedSuggestionsQuery)
export class FeedSuggestionsQueryHandler
  implements IQueryHandler<FeedSuggestionsQuery, PublicProfileObject[]>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(): Promise<PublicProfileObject[]> {
    return this.mapper.mapArrayAsync(
      await Profile.find(),
      Profile,
      PublicProfileObject,
    );
  }
}
