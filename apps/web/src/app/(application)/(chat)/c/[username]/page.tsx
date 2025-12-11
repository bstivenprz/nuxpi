"use client";

import { Header } from "@/components/header";
import { MessageTextarea } from "@/components/message-textarea/message-textarea";
import { Avatar } from "@heroui/react";
import { notFound, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { Messages } from "./messages";
import { ConversationObject } from "@/api/types/chat.types";
import { PaginationObject } from "@/api/types/response.types";
import { MessageObject } from "@/api/types/chat.types";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useProfileId } from "@/hooks/use-profile-id";

export default function Chat() {
  const params = useParams<{ username: string }>()
  const queryClient = useQueryClient()
  const profileId = useProfileId()

  const { data: conversation, isLoading, isError } = useQuery({
    queryKey: ['conversation', params.username],
    queryFn: () => api<ConversationObject>(`/conversation/${params.username}`),
    select: response => response.data
  })

  const { sendMessage: sendMessageWs } = useChatSocket({
    conversationId: conversation?.id,
    profileId,
    enabled: Boolean(conversation?.id && profileId),
  })

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      sendMessageWs(message);
      return message;
    },
    // onMutate: async (message) => {
    //   if (!conversation?.id) return;

    //   const queryKey = ["messages", conversation.id];

    //   await queryClient.cancelQueries({ queryKey });
    //   const previousMessages =
    //     queryClient.getQueryData<PaginationObject<MessageObject>>(queryKey);

    //   if (!previousMessages) return { previousMessages };

    //   const fallbackSender =
    //     previousMessages.data.find((m) => m.is_owner)?.sender ?? {
    //       name: "You",
    //       username: "you",
    //       presentation: "",
    //       gender: "prefer_not_say",
    //       is_following: false,
    //       is_owner: true,
    //     };

    //   const optimisticMessage: MessageObject = {
    //     type: "text",
    //     content: message,
    //     sender: fallbackSender,
    //     is_owner: true,
    //   };

    //   queryClient.setQueryData<PaginationObject<MessageObject>>(queryKey, {
    //     ...previousMessages,
    //     data: [optimisticMessage, ...(previousMessages.data ?? [])],
    //     meta: previousMessages.meta
    //       ? {
    //           ...previousMessages.meta,
    //           total_count: previousMessages.meta.total_count + 1,
    //         }
    //       : previousMessages.meta,
    //   });

    //   return { previousMessages };
    // },
    // onError: (_err, _variables, context) => {
    //   if (context?.previousMessages && conversation?.id) {
    //     queryClient.setQueryData(
    //       ["messages", conversation.id],
    //       context.previousMessages,
    //     );
    //   }
    // },
  });

  function send(message: string) {
    if (!conversation?.id) return;
    sendMessage(message);
  }

  if (isError) return notFound()
  if (!conversation || isLoading) return <>Cargando...</>

  return (
    <main className="relative mobile:px-3">
      <Header
        startContent={
          <div>
            <Avatar size="sm" src={conversation.participant.picture} />
          </div>
        }
        disableScrollHide
      >
        {conversation.participant.name}
      </Header>

      <Messages conversation={conversation.id} />

      <div className="sticky bottom-0 left-0 w-full pb-1 bg-background">
        <MessageTextarea onSend={send} />
      </div>
    </main>
  );
}
