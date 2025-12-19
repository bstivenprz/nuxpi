"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { AccountCard } from "./account-card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { PublicProfileObject } from "@/api/types/public-profile.object";

export function AccountSuggestions() {
  const { data, isLoading } = useQuery({
    queryKey: ["feed-suggestions"],
    queryFn: () => api<PublicProfileObject[]>("/feed/suggestions"),
    select: (response) => response.data,
  });

  if (!data && isLoading) return null;

  return (
    <div className="space-y-4 py-3">
      <div className="text-tiny text-default-400 px-3">Sugerencias para ti</div>
      <Swiper spaceBetween={6} slidesPerView={2.5}>
        {data?.map((profile, index) => (
          <SwiperSlide
            key={`suggestion-item-${index}`}
            style={{ width: "auto" }}
          >
            <AccountCard
              name={profile.name}
              username={profile.username}
              picture={profile.picture}
              followers={profile.followers_count ?? 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
