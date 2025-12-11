import { Session } from '@/auth/decorators/session.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CheckInboxMessagesQuery } from '../queries/check-inbox-messages.query';
import { PaginationQuery } from '@/common/models/pagination';
import { CheckInboxCountersQuery } from '../queries/check-inbox-counters.query';
import { ListContactsQuery } from '../queries/list-contacts.query';
import { SearchContactsQuery } from '../queries/search-contacts.query';

@Controller('inbox')
export class InboxController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  inbox(
    @Session('profile_id') profile_id: string,
    @Query('filter') filter: 'all' | 'unread' | 'featured',
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(
      new CheckInboxMessagesQuery(profile_id, pagination, filter),
    );
  }

  @Get('counters')
  counters(@Session('profile_id') profile_id: string) {
    return this.queryBus.execute(new CheckInboxCountersQuery(profile_id));
  }

  @Get('contacts')
  contacts(@Session('profile_id') profile_id: string) {
    return this.queryBus.execute(new ListContactsQuery(profile_id));
  }

  @Get('contacts/search')
  search(
    @Session('profile_id') profile_id: string,
    @Query('q') query?: string,
  ) {
    return this.queryBus.execute(new SearchContactsQuery(profile_id, query));
  }
}
