"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Player from "next-video/player";
import Instaplay from "player.style/instaplay/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Button } from "@heroui/react";
import { UnlockIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { AssetObject } from "@/api/types/content.types";

interface AssetProps {
  id: string;
  public_id: string;
  type: "image" | "video";
  public_url: string;
  placeholder_url: string;
  width: number;
  height: number;
}

export function Multimedia({ assets }: { assets: AssetProps[] }) {
  const [localAssets, setLocalAssets] = useState<AssetProps[]>(assets);

  useEffect(() => {
    setLocalAssets(assets);
  }, [assets]);

  const { mutate: unlockAsset, isSuccess: isUnlockingAsset } = useMutation({
    mutationFn: async (assetId: string) => {
      const result = await api.get<AssetObject>(`/assets/${assetId}/unlock`);
      return result.data;
    },
    onSuccess: (unlockedAsset) => {
      setLocalAssets((prev) =>
        prev.map((asset) =>
          asset.id === unlockedAsset.id
            ? {
                ...asset,
                public_url: unlockedAsset.public_url,
                placeholder_url: unlockedAsset.placeholder_url,
                width: unlockedAsset.width ?? asset.width,
                height: unlockedAsset.height ?? asset.height,
              }
            : asset,
        ),
      );
    },
  });

  const render = useMemo(() => {
    if (localAssets.length === 0) return null;

    return localAssets
      .map((asset: AssetProps) => {
        if (asset.type === "image") {
          return (
            // ✅ CAMBIO 1: antes era "max-w-lg". Ahora es w-full para que NO limite en mobile.
            <SwiperSlide className="w-full" key={asset.public_id}>
              <div
                // ✅ CAMBIO 2: asegurar que el contenedor sea w-full
                className="relative w-full"
                style={{
                  aspectRatio:
                    asset.width > 0 && asset.height > 0
                      ? `${asset.width} / ${asset.height}`
                      : "1 / 1",
                }}
              >
                {!isUnlockingAsset && (
                  <div className="absolute inset-0 size-full flex flex-col justify-center items-center gap-4 z-10">
                    <div className="text-white text-large font-medium">
                      Contenido exclusivo
                    </div>
                    <div className="text-white/80 text-small text-center">
                      Para ver este contenido, debes adquirir la publicación.
                    </div>
                    <Button
                      className="text-white"
                      variant="bordered"
                      startContent={<UnlockIcon size={16} />}
                      onPress={() => unlockAsset(asset.id)}
                    >
                      Ver contenido
                    </Button>
                  </div>
                )}

                {!isUnlockingAsset && (
                  <div className="absolute inset-0 size-full bg-black/60 rounded-xl" />
                )}

                <Image
                  className="rounded-xl border border-default-200 w-full h-full object-contain"
                  src={asset.public_url}
                  blurDataURL={asset.placeholder_url}
                  alt="Image"
                  width={asset.width}
                  height={asset.height}
                  // ✅ CAMBIO 3: height "auto" -> "100%" para que llene el contenedor (con aspectRatio)
                  style={{ width: "100%", height: "100%" }}
                  // ✅ (opcional pero recomendado) ayuda a que en mobile calcule tamaño correctamente
                  sizes="(max-width: 768px) 100vw, 621px"
                />
              </div>
            </SwiperSlide>
          );
        }

        if (asset.type === "video") {
          return (
            // ✅ CAMBIO 4: también w-full en video para consistencia en mobile
            <SwiperSlide className="w-full" key={asset.public_id}>
              <div
                className="relative w-full rounded-xl border border-default-200 overflow-hidden"
                style={{
                  aspectRatio:
                    asset.width > 0 && asset.height > 0
                      ? `${asset.width} / ${asset.height}`
                      : "16 / 9",
                }}
              >
                <Player
                  className="w-full h-full object-cover"
                  src={asset.public_url}
                  blurDataURL={asset.placeholder_url}
                  theme={Instaplay}
                />
              </div>
            </SwiperSlide>
          );
        }

        return null;
      })
      .filter(Boolean);
  }, [localAssets, unlockAsset, isUnlockingAsset]);

  const totalImages = localAssets.filter((asset) => asset.type === "image").length;
  const totalVideos = localAssets.filter((asset) => asset.type === "video").length;

  if (localAssets.length === 0) return null;

  return (
    <div className="relative w-full">
      <style jsx global>{`
        .swiper-slide {
          height: auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-direction: column !important;
          width: 100% !important; /* ✅ asegura que el slide ocupe el ancho disponible */
        }

        .swiper-pagination {
          position: static !important;
        }

        .swiper-pagination-bullet {
          background: hsl(var(--heroui-default-200) / 1) !important;
          opacity: 1 !important;
        }

        .swiper-pagination-bullet-active {
          background: hsl(var(--heroui-default-400) / 1) !important;
          opacity: 1 !important;
        }
      `}</style>

      <Swiper
        className="w-full" // ✅ asegura ancho completo
        slidesPerView={1}
        spaceBetween={4}
        modules={[Pagination]}
        freeMode
        pagination={{ clickable: true }}
      >
        {render}
      </Swiper>

      <span className="text-tiny text-default-400">
        {totalImages > 0 && (
          <>
            {totalImages} {totalImages === 1 ? "foto" : "fotos"}{" "}
            {totalVideos > 0 && "y "}
          </>
        )}
        {totalVideos > 0 && (
          <>
            {totalVideos} {totalVideos === 1 ? "video" : "videos"}
          </>
        )}
      </span>
    </div>
  );
}
