"use client";

import { useEffect, useState } from "react";
import Player from "next-video/player";
import Instaplay from "player.style/instaplay/react";
import { Button } from "@heroui/react";
import { XIcon } from "lucide-react";

export function VideoPreview({
  video,
  index,
  onRemove,
}: {
  video: Blob;
  index: number;
  onRemove?: (index: number) => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    setObjectUrl(URL.createObjectURL(video));
  }, [video]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return (
    <div className="relative rounded-xl border border-default-200 overflow-hidden w-full h-full">
      <Button
        className="absolute top-1 right-1 z-10"
        size="sm"
        radius="full"
        variant="flat"
        isIconOnly
        onPress={() => onRemove?.(index)}
      >
        <XIcon className="text-primary-foreground" size={16} />
      </Button>
      <Player
        src={objectUrl!}
        theme={Instaplay}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
