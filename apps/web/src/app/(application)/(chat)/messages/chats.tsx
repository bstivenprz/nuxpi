import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Chat } from "./chat";
import { PaginationObject } from "@/api/types/pagination.object";
import { ConversationParticipantObject } from "@/api/types/chat.types";
import { Button } from "@heroui/react";
import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/empty-state";
import { Loader } from "@/components/ui/loader";

export function Chats({ filter }: { filter: "all" | "unread" | "featured" }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["inbox", filter],
    queryFn: () =>
      api<PaginationObject<ConversationParticipantObject>>("/inbox", {
        params: {
          page,
          filter,
        },
      }),
    select: (response) => response.data,
    throwOnError: true,
  });

  if (!data && isLoading) return <Loader />;
  if (data?.meta.page_count === 0)
    return <EmptyState>Aún no has iniciado una conversación.</EmptyState>;

  return (
    <div className="flex flex-col overflow-auto">
      {data?.data.map((chat, index) => (
        <Chat
          key={`chat-inbox-${index}`}
          name={chat.participant.name}
          username={chat.participant.username}
          picture={chat.participant.picture}
          type={chat.last_message.type}
          isUnreaded={chat.unread_message_count > 0}
          isOwnLastMessage={chat.last_message.is_owner}
        >
          {chat.last_message.content}
        </Chat>
      ))}

      {data?.meta.has_next_page && (
        <Divider>
          <Button
            className="font-medium"
            variant="light"
            size="sm"
            onPress={() => setPage((prev) => prev + 1)}
          >
            Mostrar más
          </Button>
        </Divider>
      )}
    </div>
  );
}
