import { PublicProfileObject } from "./public-profile.object"

export interface InboxCountersObject {
    unreaded_count: number;
  featured_count: number;
}

export interface ConversationObject {
  id: string
  participant: PublicProfileObject
}

export interface ConversationParticipantObject {
  unread_message_count: number
  last_message: MessageObject
  participant: PublicProfileObject
}

export interface MessageObject {
  type: "text"|"image"|"video"|"ppv"
  content?: string
  sender: PublicProfileObject
  is_owner: boolean
}

export interface ChannelObject {
  key: "followers"|"following"|"sponsors"
  count: number
  pictures: string[]
}