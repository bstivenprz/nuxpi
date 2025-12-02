export class PublicProfileObject {
  name: string;
  username: string;
  presentation: string;
  gender: 'male' | 'female' | 'lgbtiq' | 'prefer_not_say';
  picture?: string;
  cover?: string;
  is_following: boolean;
  is_owner: boolean;
}
