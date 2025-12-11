import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CheckRunningBroadcastQuery } from './check-running-broadcast.query';

@QueryHandler(CheckRunningBroadcastQuery)
export class CheckRunningBroadcastQueryHandler implements IQueryHandler<CheckRunningBroadcastQuery, void> {
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: CheckRunningBroadcastQuery): Promise<void> {
    const {} = query;
  }
}
