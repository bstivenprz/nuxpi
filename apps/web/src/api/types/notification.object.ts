import { PublicProfileObject } from "./public-profile.object";

export interface NotificationObject {
  id: string;
  activity?: string;
  content: string;
  href?: string;
  thumbnail?: string;
  is_featured?: boolean;
  is_read?: boolean;
  notified_at?: number;
  initiator_profile: PublicProfileObject;
}
