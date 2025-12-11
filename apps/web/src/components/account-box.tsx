"use client";

import Link from "next/link";

import { Avatar } from "@heroui/react";
import { FollowButton } from "./follow-button";

type AccountBoxProps = {
  name: string;
  username: string;
  picture?: string;
  description?: string;
  href?: string
  isFollowing?: boolean;
  hideButton?: boolean;
};

export function AccountBox({
  name,
  username,
  picture,
  description,
  href = `/u/${username}`,
  isFollowing,
  hideButton,
}: AccountBoxProps) {
  return (
    <Link className="flex gap-3 p-2 w-full" href={href}>
      <div>
        <Avatar src={picture} />
      </div>
      <div className="w-full">
        <div className="flex items-center mb-1">
          <div className="grow">
            <div className="font-semibold text-small">{name}</div>
            <div className="text-tiny text-default-600">{username}</div>
          </div>
          {!hideButton && (
            <div>
              <FollowButton
                size="sm"
                username={username}
                initialState={isFollowing}
              />
            </div>
          )}
        </div>
        <div className="text-small line-clamp-1">{description}</div>
      </div>
    </Link>
  );
}
