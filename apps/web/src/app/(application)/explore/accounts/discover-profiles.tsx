"use client";

import { api } from "@/api/axios";
import { PublicProfileObject } from "@/api/types/public-profile.object";
import { AccountBox } from "@/components/account-box";
import { EmptyState } from "@/components/empty-state";
import { Heading } from "@/components/heading";
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

export function DiscoverProfiles() {
  const { data, isLoading } = useQuery({
    queryKey: ["discover-profiles"],
    queryFn: async () => {
      const response = await api<PublicProfileObject[]>("/discover/profiles");
      return response.data;
    },
  })

  if (isLoading) return <Loader />;
  if (!data || data?.length === 0) return <EmptyState>Aún no hay perfiles para ti.</EmptyState>;

  return (
    <div>
      <Heading level="caption">Sugerencias para ti</Heading>
      <div className="flex flex-col gap-2 divide-y divide-divider">
        {data?.map((profile, index) => (
          <AccountBox key={`profile-box-${index}`} username={profile.username} name={profile.name} />
        ))}
        <Button className="font-medium" variant="light" size="sm">
          Ver más
        </Button>
      </div>
    </div>
  );
}
