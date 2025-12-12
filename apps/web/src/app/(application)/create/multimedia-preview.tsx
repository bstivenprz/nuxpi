"use client";

import "swiper/css";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Form } from "./schema";
import { useMultimedia } from "@/hooks/use-multimedia";
import { SwiperExtended } from "@/components/swiper-extended";
import { VideoPreview } from "./video-preview";
import { SwiperSlide } from "swiper/react";
import { Button, addToast } from "@heroui/react";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export function MultimediaPreview() {
  const { add, remove, multimedia } = useMultimedia();
  const uploadedKeysRef = useRef<Set<string>>(new Set());

  const { mutate } = useMutation({
    mutationFn: async ({
      file,
      width,
      height,
    }: {
      file: File;
      key: string;
      width: number;
      height: number;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("width", width.toString());
      formData.append("height", height.toString());
      return api.post("/assets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });

  const { watch } = useFormContext<Form>();
  const assets = watch("assets");

  useEffect(() => {
    if (assets) {
      for (const file of assets) {
        add(file);
      }
    }
  }, [assets]);

  useEffect(() => {
    for (const media of multimedia) {
      if (uploadedKeysRef.current.has(media.key)) {
        continue;
      }

      const file =
        media.blob instanceof File
          ? media.blob
          : new File([media.blob], `file-${media.key}`, {
              type: media.mimetype,
            });

      uploadedKeysRef.current.add(media.key);

      mutate(
        {
          file,
          key: media.key,
          width: media.width,
          height: media.height,
        },
        {
          onError: (error, variables) => {
            const key = variables.key;
            remove(key);
            uploadedKeysRef.current.delete(key);

            addToast({
              title: "Error al subir archivo",
              description:
                "No se pudo subir el archivo. Por favor, inténtalo de nuevo.",
              color: "danger",
            });
          },
        }
      );
    }

    const currentKeys = new Set(multimedia.map((m) => m.key));
    for (const key of uploadedKeysRef.current) {
      if (!currentKeys.has(key)) {
        uploadedKeysRef.current.delete(key);
      }
    }
  }, [multimedia, mutate, remove]);

  const handleRemove = useCallback((key: string) => {
    uploadedKeysRef.current.delete(key);
    remove(key);
  }, [remove]);

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
                onPress={() => handleRemove(m.key)}
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
                onRemove={() => handleRemove(m.key)}
              />
            </SwiperSlide>
          );
        }
      })
      .filter(Boolean);
  }, [multimedia, handleRemove]);

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
