import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindConversationQuery } from '../queries/find-conversation.query';
import { CheckConversationMessagesQuery } from '../queries/check-conversation-messages.query';
import { Session } from '@/auth/decorators/session.decorator';
import { PaginationQuery } from '@/common/models/pagination';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':username')
  conversation(
    @Session('profile_id') profile_id: string,
    @Param('username') username: string,
  ) {
    return this.queryBus.execute(
      new FindConversationQuery(profile_id, username),
    );
  }

  @Get(':conversation_id/messages')
  messages(
    @Session('profile_id') profile_id: string,
    @Param('conversation_id') conversation_id: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(
      new CheckConversationMessagesQuery(
        profile_id,
        conversation_id,
        pagination,
      ),
    );
  }
}
