"use client";

import { Tab, Tabs } from "@heroui/tabs";

import { Collection } from "./collection";
import { Favorites } from "./favorites";
import { Multimedia } from "./multimedia";
import { Publications } from "./publications";
import { CreateTrigger } from "@/components/create-trigger";

export function Content({ username, isOwner }: { username: string, isOwner?: boolean }) {
  return (
    <Tabs
      classNames={{
        base: "mt-2",
        tab: "font-semibold data-[hover-unselected=true]:opacity-hover",
      }}
      variant="underlined"
      fullWidth
    >
      <Tab
        className="px-3"
        title={isOwner ? "Tus publicaciones" : "Publicaciones"}
      >
        {isOwner && <CreateTrigger className="mb-2" />}
        <Publications username={username} />
      </Tab>

      {!isOwner && (
        <Tab className="px-3" title="Multimedia">
          <Multimedia username={username} />
        </Tab>
      )}

      {isOwner && (
        <>
          <Tab className="px-3" title="Comprado">
            <Collection />
          </Tab>
          <Tab className="px-3" title="Te gusta">
            <Favorites />
          </Tab>
        </>
      )}
    </Tabs>
  );
}
