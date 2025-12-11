import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { AutoMap } from '@automapper/classes';

export class MessageObject {
  type: 'text' | 'image' | 'video' | 'ppv';
  content?: string;
  @AutoMap(() => PublicProfileObject)
  sender: PublicProfileObject;
  is_owner: boolean;
}
