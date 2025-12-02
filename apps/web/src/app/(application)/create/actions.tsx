"use client";

import { CircleDollarSignIcon, ImageIcon } from "lucide-react";

import { Button, Tooltip } from "@heroui/react";

export function Actions() {
  return (
    <div className="flex items-center gap-1 pt-2">
      <Tooltip closeDelay={0} content="Adjuntar Fotos y videos">
        <Button
          className="text-default-600"
          variant="light"
          size="sm"
          isIconOnly
          as="label"
          htmlFor="message-attachment-multimedia-input"
        >
          <ImageIcon size={20} />
          <input
            className="hidden"
            type="file"
            id="message-attachment-multimedia-input"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm,video/3gpp,video/3gp"
            multiple
          />
        </Button>
      </Tooltip>
      <Tooltip closeDelay={0} content="Publicación exclusiva">
        <Button
          className="text-default-600"
          variant="light"
          size="sm"
          isIconOnly
        >
          <CircleDollarSignIcon size={20} />
        </Button>
      </Tooltip>
    </div>
  );
}
