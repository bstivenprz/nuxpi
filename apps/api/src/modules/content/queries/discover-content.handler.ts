import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { DiscoverContentQuery } from './discover-content.query';

@QueryHandler(DiscoverContentQuery)
export class DiscoverContentQueryHandler
  implements IQueryHandler<DiscoverContentQuery, void>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: DiscoverContentQuery): Promise<void> {
    const {} = query;
  }
}
