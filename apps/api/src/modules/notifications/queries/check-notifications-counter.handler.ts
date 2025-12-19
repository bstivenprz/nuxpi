import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CheckNotificationsCounterQuery } from './check-notifications-counter.query';
import { Notification } from '../entities/notification.entity';

@QueryHandler(CheckNotificationsCounterQuery)
export class CheckNotificationsCounterQueryHandler
  implements IQueryHandler<CheckNotificationsCounterQuery, number>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: CheckNotificationsCounterQuery): Promise<number> {
    const { current_profile_id } = query;

    const count = await Notification.createQueryBuilder('notification')
      .where('notification.target_profile_id = :current_profile_id', {
        current_profile_id,
      })
      .andWhere('notification.is_read = false')
      .getCount();

    return count;
  }
}
