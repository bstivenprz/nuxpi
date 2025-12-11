import { PaginationQuery } from '@/common/models/pagination';
import { IQuery } from '@nestjs/cqrs';

export class CheckInboxMessagesQuery implements IQuery {
  constructor(
    readonly current_profile_id: string,
    readonly pagination: PaginationQuery,
    readonly filter?: 'all' | 'unread' | 'featured',
  ) {}
}
