"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper } from "swiper/react";
import { NavigationOptions, SwiperOptions } from "swiper/types";

import React from "react";

import { randomId } from "@/utils/random-ids";
import { Button } from "@heroui/react";

type SwiperProps = SwiperOptions & React.PropsWithChildren;

export function SwiperExtended({
  navigation,
  children,
  ...props
}: SwiperProps) {
  const [slideState, setSlideState] = React.useState<"start" | "all" | "end">(
    "end"
  );

  const prevElementId = randomId("prev-swiper-element");
  const nextElementId = randomId("next-swiper-element");

  return (
    <div className="relative">
      <Swiper
        {...props}
        navigation={{
          ...(navigation as NavigationOptions),
          prevEl: `#${prevElementId}`,
          nextEl: `#${nextElementId}`,
        }}
        modules={[Navigation]}
        onSlideChange={(swiper) => {
          setSlideState(() => {
            if (swiper.isBeginning) return "end";
            if (swiper.isEnd) return "start";
            return "all";
          });
        }}
      >
        {children}
      </Swiper>
      {navigation && (
        <>
          <div className="absolute left-0 top-0 z-10" id={prevElementId}>
            <div
              className="invisible bg-linear-to-r from-background from-60% to-transparent pr-2 data-[all=true]:visible data-[start=true]:visible"
              data-start={["start", "all"].includes(slideState)}
            >
              <Button radius="full" size="sm" variant="light" isIconOnly>
                <ChevronLeftIcon />
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 z-10" id={nextElementId}>
            <div
              className="invisible bg-linear-to-l from-background from-60% to-transparent pl-2 data-[all=true]:visible data-[end=true]:visible"
              data-end={["end", "all"].includes(slideState)}
            >
              <Button radius="full" size="sm" variant="light" isIconOnly>
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
