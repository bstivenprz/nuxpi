export const TAGS = {
  PROFILE: "profile",
  PUBLIC_PROFILE: (u: string) => `profile.${u}`,
  FOLLOWERS: (u: string) => `profile.${u}.followers`,
};
