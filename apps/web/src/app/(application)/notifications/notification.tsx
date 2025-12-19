import dayjs from "dayjs";
import Link from "next/link";

import React from "react";

import { Avatar, cn } from "@heroui/react";

type Author = {
  displayName: string;
  username: string;
  picture?: string;
};

export type NotificationProps = {
  author: Author;
  content: string;
  href?: string;
  notifiedAt?: number;
  endContent?: React.ReactNode;
  isReaded?: boolean;
};

export default function Notification({
  author = {
    displayName: "{author.displayName}",
    username: "{author.username}",
  },
  content = "{content}",
  href = "#",
  notifiedAt = new Date().getTime(),
  endContent,
  isReaded,
}: NotificationProps) {
  return (
    <div
      className={cn(
        "flex gap-3 py-3 px-4 items-center hover:bg-default-100",
        !isReaded && "bg-default-50 border-l-3 border-danger"
      )}
    >
      <div>
        <Avatar src={author.picture} />
      </div>
      <Link className="overflow-hidden grow" href={href}>
        <div className="text-small space-x-1 line-clamp-1">
          <div className="inline-flex font-semibold">{author.displayName}</div>
          <div className="inline-flex text-default-600">{author.username}</div>
        </div>
        <div className="text-small">{content}</div>
        <div className="text-tiny text-default-600">
          {dayjs(notifiedAt).fromNow()}
        </div>
      </Link>
      {endContent}
    </div>
  );
}
