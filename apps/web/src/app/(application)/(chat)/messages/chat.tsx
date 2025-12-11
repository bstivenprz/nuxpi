"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";
import { CornerDownRight, ImageIcon, Video } from "lucide-react";
import Link from "next/link";

import React from "react";

import { Avatar, tv, type VariantProps } from "@heroui/react";

dayjs.extend(relativeTime);

const chat = tv({
  slots: {
    directWrapper:
      "rounded-medium hover:bg-content2 flex items-center gap-3 px-4 py-2",
    messageWrapper: "flex items-baseline gap-1",
    message: "text-small text-foreground-600 flex items-center gap-1",
  },
  variants: {
    isUnreaded: {
      true: {
        message: "text-primary font-semibold",
      },
    },
    isFeatured: {
      true: {
        directWrapper:
          "border-danger bg-danger/5 hover:bg-danger/10 border-r-2",
      },
    },
  },
  defaultVariants: {
    isUnreaded: false,
    isFeatured: false,
  },
});

type ChatVariantProps = VariantProps<typeof chat>;

interface Props {
  name: string
  username: string;
  picture?: string;
  children?: React.ReactNode;
  amount?: number;
  date?: Date;
  type?: "text" | "image" | "video"|"ppv"
  isUnreaded?: boolean;
  isOwnLastMessage?: boolean;
}

type ChatProps = Props & ChatVariantProps;

export function Chat(props: ChatProps) {
  const {
    name,
    username,
    picture,
    date,
    amount = 0,
    isUnreaded = false,
    isOwnLastMessage = false,
  } = props;

  const isFeatured = amount > 0;

  const { directWrapper, messageWrapper, message } = chat({
    isUnreaded,
    isFeatured,
  });

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      initial={{ opacity: 1, scale: 1 }}
      key={`chat-inbox-${username}`}
      transition={{ duration: 0.3 }}
      layout
    >
      <Link className="no-underline" href={`/c/${username}`}>
        <div className={directWrapper()}>
          <div>
            <Avatar src={picture} />
          </div>

          <div className="grow">
            <div className="mb-1 flex items-baseline">
              <div className="grow font-bold">{name}</div>
              {date && (
                <div className="text-tiny text-foreground-400">
                  {dayjs(date).fromNow()}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className={messageWrapper()}>
                {isOwnLastMessage && (
                  <div>
                    <CornerDownRight className={message()} size={16} />
                  </div>
                )}

                <Message {...props} />
              </div>
              <div className="ml-auto flex items-center gap-2">
                {isFeatured && <div>{amount}</div>}
                {isUnreaded && (
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    className="fill-primary"
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Message({ amount = 0, type: variant, children }: ChatProps) {
  const isFeatured = amount > 0;

  const { message } = chat({
    isFeatured,
  });

  switch (variant) {
    case "text":
      return (
        <div className={message({ className: "line-clamp-1" })}>{children}</div>
      );
    case "image":
      return (
        <div className={message()}>
          <div>
            <ImageIcon size={16} />
          </div>
          <div className="line-clamp-1">2 fotos &middot; {children}</div>
        </div>
      );
    case "video":
      return (
        <div className={message()}>
          <div>
            <Video size={16} />
          </div>
          <div className="line-clamp-1">1:21 &middot; {children}</div>
        </div>
      );
    default:
      return null;
  }
}
