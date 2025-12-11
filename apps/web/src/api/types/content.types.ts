import { PublicProfileObject } from "./public-profile.object";

export interface PublicationObject {
  id: string;
  caption: string;
  author: PublicProfileObject;
  likes_count: number;
  comments_count: number;
  views_count: number;
  shares_count: number;
  is_owner: boolean;
  is_liked: boolean;
  created_at: number;
}

export interface CommentObject {
  id: string
  content: string
  author: PublicProfileObject
  created_at: number
  is_owner: boolean
}