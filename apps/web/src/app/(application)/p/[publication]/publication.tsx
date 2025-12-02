"use client";

import dayjs from "dayjs";
import { FlameIcon, HeartIcon, MessageSquareIcon, PinIcon } from "lucide-react";
import Link from "next/link";

import React from "react";

import { numberFormat } from "@/utils/number-format";
import { Avatar, Button } from "@heroui/react";

import { Comment } from "./comment";
import { CommentTextarea } from "./comment-textarea";
import { OptionsDropdown } from "./options-dropdown";

interface AuthorProps {
  displayName: string;
  username: string;
  picture?: string;
  isCreator?: boolean;
}

interface InsightsProps {
  likesCount: number;
  commentsCount: number;
}

export interface PublicationProps {
  externalId: string;
  children?: React.ReactNode;
  author?: AuthorProps;
  insights?: InsightsProps;
  caption?: string;
  type?: "thought" | "photo" | "video";
  publishedAt?: number;
  isPinned?: boolean;
}

export function Publication({
  children,
  author = {
    displayName: "{author.displayName}",
    username: "{author.username}",
  },
  insights = {
    commentsCount: 0,
    likesCount: 0,
  },
  caption,
  isPinned,
  publishedAt = new Date().getTime(),
}: Readonly<PublicationProps>) {
  const [showCommentsSection, setShowCommentsSection] = React.useState(false);

  function addLikeToPublication() {}

  function showOrHideCommentsSection() {
    setShowCommentsSection((prev) => !prev);
  }

  return (
    <div>
      {isPinned && (
        <div className="text-small text-default-600 px-2 pt-2">
          <PinIcon size={16} className="mr-1 inline-block" />
          Publicación fijada
        </div>
      )}
      <div className="flex gap-3 p-3">
        <Link href={`/u/${author.username}`}>
          <Avatar src={author.picture} />
        </Link>

        <div className="flex w-full flex-col gap-3">
          <div className="flex">
            <div className="text-small grow">
              <div className="flex items-center gap-2">
                <Link className="font-semibold" href={`/u/${author.username}`}>
                  {author.displayName}
                </Link>
                <div className="text-default-400">
                  {dayjs(publishedAt).fromNow()}
                </div>
              </div>
              <Link className="text-default-400" href={`/u/${author.username}`}>
                @{author.username}
              </Link>
            </div>
            <OptionsDropdown />
          </div>

          {caption && (
            <div className="mobile:text-base/5 desktop:text-small">
              {caption}
            </div>
          )}

          {children}

          <div className="flex -translate-x-3 items-center">
            <div className="flex grow items-center">
              <Button
                className="text-default-600"
                variant="light"
                size="sm"
                startContent={<HeartIcon size={20} />}
              >
                {insights.likesCount > 0 && numberFormat(insights.likesCount)}
              </Button>

              <Button
                className="text-default-600"
                variant="light"
                size="sm"
                startContent={<MessageSquareIcon size={20} />}
                onPress={showOrHideCommentsSection}
              >
                {insights.commentsCount > 0 &&
                  numberFormat(insights.commentsCount)}
              </Button>
            </div>

            {author.isCreator && (
              <Button variant="light" size="sm" color="danger">
                <FlameIcon fill="hsl(var(--heroui-danger) / 1)" size={20} />
                <span className="text-small font-semibold">Apoyar</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {showCommentsSection && (
        <div className="flex flex-col items-center p-3">
          <div className="flex w-full flex-col gap-2">
            <Comment>{`{comment}`}</Comment>

            <Button className="font-medium" variant="light" size="sm">
              Ver más comentarios
            </Button>
          </div>

          <CommentTextarea />
        </div>
      )}
    </div>
  );
}
