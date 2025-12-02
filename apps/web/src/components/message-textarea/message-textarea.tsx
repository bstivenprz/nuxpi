"use client";
import {
  CircleDollarSignIcon,
  FlameIcon,
  ImageIcon,
  SmileIcon,
} from "lucide-react";

import React from "react";

import { type Multimedia } from "@/hooks/use-multimedia";
import EmojiPicker from "@emoji-mart/react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  Tooltip,
} from "@heroui/react";

import { MessageMultimedia } from "./message-multimedia";
import { MessageToolbarBox } from "./message-toolbar-box";
import { useMessageTextarea } from "./use-message-textarea";
import { BitsSelector } from "../bits-selector";

export type MessageTextareaProps = {
  isTyping?: boolean;
  hideToolbar?: boolean;
  onSend: (message: string, multimedia?: Multimedia[]) => void;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
};

export function MessageTextarea(props: MessageTextareaProps) {
  const {
    message,
    multimedia,
    hasMultimedia,
    canSend,
    handleSubmitMessage,
    handleTextareaOnChange,
    handleTextareaOnSelect,
    handleTextareaKeyDown,
    handleEmojiSelect,
    handleInputChange,
    remove,
    cleanUp,
  } = useMessageTextarea(props);

  const [selectedTool, setSelectedTool] = React.useState<"bits" | "promo">();

  function selectTool(selected?: "bits" | "promo") {
    setSelectedTool((prev) => (prev === selected ? undefined : selected));
  }

  function onCloseTool() {
    setSelectedTool(undefined);
  }

  return (
    <div>
      <MessageToolbarBox
        title="Contenido multimedia"
        isOpen={multimedia.length > 0}
        onClose={cleanUp}
      >
        <MessageMultimedia items={multimedia} onRemove={remove} />
      </MessageToolbarBox>

      <MessageToolbarBox
        title="Escoge un monto"
        isOpen={selectedTool === "bits"}
        onClose={onCloseTool}
      >
        <BitsSelector />
      </MessageToolbarBox>

      <MessageToolbarBox
        title="Mensaje privado"
        isOpen={selectedTool === "promo"}
        onClose={onCloseTool}
      >
        <div className="flex flex-col gap-2">
          <Button
            variant="bordered"
            size="sm"
            as="label"
            htmlFor="message-attachment-multimedia-input"
            startContent={<ImageIcon />}
          >
            Agregar fotos y videos
          </Button>

          <div>
            <div className="text-tiny text-foreground-600 mb-1">
              Precio por ver:
            </div>
            <BitsSelector isDisabled={!hasMultimedia} />
          </div>
        </div>
      </MessageToolbarBox>

      <Textarea
        classNames={{
          base: "mb-4",
          inputWrapper: "shadow-none p-1",
          innerWrapper: "items-center",
          input:
            "data-[has-start-content=true]:ps-0 data-[has-end-content=true]:pe-0",
        }}
        color="primary"
        variant="bordered"
        minRows={1}
        placeholder="Escribe un mensaje"
        startContent={
          <Popover
            classNames={{
              content: "bg-transparent shadow-none",
            }}
          >
            <PopoverTrigger>
              <Button className="text-default-600" variant="light" isIconOnly>
                <SmileIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <EmojiPicker
                previewPosition="none"
                onEmojiSelect={handleEmojiSelect}
              />
            </PopoverContent>
          </Popover>
        }
        endContent={
          canSend ? (
            <Button
              className="font-semibold"
              variant="light"
              isDisabled={!canSend}
              onPress={handleSubmitMessage}
            >
              Enviar
            </Button>
          ) : (
            <div className="flex items-center gap-1 p-1">
              <Tooltip closeDelay={0} content="Adjuntar Fotos y videos">
                <Button
                  className="text-default-600"
                  variant="light"
                  size="sm"
                  isIconOnly
                  as="label"
                  htmlFor="message-attachment-multimedia-input"
                >
                  <ImageIcon />
                  <input
                    className="hidden"
                    type="file"
                    id="message-attachment-multimedia-input"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm,video/3gpp,video/3gp"
                    multiple
                    onChange={handleInputChange}
                  />
                </Button>
              </Tooltip>
              <Tooltip placement="bottom" closeDelay={0} content="Enviar tip">
                <Button
                  className="text-default-600"
                  variant="light"
                  size="sm"
                  isIconOnly
                  isDisabled={selectedTool === "promo"}
                  onPress={() => selectTool("bits")}
                >
                  <CircleDollarSignIcon />
                </Button>
              </Tooltip>
              <Tooltip
                placement="bottom"
                closeDelay={0}
                content="Enviar mensaje privado"
              >
                <Button
                  className="text-default-600"
                  variant="light"
                  size="sm"
                  isIconOnly
                  onPress={() => selectTool("promo")}
                >
                  <FlameIcon />
                </Button>
              </Tooltip>
            </div>
          )
        }
        fullWidth
        value={message}
        onChange={handleTextareaOnChange}
        onSelect={handleTextareaOnSelect}
        onKeyDown={handleTextareaKeyDown}
      />
    </div>
  );
}
