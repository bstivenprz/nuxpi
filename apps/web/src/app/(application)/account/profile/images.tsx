"use client";

import { Avatar } from "@heroui/avatar";
import React from "react";
import Image from "next/image";
import { Button } from "@heroui/button";
import {
  addToast,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";
import { removeImageAction, updateImageAction } from "./actions";
import imageCompression from "browser-image-compression";
import { ImageCropPopUp } from "@/components/popups/image-crop-popup";

type ImageState = {
  preview: string | undefined;
  uploading: boolean;
};

export function Images({
  username,
  cover,
  picture,
}: {
  username: string;
  cover?: string;
  picture?: string;
}) {
  const headerInputRef = React.useRef<HTMLInputElement>(null);
  const pictureInputRef = React.useRef<HTMLInputElement>(null);

  const modal = useDisclosure();

  const [coverImage, setCoverImage] = React.useState<ImageState>({
    preview: cover,
    uploading: false,
  });

  const [pictureImage, setPictureImage] = React.useState<ImageState>({
    preview: picture,
    uploading: false,
  });

  const [imageToCrop, setImageToCrop] = React.useState<string>();
  const [cropType, setCropType] = React.useState<"cover" | "picture">("cover");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = e.target.name as "cover" | "picture";

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setCropType(type);
      modal.onOpen();
    };

    reader.readAsDataURL(file);
  }

  async function browserCompressImage(file: File, type: "cover" | "picture") {
    const options = {
      maxSizeMB: type === "cover" ? 1 : 0.5,
      maxWidthOrHeight: type === "cover" ? 1920 : 800,
      useWebWorker: true,
      fileType: "image/jpeg",
      initialQuality: 0.85,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      return file;
    }
  }

  async function handleCropComplete(croppedFile: File) {
    const setState = cropType === "cover" ? setCoverImage : setPictureImage;

    const reader = new FileReader();
    reader.onloadend = () => {
      setState({
        preview: reader.result as string,
        uploading: true,
      });
    };
    reader.readAsDataURL(croppedFile);

    try {
      const compressedFile = await browserCompressImage(croppedFile, cropType);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("type", cropType);
      formData.append("username", username);

      const result = await updateImageAction(formData);

      if (!result.success) throw new Error(result.error);

      if (cropType === "cover" && headerInputRef.current) {
        headerInputRef.current.value = "";
      } else if (cropType === "picture" && pictureInputRef.current) {
        pictureInputRef.current.value = "";
      }

      addToast({
        description: "Imagen actualizada correctamente.",
      });
      setState({
        preview: result.value,
        uploading: false,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      addToast({
        color: "danger",
        title: "Algo pasó aquí",
        description: "Tuvimos un error en estos momentos.",
      });
      setState({
        preview: undefined,
        uploading: false,
      });
    }
  }

  async function handleRemoveImage(type: "cover" | "picture") {
    const setState = type === "cover" ? setCoverImage : setPictureImage;
    setState((prev) => ({ ...prev, uploading: true }));

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("type", type);

      const result = await removeImageAction(formData);
      if (!result.success) throw new Error(result.error);

      setState({
        preview: undefined,
        uploading: false,
      });
    } catch (error) {
      console.log("Error deleting image:", error);
      addToast({
        color: "danger",
        title: "Algo pasó aquí",
        description: "Tuvimos un error en estos momentos.",
      });
    } finally {
      setState((prev) => ({ ...prev, uploading: false }));
    }
  }

  return (
    <div className="relative mb-4">
      <div className="relative w-full aspect-[3.6/1]">
        <div className="absolute top-0 right-0 p-3 z-10">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="faded"
                endContent={<ChevronDownIcon size={18} />}
              >
                Cambiar imagen
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              disabledKeys={!coverImage.preview ? ["remove"] : undefined}
            >
              <DropdownItem
                key="upload"
                onPress={() => headerInputRef.current?.click()}
              >
                Subir foto
              </DropdownItem>
              <DropdownItem
                key="remove"
                className="text-danger"
                color="danger"
                onPress={() => handleRemoveImage("cover")}
              >
                Quitar foto actual
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {!coverImage.preview && <div className="bg-default-100 size-full" />}
        {coverImage.preview && (
          <Image
            className={`size-full object-cover object-center ${coverImage.uploading ? "opacity-60" : "opacity-100"}`}
            src={coverImage.preview}
            alt=""
            fill
          />
        )}
      </div>

      <div className="flex justify-center">
        <Dropdown>
          <DropdownTrigger>
            <div className="-mt-20">
              <Avatar
                className={`size-28 cursor-pointer ${pictureImage.uploading ? "opacity-60" : "opacity-100"}`}
                classNames={{
                  base: "bg-default-100 ring-4 ring-background",
                  icon: "text-default-300",
                }}
                src={pictureImage.preview}
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu
            variant="flat"
            disabledKeys={!pictureImage.preview ? ["remove"] : undefined}
          >
            <DropdownItem
              key="upload"
              onPress={() => pictureInputRef.current?.click()}
            >
              Subir foto
            </DropdownItem>
            <DropdownItem
              key="remove"
              className="text-danger"
              color="danger"
              onPress={() => handleRemoveImage("picture")}
            >
              Quitar foto actual
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <input
        className="hidden"
        name="cover"
        accept="image/jpeg,image/png,image/heic,image/heif"
        type="file"
        onChange={handleFileChange}
        ref={headerInputRef}
      />
      <input
        className="hidden"
        name="picture"
        accept="image/jpeg,image/png,image/heic,image/heif"
        type="file"
        onChange={handleFileChange}
        ref={pictureInputRef}
      />

      <ImageCropPopUp
        size="lg"
        hideCloseButton
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        onCropComplete={handleCropComplete}
        cropperProps={{
          image: imageToCrop,
          aspect: cropType === "cover" ? 3 / 1 : 1,
          cropShape: cropType === "cover" ? "rect" : "round",
        }}
      />
    </div>
  );
}
