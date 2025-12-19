import React from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { addToast } from "@heroui/react";

export interface Multimedia {
  key: string;
  mimetype: string;
  blob: Blob;
  thumbnail?: string;
  croppedBlob?: Blob;
  croppedThumbnail?: string;
  previewUrl?: string;
  size: number;
  width: number;
  height: number;
}

export async function mutationFnUploadMultimedia({
  file,
  width,
  height,
  key,
  exclusive,
}: {
  file: File;
  width: number;
  height: number;
  key: string;
  exclusive: boolean;
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("width", width.toString());
  formData.append("height", height.toString());
  formData.append("exclusive", exclusive.toString());
  const response = await api.post<string>("/assets/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { assetId: response.data, key };
}

export interface UseMultimediaOptions {
  onUploadSuccess?: (assetId: string, key: string) => void;
  onRemove?: (key: string, assetId?: string) => void;
  exclusive?: boolean;
}

export function useMultimedia(options?: UseMultimediaOptions) {
  const { onUploadSuccess, onRemove: onRemoveCallback, exclusive = false } = options || {};
  const [multimedia, setMultimedia] = React.useState<Multimedia[]>([]);
  const counterRef = React.useRef(0);
  const uploadedKeysRef = React.useRef<Set<string>>(new Set());

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    for (const file of files) {
      add(file);
    }

    event.target.value = "";
  }

  function handleCroppedChange(key: string, blob: Blob) {
    setMultimedia((prev) =>
      prev.map((m) => {
        if (m.key === key) {
          if (m.croppedThumbnail) {
            URL.revokeObjectURL(m.croppedThumbnail);
          }

          return {
            ...m,
            croppedBlob: blob,
            croppedThumbnail: URL.createObjectURL(blob),
          };
        }
        return m;
      })
    );
  }

  function readImageMetadata(file: File): Promise<{
    width: number;
    height: number;
  }> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };

      img.src = url;
    });
  }

  function add(blob: Blob) {
    counterRef.current += 1;
    const key = `${counterRef.current}-${blob.size}`;

    const media: Multimedia = {
      key,
      mimetype: blob.type,
      blob,
      size: blob.size,
      width: 0,
      height: 0,
    };

    if (blob.type.startsWith("video/")) {
      return readVideoMetadata(new File([blob], "video", { type: blob.type }))
        .then(({ thumbnail, width, height }) => {
          if (thumbnail) {
            media.thumbnail = thumbnail;
            media.width = width;
            media.height = height;
            setMultimedia((prev) => [...prev, media]);
            return media;
          }
        })
        .catch((error) => {
          console.error("Error generating video thumbnail:", error);
        });
    } else {
      media.thumbnail = URL.createObjectURL(blob);
      return readImageMetadata(new File([blob], "image", { type: blob.type }))
        .then(({ width, height }) => {
          media.width = width;
          media.height = height;
          setMultimedia((prev) => [...prev, media]);
          return media;
        })
        .catch((error) => {
          console.error("Error reading image metadata:", error);
          // Still add the media even if metadata reading fails
          setMultimedia((prev) => [...prev, media]);
          return media;
        });
    }
  }

  function remove(key: string) {
    setMultimedia((prev) => {
      const mediaToRemove = prev.find((m) => m.key === key);

      if (mediaToRemove) {
        URL.revokeObjectURL(mediaToRemove.thumbnail!);
        if (mediaToRemove.croppedThumbnail) {
          URL.revokeObjectURL(mediaToRemove.croppedThumbnail);
        }
      }

      return prev.filter((m) => m.key !== key);
    });
  }

  function cleanUp() {
    multimedia.forEach((media) => {
      URL.revokeObjectURL(media.thumbnail!);
      if (media.croppedThumbnail) {
        URL.revokeObjectURL(media.croppedThumbnail);
      }
    });

    setMultimedia([]);
  }

  function drawThumbnail(videoElement: HTMLVideoElement) {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }

  function readVideoMetadata(file: File): Promise<{
    duration: number;
    width: number;
    height: number;
    thumbnail: string | null;
  }> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");

      video.preload = "metadata";
      video.src = url;
      video.muted = true;
      video.playsInline = true;

      video.addEventListener("loadedmetadata", () => {
        const duration = video.duration;
        // Seek to 1 second to capture thumbnail
        video.currentTime = Math.min(1, duration / 2);
      });

      video.addEventListener("seeked", () => {
        const thumbnail = drawThumbnail(video);
        URL.revokeObjectURL(url);
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          thumbnail,
        });
      });

      video.addEventListener("error", (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      });
    });
  }

  const { mutate: uploadFile } = useMutation({
    mutationKey: ["upload-multimedia"],
    mutationFn: mutationFnUploadMultimedia,
    onSuccess: ({ assetId, key }) => {
      onUploadSuccess?.(assetId, key);
    },
    onError: (error, variables) => {
      const key = variables.key;
      uploadedKeysRef.current.delete(key);
      remove(key);

      addToast({
        title: "Error al subir archivo",
        description:
          "No se pudo subir el archivo. Por favor, inténtalo de nuevo.",
        color: "danger",
      });
    },
  });

  React.useEffect(() => {
    for (const media of multimedia) {
      if (uploadedKeysRef.current.has(media.key)) {
        continue;
      }

      if (media.width === 0 || media.height === 0) {
        continue;
      }

      const file =
        media.blob instanceof File
          ? media.blob
          : new File([media.blob], `file-${media.key}`, {
              type: media.mimetype,
            });

      uploadedKeysRef.current.add(media.key);

      uploadFile({
        file,
        key: media.key,
        width: media.width,
        height: media.height,
        exclusive,
      });
    }

    const currentKeys = new Set(multimedia.map((m) => m.key));
    for (const key of uploadedKeysRef.current) {
      if (!currentKeys.has(key)) {
        uploadedKeysRef.current.delete(key);
      }
    }
  }, [multimedia]);

  function handleRemove(key: string) {
    uploadedKeysRef.current.delete(key);
    remove(key);
    onRemoveCallback?.(key);
  }

  const previewUrls = React.useMemo(
    () =>
      multimedia
        .map((m) => m.previewUrl)
        .filter((url): url is string => url !== undefined),
    [multimedia]
  );

  return {
    multimedia,
    previewUrls,
    add,
    remove,
    handleRemove,
    cleanUp,
    handleInputChange,
    handleCroppedChange,
  };
}

export type UseMultimedia = ReturnType<typeof useMultimedia>;
