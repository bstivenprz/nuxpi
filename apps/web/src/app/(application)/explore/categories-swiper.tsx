"use client";

import "swiper/css";
import { SwiperSlide } from "swiper/react";

import { SwiperExtended } from "@/components/swiper-extended";
import { CATEGORIES } from "@/constants";
import { Button } from "@heroui/button";

export function CategoriesSwiper() {
  return (
    <SwiperExtended
      navigation={{
        enabled: true,
      }}
      slidesPerView="auto"
      spaceBetween={6}
    >
      {Object.entries(CATEGORIES).map(([key, value], index) => (
        <SwiperSlide
          style={{
            width: "fit-content",
          }}
          key={`category-swiper-slide-${key}-${index}`}
        >
          <Button
            className="font-semibold"
            key={`category-button-${key}-${index}`}
            size="sm"
            variant="ghost"
          >
            {value}
          </Button>
        </SwiperSlide>
      ))}
    </SwiperExtended>
  );
}
