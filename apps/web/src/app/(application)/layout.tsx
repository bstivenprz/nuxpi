import { PropsWithChildren } from "react";

import { SideMenu } from "@/components/side-menu";

export default async function ApplicationLayout({
  children,
}: PropsWithChildren) {
  return (
    <div className="relative flex h-screen justify-center w-full">
      <div className="fixed top-0 left-0 h-full">
        <SideMenu />
      </div>
      <div className="tablet:w-[621px] desktop:w-[638px] desktop:px-5 w-full h-screen">
        {children}
      </div>
    </div>
  );
}
