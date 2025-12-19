import { Session } from '@/auth/decorators/session.decorator';
import { PaginationQuery } from '@/common/models/pagination';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ListNotificationsQuery } from '../queries/list-notifications.query';
import { ReadAllNotificationsCommand } from '../commands/read-all-notifications.command';
import { ReadNotificationCommand } from '../commands/read-notification.command';
import { CheckNotificationsCounterQuery } from '../queries/check-notifications-counter.query';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  notifications(
    @Session('profile_id') profile_id: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(
      new ListNotificationsQuery(profile_id, pagination),
    );
  }

  @Get('counter')
  counter(@Session('profile_id') profile_id: string) {
    return this.queryBus.execute(
      new CheckNotificationsCounterQuery(profile_id),
    );
  }

  @Post('read-all')
  read_all_notifications(@Session('profile_id') profile_id: string) {
    return this.commandBus.execute(new ReadAllNotificationsCommand(profile_id));
  }

  @Post(':notification_id/read')
  read_notification(
    @Session('profile_id') profile_id: string,
    @Param('notification_id') notification_id: string,
  ) {
    return this.commandBus.execute(
      new ReadNotificationCommand(profile_id, notification_id),
    );
  }
}
