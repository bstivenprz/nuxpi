import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListNotificationsQuery } from './list-notifications.query';
import { Notification } from '../entities/notification.entity';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { NotificationObject } from '../objects/notification.object';

@QueryHandler(ListNotificationsQuery)
export class ListNotificationsQueryHandler
  implements
    IQueryHandler<ListNotificationsQuery, PaginationObject<NotificationObject>>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(
    query: ListNotificationsQuery,
  ): Promise<PaginationObject<NotificationObject>> {
    const { current_profile_id, pagination } = query;

    const [notifications, total_count] = await Notification.findAndCount({
      where: {
        target_profile: {
          id: current_profile_id,
        },
      },
      relations: {
        target_profile: true,
        initiator_profile: true,
      },
      skip: pagination.skip,
      take: pagination.take,
      order: {
        notified_at: 'DESC',
      },
    });

    if (total_count === 0) {
      return new PaginationObject<NotificationObject>(
        [],
        new PaginationMetaObject({
          options: pagination,
          total_count: total_count,
        }),
      );
    }

    const mappedNotifications = this.mapper.mapArray(
      notifications,
      Notification,
      NotificationObject,
    );

    return new PaginationObject<NotificationObject>(
      mappedNotifications,
      new PaginationMetaObject({
        options: pagination,
        total_count: total_count,
      }),
    );
  }
}
