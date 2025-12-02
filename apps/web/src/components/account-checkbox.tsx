"use client";

import { Checkbox, cn, User, UserProps } from "@heroui/react";

type AccountCheckbox = {
  user: UserProps;
  value: string;
};

export function AccountCheckbox({ user, value }: AccountCheckbox) {
  return (
    <Checkbox
      classNames={{
        base: cn(
          "flex flex-row-reverse w-full bg-content1 m-0 max-w-full",
          "hover:bg-content2 items-center justify-center",
          "cursor-pointer gap-2 p-3"
        ),
        label: "w-full",
      }}
      value={value}
    >
      <User
        classNames={{
          name: "tablet:max-w-[260px] line-clamp-1 leading-tight font-semibold text-ellipsis",
        }}
        avatarProps={{
          size: "sm",
          ...user.avatarProps,
        }}
        description={user.description}
        name={user.name}
      />
    </Checkbox>
  );
}
