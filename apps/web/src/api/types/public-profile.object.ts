export interface PublicProfileObject {
  name: string;
  username: string;
  presentation?: string;
  cover?: string;
  picture?: string;
  gender?: string;
  followers_count?: number
  is_following?: boolean;
  is_owner?: boolean;
}
