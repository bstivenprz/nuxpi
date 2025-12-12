import { Swiper, SwiperSlide } from "swiper/react";

import Player from "next-video/player";
import Instaplay from "player.style/instaplay/react";
import Image from "next/image";
import { useMemo } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

interface AssetProps {
  public_id: string;
  type: "image" | "video";
  public_url: string;
  placeholder_url: string;
  width: number;
  height: number;
}

export function Multimedia({ assets }: { assets: AssetProps[] }) {
  const render = useMemo(() => {
    if (assets.length === 0) return null;
    return assets
      .map((asset) => {
        if (asset.type === "image") {
          return (
            <SwiperSlide key={asset.public_id}>
              <div
                className="relative w-full"
                style={{
                  aspectRatio:
                    asset.width > 0 && asset.height > 0
                      ? `${asset.width} / ${asset.height}`
                      : "1 / 1",
                }}
              >
                <Image
                  className="rounded-xl border border-default-200 w-full h-full object-contain"
                  src={asset.public_url}
                  blurDataURL={asset.placeholder_url}
                  alt="Image"
                  width={asset.width}
                  height={asset.height}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </SwiperSlide>
          );
        }

        if (asset.type === "video") {
          return (
            <SwiperSlide key={asset.public_id}>
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
      })
      .filter(Boolean);
  }, [assets]);

  // get total images
  const totalImages = assets.filter((asset) => asset.type === "image").length;
  const totalVideos = assets.filter((asset) => asset.type === "video").length;

  if (assets.length === 0) return null;

  return (
    <div className="relative">
      <style jsx global>
        {`
          .swiper-slide {
            height: auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-direction: column !important;
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
        `}
      </style>
      <Swiper
        slidesPerView={1}
        spaceBetween={4}
        modules={[Pagination]}
        freeMode
        pagination={{
          clickable: true,
        }}
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
