import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NotificationsCounterQuery } from './notifications-counter.query';

@QueryHandler(NotificationsCounterQuery)
export class NotificationsCounterQueryHandler
  implements IQueryHandler<NotificationsCounterQuery, void>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: NotificationsCounterQuery): Promise<void> {
    const {} = query;
  }
}
