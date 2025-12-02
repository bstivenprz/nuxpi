"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { CreatorCard } from "@/components/creator-card";

export function ToFollowSwiper() {
  return (
    <Swiper
      breakpoints={{
        "375": {
          slidesPerView: 1.2,
        },
        "768": {
          slidesPerView: 2.3,
          spaceBetween: 8,
        },
      }}
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <SwiperSlide key={`creator-swiper-slide-${index}`}>
          <CreatorCard />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
