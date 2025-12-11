"use client";

import "swiper/css";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Form } from "./schema";
import { useMultimedia } from "@/hooks/use-multimedia";
import { SwiperExtended } from "@/components/swiper-extended";
import { VideoPreview } from "./video-preview";
import { SwiperSlide } from "swiper/react";
import { Button } from "@heroui/react";
import { XIcon } from "lucide-react";
import Image from "next/image";

export function MultimediaPreview() {
  const { add, remove, multimedia } = useMultimedia();

  const { watch } = useFormContext<Form>();
  const assets = watch("assets");

  useEffect(() => {
    if (assets) {
      for (const file of assets) {
        add(file);
      }
    }
  }, [assets]);

  const render = useMemo(() => {
    const FIXED_HEIGHT = 192;

    return multimedia
      .map((m, index) => {
        if (m.mimetype.startsWith("image/")) {
          const aspectRatio =
            m.width > 0 && m.height > 0 ? m.width / m.height : 1;
          const calculatedWidth = FIXED_HEIGHT * aspectRatio;

          return (
            <SwiperSlide
              key={m.key}
              className="relative"
              style={{
                width: `${calculatedWidth}px`,
                height: `${FIXED_HEIGHT}px`,
              }}
            >
              <Button
                className="absolute top-1 right-1 z-10"
                size="sm"
                radius="full"
                variant="flat"
                isIconOnly
                onPress={() => remove(m.key)}
              >
                <XIcon className="text-primary-foreground" size={16} />
              </Button>

              <Image
                className="rounded-xl border border-default-200 h-full w-full object-contain"
                src={m.thumbnail!}
                alt="Image"
                width={m.width}
                height={m.height}
              />
            </SwiperSlide>
          );
        }

        if (m.mimetype.startsWith("video/")) {
          const aspectRatio =
            m.width > 0 && m.height > 0 ? m.width / m.height : 16 / 9;
          const calculatedWidth = FIXED_HEIGHT * aspectRatio;

          return (
            <SwiperSlide
              key={m.key}
              className="relative"
              style={{
                width: `${calculatedWidth}px`,
                height: `${FIXED_HEIGHT}px`,
              }}
            >
              <VideoPreview
                video={m.blob}
                index={index}
                onRemove={() => remove(m.key)}
              />
            </SwiperSlide>
          );
        }
      })
      .filter(Boolean);
  }, [multimedia, remove]);

  if (multimedia.length === 0) return null;

  return (
    <div className="relative my-6">
      <SwiperExtended slidesPerView="auto" spaceBetween={4} freeMode>
        {render}
      </SwiperExtended>
      <span className="text-tiny text-default-400">
        {multimedia.length} {multimedia.length === 1 ? "archivo" : "archivos"}
      </span>
    </div>
  );
}
