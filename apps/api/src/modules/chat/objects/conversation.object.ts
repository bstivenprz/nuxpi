import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { AutoMap } from '@automapper/classes';

export class ConversationObject {
  id: string;

  @AutoMap(() => PublicProfileObject)
  participant: PublicProfileObject;
}
