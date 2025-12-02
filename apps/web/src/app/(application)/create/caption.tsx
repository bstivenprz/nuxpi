"use client";

import { SmileIcon } from "lucide-react";

import { Controller, useFormContext } from "react-hook-form";

import emojiData from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@heroui/react";

import { CreateForm } from "./types";

export const POST_DESCRIPTION_MAX_LENGTH = 280;

export function Caption() {
  const form = useFormContext<CreateForm>();

  function onHandleEmojiSelect(emoji: { native: string }) {
    form.setValue("caption", `${form.getValues("caption")}${emoji.native}`);
  }

  return (
    <Controller
      render={({ field }) => (
        <Textarea
          classNames={{
            inputWrapper:
              "bg-transparent shadow-none data-[hover=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent group-data-[focus=true]:bg-transparent px-2",
            description: "flex justify-between",
          }}
          endContent={
            <Popover
              classNames={{
                content: "bg-transparent shadow-none",
              }}
            >
              <PopoverTrigger>
                <Button
                  className="text-default-600"
                  radius="full"
                  size="sm"
                  variant="light"
                  isIconOnly
                >
                  <SmileIcon size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <EmojiPicker
                  data={emojiData}
                  previewPosition="none"
                  onEmojiSelect={onHandleEmojiSelect}
                />
              </PopoverContent>
            </Popover>
          }
          maxLength={POST_DESCRIPTION_MAX_LENGTH}
          minRows={1}
          placeholder="¿Que tienes en mente?"
          {...field}
        />
      )}
      control={form.control}
      name="caption"
      rules={{
        minLength: 1,
      }}
    />
  );
}
