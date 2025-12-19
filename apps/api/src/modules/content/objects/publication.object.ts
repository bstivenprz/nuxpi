import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { AutoMap } from '@automapper/classes';
import { AssetObject } from './asset.object';

export class PublicationObject {
  id: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_owner: boolean;
  is_liked: boolean;
  is_pinned: boolean;
  created_at: number;
  @AutoMap(() => PublicProfileObject)
  author: PublicProfileObject;
  @AutoMap(() => [AssetObject])
  assets: AssetObject[];
}
