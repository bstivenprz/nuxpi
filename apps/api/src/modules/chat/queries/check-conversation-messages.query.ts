import { PaginationQuery } from '@/common/models/pagination';
import { IQuery } from '@nestjs/cqrs';

export class CheckConversationMessagesQuery implements IQuery {
  constructor(
    readonly current_profile_id: string,
    readonly conversation_id: string,
    readonly pagination: PaginationQuery,
  ) {}
}
