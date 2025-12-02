import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FindConversationQuery } from './find-conversation.query';
import { Conversation } from '../entitites/conversation.entity';
import { ConversationObject } from '../objects/conversation.object';
import { Profile } from '@/modules/profile/entities/profile.entity';
import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { Exception } from '@/common/models/http-exception';
import { ConversationParticipant } from '../entitites/conversation-participant.entity';

@QueryHandler(FindConversationQuery)
export class FindConversationQueryHandler
  implements IQueryHandler<FindConversationQuery, ConversationObject>
{
  @InjectMapper() mapper: Mapper;

  constructor() {}

  async execute(query: FindConversationQuery): Promise<ConversationObject> {
    const { current_profile_id, username } = query;

    const current_profile = await Profile.findOneBy({ id: current_profile_id });

    if (current_profile.username === username)
      throw Exception.BadRequest('cannot_get_conversation');

    const actual_conversation = await Conversation.findOne({
      where: {
        created_by: {
          username,
        },
      },
      relations: {
        created_by: true,
      },
    });

    if (actual_conversation) {
      const conversation_participant =
        await ConversationParticipant.createQueryBuilder('participants')
          .leftJoinAndSelect(
            'participants.participant',
            'participant',
            'participants.participant_id = participant.id AND participant.username = :username',
            { username },
          )
          .where('participants.conversation_id = :conversation_id', {
            converstation_id: actual_conversation.id,
          })
          .getOne();

      return {
        id: actual_conversation.id,
        participant: this.mapper.map(
          conversation_participant.participant,
          Profile,
          PublicProfileObject,
        ),
      };
    }

    const conversation = new Conversation();
    conversation.created_by = current_profile;
    await conversation.save();

    const target_profile = await Profile.findOneBy({ username });

    const conversation_participant_1 = new ConversationParticipant();
    conversation_participant_1.conversation = conversation;
    conversation_participant_1.participant = current_profile;
    conversation_participant_1.joined_at = new Date();

    const conversation_participant_2 = new ConversationParticipant();
    conversation_participant_2.conversation = conversation;
    conversation_participant_2.participant = target_profile;
    conversation_participant_2.joined_at = new Date();

    return {
      id: conversation.id,
      participant: this.mapper.map(
        target_profile,
        Profile,
        PublicProfileObject,
      ),
    };
  }
}
