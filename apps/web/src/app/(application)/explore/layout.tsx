"use client";

import { usePathname } from "next/navigation";

import React from "react";

import { SearchHeader } from "@/components/search-header";
import { Tab, Tabs } from "@heroui/tabs";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main>
      <SearchHeader />
      <Tabs
        classNames={{
          tab: "font-semibold data-[hover-unselected=true]:opacity-hover",
          tabList: "gap-0",
          cursor: "w-full",
        }}
        variant="underlined"
        selectedKey={pathname}
        fullWidth
      >
        <Tab key="/explore/for-you" href="/explore/for-you" title="Para ti" />
        <Tab key="/explore/accounts" href="/explore/accounts" title="Cuentas" />
      </Tabs>

      {children}
    </main>
  );
}
