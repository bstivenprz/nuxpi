import React from "react";

import { useMultimedia } from "@/hooks/use-multimedia";

import { MessageTextareaProps } from "./message-textarea";

const TYPING_DEBOUNCE_TIME = 2500;

export function useMessageTextarea(props: MessageTextareaProps) {
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const stopTypingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [message, setMessage] = React.useState<string>("");
  const [cursorLocation, setCursorLocation] = React.useState<number>(0);

  const multimediaHook = useMultimedia();

  const hasMultimedia = multimediaHook.multimedia.length > 0;
  const hasMessage = message.trim().length > 0;
  const canSend = hasMessage || hasMultimedia;

  function handleTextareaOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setMessage(event.target.value);
    handleTypingEvent();
  }

  function handleTextareaOnSelect(event: React.ChangeEvent<HTMLInputElement>) {
    setCursorLocation(event.target.selectionStart || 0);
  }

  function handleTextareaKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!canSend) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitMessage();
    }
  }

  function handleTypingEvent() {
    if (!props.onStartTyping || !props.onStopTyping) return;

    if (!props.isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        props.onStartTyping?.();
      }, 300);
    }

    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }

    stopTypingTimeoutRef.current = setTimeout(() => {
      props.onStopTyping?.();
    }, TYPING_DEBOUNCE_TIME);
  }

  function handleEmojiSelect(emoji: { native: string }) {
    setMessage(
      (prev) =>
        prev.slice(0, cursorLocation) +
        emoji.native +
        prev.slice(cursorLocation)
    );
  }

  function handleSubmitMessage() {
    props.onSend(message, multimediaHook.multimedia);
    reset();
  }

  function reset() {
    if (multimediaHook.multimedia.length > 0) multimediaHook.cleanUp();
    setMessage("");
  }

  return {
    message,
    hasMessage,
    hasMultimedia,
    canSend,
    handleSubmitMessage,
    handleTextareaOnChange,
    handleTextareaOnSelect,
    handleTextareaKeyDown,
    handleEmojiSelect,
    reset,
    ...multimediaHook,
    ...props,
  };
}

export type UseMessageInput = ReturnType<typeof useMessageTextarea>;
