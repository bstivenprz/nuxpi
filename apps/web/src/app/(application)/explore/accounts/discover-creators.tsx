"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { CreatorCard } from "@/components/creator-card";
import { PublicProfileObject } from "@/api/types/public-profile.object";
import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Heading } from "@/components/heading";
import { EmptyState } from "@/components/empty-state";
import { Loader } from "@/components/ui/loader";

export function DiscoverCreators() {
  const { data, isLoading } = useQuery({
    queryKey: ["discover-creators"],
    queryFn: async () => {
      const response = await api<PublicProfileObject[]>("/discover/creators");
      return response.data;
    },
  });

  if (isLoading) return <Loader />;
  if (!data || data?.length === 0) return <EmptyState>Aún no hay creadores para ti.</EmptyState>;

  return (
    <div className="space-y-4 py-3">
      <Heading level="caption">Creadores para ti</Heading>

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
        {data?.map((profile, index) => (
          <SwiperSlide key={`creator-swiper-slide-${index}`}>
            <CreatorCard
              displayName={profile.name}
              username={profile.username}
              followers={profile.followers_count}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
