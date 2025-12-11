import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { MessageObject } from './message.object';
import { AutoMap } from '@automapper/classes';

export class ConversationParticipantObject {
  unread_messages_count: number;

  @AutoMap(() => MessageObject)
  last_message: MessageObject;

  @AutoMap(() => PublicProfileObject)
  participant: PublicProfileObject;
}
