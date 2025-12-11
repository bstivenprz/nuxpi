import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ConversationParticipant } from '../entitites/conversation-participant.entity';
import {
  PaginationMetaObject,
  PaginationObject,
} from '@/common/models/pagination';
import { ConversationParticipantObject } from '../objects/participant.object';
import { Message } from '../entitites/message.entity';
import { MessageObject } from '../objects/message.object';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { CheckInboxMessagesQuery } from './check-inbox-messages.query';

@QueryHandler(CheckInboxMessagesQuery)
export class CheckConversationsQueryHandler
  implements
    IQueryHandler<
      CheckInboxMessagesQuery,
      PaginationObject<ConversationParticipantObject>
    >
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(
    query: CheckInboxMessagesQuery,
  ): Promise<PaginationObject<ConversationParticipantObject>> {
    const { current_profile_id, pagination, filter } = query;

    const queryBuilder = ConversationParticipant.createQueryBuilder('cp')
      .leftJoinAndSelect('cp.conversation', 'conversation')
      .leftJoinAndSelect('cp.last_message', 'last_message')
      .leftJoinAndSelect('last_message.sender', 'last_message_sender')
      .leftJoinAndSelect(
        'conversation_participants',
        'other_participant',
        'other_participant.conversation_id = conversation.id AND other_participant.participant_id != :current_profile_id',
        { current_profile_id },
      )
      .leftJoinAndSelect('other_participant.participant', 'other_profile')
      .where('cp.participant_id = :current_profile_id', {
        current_profile_id,
      });

    switch (filter) {
      case 'unread':
        queryBuilder.andWhere('cp.unread_messages_count > 0');
        break;
      case 'featured':
        // TODO: Agregar el campo de tokens en el mensaje.
        break;
      default:
        break;
    }

    const [participants, count] = await queryBuilder
      .skip(pagination.skip)
      .take(pagination.take)
      .orderBy('last_message.created_at', 'DESC')
      .addOrderBy('conversation.created_at', 'DESC')
      .getManyAndCount();

    if (count === 0)
      return new PaginationObject<ConversationParticipantObject>(
        [],
        new PaginationMetaObject({
          options: pagination,
          total_count: count,
        }),
      );

    return new PaginationObject<ConversationParticipantObject>(
      participants.map((participant): ConversationParticipantObject => {
        const other_participant = participant.conversation['other_participant'];
        return {
          last_message: this.mapper.map(
            participant.last_message,
            Message,
            MessageObject,
            {
              afterMap: (source, destination) => {
                destination.is_owner = source.sender.id === current_profile_id;
              },
            },
          ),
          participant: this.mapper.map(
            other_participant,
            Profile,
            PublicProfileObject,
          ),
          unread_messages_count: participant.unread_messages_count,
        };
      }),
      new PaginationMetaObject({
        options: pagination,
        total_count: count,
      }),
    );
  }
}
