import { PropsWithChildren } from "react";

import { SideMenu } from "@/components/side-menu";
import { BottomMenu } from "@/components/bottom-menu";
import { fetchAPI } from "@/api/fetch";
import { CurrentProfileObject } from "@/api/types/current-profile.object";

export default async function ApplicationLayout({ children }: PropsWithChildren) {
  const response = await fetchAPI("/profile", { cache: "no-store" });
  const profile = (await response.json()) as CurrentProfileObject;

  return (
    <div className="relative flex h-[100dvh] justify-center w-full overflow-hidden">
      <div className="fixed top-0 left-0 h-full">
        <SideMenu />
      </div>
      <div
        className="
          tablet:w-[621px] desktop:w-[638px] desktop:px-5 w-full
          h-[100dvh] overflow-y-auto
          pb-[calc(56px+env(safe-area-inset-bottom)+16px)]
        "
      >
        {children}
      </div>

      <BottomMenu username={profile.username} />
    </div>
  );
}
