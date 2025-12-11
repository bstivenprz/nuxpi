"use client";

import dayjs from "dayjs";
import { FlameIcon, MessageSquareIcon, PinIcon } from "lucide-react";
import Link from "next/link";

import React from "react";

import { numberFormat } from "@/utils/number-format";
import { Avatar, Button } from "@heroui/react";

import { CommentTextarea } from "./comment-textarea";
import { OptionsDropdown } from "./options-dropdown";
import { LikeButton } from "./like-button";
import { Comments, CommentsRef } from "./comments";

interface AuthorProps {
  name: string;
  username: string;
  picture?: string;
  isCreator?: boolean;
}

export interface PublicationProps {
  externalId: string;
  children?: React.ReactNode;
  author: AuthorProps;
  totalLikes: number;
  totalComments: number;
  caption?: string;
  type?: "thought" | "photo" | "video";
  publishedAt?: number;
  isPinned?: boolean;
  isOwner?: boolean;
  isLiked?: boolean;
}

export function Publication({
  externalId,
  children,
  author,
  totalLikes,
  totalComments,
  caption,
  isPinned,
  isLiked,
  isOwner,
  publishedAt,
}: PublicationProps) {
  const [showCommentsSection, setShowCommentsSection] = React.useState(false);
  const commentsRef = React.useRef<CommentsRef>(null);

  return (
    <div className="py-4">
      {isPinned && (
        <div className="text-small text-default-600 px-2 pt-2">
          <PinIcon size={16} className="mr-1 inline-block" />
          Publicación fijada
        </div>
      )}
      <div className="flex gap-3">
        <Link href={`/u/${author.username}`}>
          <Avatar src={author.picture} />
        </Link>

        <div className="flex w-full flex-col gap-3">
          <div className="flex">
            <div className="text-small grow">
              <div className="flex items-center gap-2">
                <Link className="font-semibold" href={`/u/${author.username}`}>
                  {author.name}
                </Link>
                <div className="text-default-400">
                  {dayjs(publishedAt).fromNow()}
                </div>
              </div>
              <Link className="text-default-400" href={`/u/${author.username}`}>
                {author.username}
              </Link>
            </div>
            <OptionsDropdown isOwner={isOwner} />
          </div>

          {caption && <p className="mobile:text-base/5l">{caption}</p>}

          {children}

          <div className="flex -translate-x-2 items-center">
            <div className="flex grow items-center gap-1">
              <LikeButton
                id={externalId}
                count={totalLikes}
                isLiked={isLiked}
              />

              <Button
                className="text-default-600"
                variant="light"
                size="sm"
                radius="full"
                startContent={<MessageSquareIcon size={20} />}
                onPress={() => setShowCommentsSection((prev) => !prev)}
                isIconOnly={totalComments === 0}
              >
                {totalComments > 0 && numberFormat(totalComments)}
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
        <div className="px-1">
          <CommentTextarea
            publication={externalId}
            commentsRef={commentsRef}
          />
          <Comments ref={commentsRef} publication={externalId} />
        </div>
      )}
    </div>
  );
}
