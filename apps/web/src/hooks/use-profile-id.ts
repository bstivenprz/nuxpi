import { useEffect, useState } from "react";

export function useProfileId() {
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookie = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("profile_id="));

    if (cookie) {
      const value = cookie.split("profile_id=")[1];
      if (value) setProfileId(decodeURIComponent(value));
    }
  }, []);

  return profileId;
}
