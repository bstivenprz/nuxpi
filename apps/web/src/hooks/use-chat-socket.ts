import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { api } from "@/api/axios";
import { MessageObject } from "@/api/types/chat.types";
import { PaginationObject } from "@/api/types/response.types";
import { useQueryClient } from "@tanstack/react-query";

type ChatSocketOptions = {
  conversationId?: string;
  profileId?: string | null;
  enabled?: boolean;
};

type ChatSocket = {
  sendMessage: (content: string) => void;
  isConnected: boolean;
};

const fallbackApiUrl = "http://localhost:3000/api";

export function useChatSocket({
  conversationId,
  profileId,
  enabled = true,
}: ChatSocketOptions): ChatSocket {
  const [isConnected, setIsConnected] = useState(false);

  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  const wsUrl = useMemo(() => {
    const baseURL = api.defaults.baseURL ?? fallbackApiUrl;
    try {
      const url = new URL(baseURL);
      url.pathname = "";
      return `${url.origin}/chat`;
    } catch {
      return `${fallbackApiUrl.replace(/\/api$/, "")}/chat`;
    }
  }, []);

  const upsertMessage = useCallback(
    (message: MessageObject) => {
      if (!conversationId) return;
      queryClient.setQueryData<PaginationObject<MessageObject>>(
        ["messages", conversationId],
        (prev) => {
          if (!prev) return prev;

          const data = prev.data ? [...prev.data] : [];
          const existingIndex = data.findIndex(
            (item) =>
              item.is_owner === message.is_owner &&
              item.content === message.content
          );

          if (existingIndex >= 0) {
            data[existingIndex] = message;
          } else {
            data.unshift(message);
          }

          return {
            ...prev,
            data,
          };
        }
      );
    },
    [conversationId, queryClient]
  );

  useEffect(() => {
    if (!enabled || !conversationId || !profileId) return;

    const socket = io(wsUrl, {
      auth: { profile_id: profileId },
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("conversation.join", { conversation_id: conversationId });
    });

    socket.on(
      "conversation.history",
      (history: PaginationObject<MessageObject>) => {
        queryClient.setQueryData(["messages", conversationId], history);
      }
    );

    socket.on("message.sent", (message: MessageObject) => {
      upsertMessage({ ...message, is_owner: true });
    });

    socket.on("message.received", (message: MessageObject) => {
      upsertMessage({ ...message, is_owner: false });
    });

    socket.on("connect_error", (error) => {
      console.error("Chat websocket connection error", error);
    });

    socketRef.current = socket;

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, enabled, profileId, queryClient, upsertMessage, wsUrl]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      const socket = socketRef.current;
      if (!socket || !socket.connected || !conversationId) return;

      socket.emit("message.send", {
        conversation_id: conversationId,
        content,
      });
    },
    [conversationId]
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    setIsConnected(socket.connected);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [conversationId, enabled, profileId, wsUrl]);

  return {
    sendMessage,
    isConnected,
  } as const;
}
