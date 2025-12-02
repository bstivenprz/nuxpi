"use client";

import Link from "next/link";

import { Avatar, Button } from "@heroui/react";

import { numberFormat } from "@/utils/number-format";

type AccountCardProps = {
  displayName: string;
  username: string;
  picture?: string;
  followers?: number;
};

export function AccountCard({
  displayName = "{displayName}",
  username = "username",
  followers = 0,
  picture,
}: Readonly<Partial<AccountCardProps>>) {
  return (
    <Link
      className="flex flex-col gap-4 items-center py-2 px-4 relative"
      href={`/u/${username}`}
    >
      <Avatar className="size-18" src={picture} />

      <div className="text-center">
        <div className="font-semibold text-small line-clamp-1">{displayName}</div>
        <div className="text-tiny text-default-600 line-clamp-1">{username}</div>
      </div>

      <div className="text-tiny text-default-600">{`${numberFormat(
        followers
      )} seguidores`}</div>

      <Button
        color="primary"
        size="sm"
        fullWidth
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        Seguir
      </Button>
    </Link>
  );
}
