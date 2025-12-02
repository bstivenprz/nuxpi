"use client";

import { Avatar, AvatarGroup } from "@heroui/avatar";

type RadioAvatarGroupProps = {
  items?: string[];
};

export function RadioAvatarGroup({ items = [] }: RadioAvatarGroupProps) {
  return (
    <AvatarGroup max={3} renderCount={() => void 0} isBordered={false}>
      {items.map((item, index) => (
        <Avatar
          key={`avatar-group-item-${index}`}
          classNames={{
            base: "size-6 data-[hover=true]:translate-x-0",
          }}
          src={item}
        />
      ))}
    </AvatarGroup>
  );
}
