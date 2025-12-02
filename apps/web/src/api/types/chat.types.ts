import { PublicProfileObject } from "./public-profile.object"

export interface ConversationObject {
  id: string
  participant: PublicProfileObject
}

export interface MessageObject {
  type: "text"|"multimedia"|"ppv"
  content?: string
  sender: PublicProfileObject
  is_owner: boolean
}