import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { DiscoverProfilesQuery } from './discover-profiles.query';

@QueryHandler(DiscoverProfilesQuery)
export class DiscoverProfilesQueryHandler
  implements IQueryHandler<DiscoverProfilesQuery, void>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: DiscoverProfilesQuery): Promise<void> {
    const {} = query;
  }
}
