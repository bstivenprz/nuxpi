import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CheckInboxCountersQuery } from './check-inbox-counters.query';
import { InboxCountersObject } from '../objects/inbox-counters.object';
import { ConversationParticipant } from '../entitites/conversation-participant.entity';

@QueryHandler(CheckInboxCountersQuery)
export class CheckInboxCountersQueryHandler
  implements IQueryHandler<CheckInboxCountersQuery, InboxCountersObject>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: CheckInboxCountersQuery): Promise<InboxCountersObject> {
    const { current_profile_id } = query;

    const result = await ConversationParticipant.createQueryBuilder('cp')
      .select(
        'COUNT(CASE WHEN cp.unread_messages_count > 0 THEN 1 END)',
        'conversations_with_unread',
      )
      .where('cp.participant_id = :current_profile_id', { current_profile_id })
      .getRawOne();

    return {
      featured_count: 0,
      unreaded_count: parseInt(result?.conversations_with_unread || '0'),
    };
  }
}
