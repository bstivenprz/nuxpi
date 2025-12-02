"use client";

import dayjs from "dayjs";
import Link from "next/link";

import { ExpandableTextbox } from "@/components/expandable-textbox";
import { Avatar } from "@heroui/react";

interface Author {
  displayName: string;
  username: string;
  picture?: string;
}

export interface CommentProps {
  children: React.ReactNode | string;
  author?: Author;
  publishedAt?: number;
  isOwned?: boolean;
}

export function Comment({
  children,
  author = {
    displayName: "{author.displayName}",
    username: "{author.usernmae}",
  },
  publishedAt = new Date().getTime(),
  isOwned,
}: CommentProps) {
  return (
    <div className="flex items-start gap-2">
      <Link href={`/u/${author.username}`}>
        <Avatar size="sm" src={author.picture} />
      </Link>

      <div className="flex grow flex-col items-start gap-1.5">
        <Link
          className="text-small font-semibold"
          href={`/u/${author.username}`}
        >
          {author.username}
        </Link>

        <ExpandableTextbox className="text-small" characterLimit={120}>
          {children}
        </ExpandableTextbox>

        <div className="flex items-center gap-3">
          <div className="text-tiny text-foreground-500 grow">
            {dayjs(publishedAt).fromNow()}
          </div>
          {isOwned && (
            <a className="text-tiny text-danger font-semibold hover:cursor-pointer">
              Eliminar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
