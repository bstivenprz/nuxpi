"use client";

import { ImagePlusIcon } from "lucide-react";

import { Button } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { Form } from "./schema";

export function Tools() {
  const { register } = useFormContext<Form>();

  return (
    <div className="flex items-center gap-2 pt-2">
      <Button
        className="text-default-600"
        variant="light"
        size="sm"
        as="label"
        htmlFor="create-publication-attachment-images-input"
        isIconOnly
      >
        <ImagePlusIcon size={20} />
        <input
          className="hidden"
          type="file"
          id="create-publication-attachment-images-input"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm,video/3gpp,video/3gp"
          multiple
          {...register("assets")}
        />
      </Button>
    </div>
  );
}
