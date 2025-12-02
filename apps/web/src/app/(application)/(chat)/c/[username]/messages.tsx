"use client";

import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Message } from "./message";
import { PaginationObject } from "@/api/types/response.types";
import { MessageObject } from "@/api/types/chat.types";

export function Messages({ conversation }: { conversation: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["messages", conversation],
    queryFn: () =>
      api<PaginationObject<MessageObject>>(
        `/conversation/${conversation}/messages`
      ),
    select: (response) => response.data,
  });

  if (isError) return notFound();

  if (!data || isLoading) return <>Loading...m</>;

  return (
    <div className="my-2 px-1">
      {data.data.map((message, index) => (
        <Message
          key={`message-${index}`}
          picture={message.sender?.picture}
          isResponse={message.is_owner}
        >
          {message.content}
        </Message>
      ))}
    </div>
  );
}
