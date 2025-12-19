'use client'

import { api } from "@/api/axios";
import { PublicationObject } from "@/api/types/content.types";
import { EmptyState } from "@/components/empty-state";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";

export default function ForYou() {
  const { data, isLoading } = useQuery({
    queryKey: ["for-you"],
    queryFn: async () => {
      const response = await api<PublicationObject[]>("/discover/content");
      return response.data;
    },
  });

  if (isLoading) return <Loader />;
  if (!data || data?.length === 0) return <EmptyState>Aún no hay publicaciones para ti.</EmptyState>;

  return (
    <div className="grid grid-cols-3 gap-2">
      {data?.map((publication, index) => (
        <Link key={`discover-content-${index}`} href={`/p/${publication.id}`}>
          Jeje
        </Link>
      ))}
    </div>
  )
}
