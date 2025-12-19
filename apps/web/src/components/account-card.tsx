"use client";

import Link from "next/link";

import { Avatar } from "@heroui/react";

import { numberFormat } from "@/utils/number-format";
import { FollowButton } from "./follow-button";
import { useState } from "react";

export function AccountCard({
  name,
  username,
  followers: initialState,
  picture,
}: {
  name: string;
  username: string;
  picture?: string;
  followers: number;
}) {
  const [followers, setFollowers] = useState(initialState);

  return (
    <Link
      className="flex flex-col gap-4 items-center py-2 px-4 relative"
      href={`/u/${username}`}
    >
      <Avatar className="size-18" src={picture} />

      <div className="text-center">
        <div className="font-semibold text-small line-clamp-1">{name}</div>
        <div className="text-tiny text-default-600 line-clamp-1">
          {username}
        </div>
      </div>

      <div className="text-tiny text-default-600">{`${numberFormat(
        followers
      )} ${followers > 1 ? "seguidores" : "seguidor"}`}</div>

      <FollowButton
        color="primary"
        size="sm"
        fullWidth
        username={username}
        onSuccess={() => {
          setFollowers((prev) => prev + 1);
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />
    </Link>
  );
}
