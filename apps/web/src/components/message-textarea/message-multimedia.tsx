import { XIcon } from "lucide-react";
import Image from "next/image";

import type { Multimedia } from "@/hooks/use-multimedia";
import { Button } from "@heroui/button";

type MessageMultimediaProps = {
  items?: Multimedia[];
  onRemove?: (key: string) => void;
};

export function MessageMultimedia({
  items = [],
  onRemove,
}: MessageMultimediaProps) {
  return (
    <div className="flex overflow-x-scroll scrollbar-hide gap-1 max-w-2xl">
      {items.map((item) => (
        <MultimediaPreview
          key={item.key}
          src={item.thumbnail ?? ""}
          onRemove={() => onRemove?.(item.key)}
        />
      ))}
    </div>
  );
}

type MultimediaPreviewProps = {
  src: string;
  onRemove?: () => void;
};

function MultimediaPreview({ src, onRemove }: MultimediaPreviewProps) {
  return (
    <div className="relative shrink-0 object-cover aspect-square size-40 border border-default-200 overflow-hidden group">
      <Button
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        variant="flat"
        size="sm"
        isIconOnly
        onPress={onRemove}
      >
        <XIcon size={16} />
      </Button>
      <Image
        className="object-cover size-full select-none"
        draggable="false"
        src={src}
        alt=""
        fill
      />
    </div>
  );
}
