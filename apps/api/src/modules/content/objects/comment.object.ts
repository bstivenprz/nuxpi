import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { AutoMap } from '@automapper/classes';

export class CommentObject {
  id: string;
  content: string;
  created_at: number;

  @AutoMap(() => PublicProfileObject)
  author: PublicProfileObject;
}
