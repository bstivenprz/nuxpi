import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CheckConversationMessagesQuery } from './check-conversation-messages.query';
import { Message } from '../entitites/message.entity';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { MessageObject } from '../objects/message.object';

@QueryHandler(CheckConversationMessagesQuery)
export class CheckConversationMessagesQueryHandler
  implements
    IQueryHandler<
      CheckConversationMessagesQuery,
      PaginationObject<MessageObject>
    >
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(
    query: CheckConversationMessagesQuery,
  ): Promise<PaginationObject<MessageObject>> {
    const { conversation_id, current_profile_id, pagination } = query;

    const [messagesResult, count] = await Message.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.conversation_id = :conversation_id', { conversation_id })
      .skip(pagination.skip)
      .take(pagination.take)
      .orderBy('message.created_at', 'DESC')
      .getManyAndCount();

    if (count === 0)
      return new PaginationObject<MessageObject>(
        [],
        new PaginationMetaObject({
          options: pagination,
          total_count: count,
        }),
      );

    const messages = this.mapper
      .mapArray(messagesResult, Message, MessageObject)
      .map((message, index) => ({
        ...message,
        is_owner: messagesResult[index].sender?.id === current_profile_id,
      }));

    return new PaginationObject<MessageObject>(
      messages,
      new PaginationMetaObject({
        options: pagination,
        total_count: count,
      }),
    );
  }
}
