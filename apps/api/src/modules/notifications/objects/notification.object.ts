import { PublicProfileObject } from '@/modules/profile/objects/public-profile.object';
import { AutoMap } from '@automapper/classes';

export class NotificationObject {
  id: string;
  activity?: string;
  content: string;
  href?: string;
  thumbnail?: string;
  is_featured?: boolean;
  is_read?: boolean;
  notified_at?: number;
  @AutoMap(() => PublicProfileObject)
  initiator_profile: PublicProfileObject;
}
