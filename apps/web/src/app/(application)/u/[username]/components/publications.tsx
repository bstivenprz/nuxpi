'use client';

import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { PaginationObject } from "@/api/types/response.types";
import { PublicationObject } from "@/api/types/content.types";
import { api } from "@/api/axios";
import { Loader } from "@/components/ui/loader";
import { Publication } from "@/components/publication/publication";
import { useState } from "react";

export function Publications({ username }: { username: string }) {

  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['publications', username, page],
    queryFn: () => api<PaginationObject<PublicationObject>>(`/publications/profile/${username}`, {
      params: {
        page,
      },
    }),
    select: (response) => response.data,
    enabled: Boolean(username),
    throwOnError: true,
  })

  if (!data && isLoading) return <Loader />
  if (!data || data?.meta.page_count === 0) return <EmptyState>Aún no hay contenido aquí.</EmptyState>

  return (
    <section className="divide-y divide-default-100">
      {data?.data.map((publication) => (
        <Publication
          key={publication.id}
          externalId={publication.id}
          caption={publication.caption}
          author={{
            name: publication.author.name,
            username: publication.author.username,
            picture: publication.author.picture,
          }}
          totalComments={publication.comments_count}
          totalLikes={publication.likes_count}
          isLiked={publication.is_liked}
          publishedAt={publication.created_at}
          isOwner={publication.is_owner}
        />
      ))}

      {data?.meta.has_next_page && (
        <Divider>
          <Button className="font-medium" variant="light" size="sm" onPress={() => setPage((prev) => prev + 1)}>
            Mostrar más
          </Button>
        </Divider>
      )}
    </section>
  );
}
