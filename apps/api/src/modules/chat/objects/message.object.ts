import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { AutoMap } from '@automapper/classes';

export class MessageObject {
  type: 'text' | 'multimedia' | 'ppv';
  content?: string;
  @AutoMap(() => PublicProfileObject)
  sender: PublicProfileObject;
  is_owner: boolean;
}
