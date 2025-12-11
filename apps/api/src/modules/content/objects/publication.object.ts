import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { AutoMap } from '@automapper/classes';

export class PublicationObject {
  id: string;
  caption: string;
  assets: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_owner: boolean;
  is_liked: boolean;
  created_at: number;

  @AutoMap(() => PublicProfileObject)
  author: PublicProfileObject;
}
