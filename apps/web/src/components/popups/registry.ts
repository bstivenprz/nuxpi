import { PopUpRegistry } from "@/providers/popup-provider";
import { FollowersPopUp } from "./followers-popup";

export const popupRegistry: PopUpRegistry = {
  followers: FollowersPopUp,
};
