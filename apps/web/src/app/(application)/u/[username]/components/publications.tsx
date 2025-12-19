"use client";

import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@heroui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PaginationObject } from "@/api/types/response.types";
import { PublicationObject } from "@/api/types/content.types";
import { api } from "@/api/axios";
import { Loader } from "@/components/ui/loader";
import { Publication } from "@/components/publication/publication";
import { Multimedia } from "@/components/publication/multimedia";

export function Publications({ username }: { username: string }) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PaginationObject<PublicationObject>>({
    queryKey: ["publications", username],
    queryFn: async ({
      pageParam = 1,
    }): Promise<PaginationObject<PublicationObject>> => {
      const response = await api<PaginationObject<PublicationObject>>(
        `/content/profile/public/${username}`,
        {
          params: {
            page: pageParam,
          },
        },
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_next_page ? lastPage.meta.page + 1 : undefined,
    enabled: Boolean(username),
    throwOnError: true,
  });

  const flatData = data?.pages.flatMap((page) => page.data) ?? [];
  const firstPage = data?.pages[0];

  if (!data && isLoading) return <Loader />;
  if (!firstPage || firstPage.meta.page_count === 0)
    return <EmptyState>Aún no hay contenido aquí.</EmptyState>;

  return (
    <section className="divide-y divide-default-100">
      {flatData.map((publication) => (
        <Publication
          key={publication.id}
          externalId={publication.id}
          author={{
            name: publication.author.name,
            username: publication.author.username,
            picture: publication.author.picture,
          }}
          caption={publication.caption}
          totalLikes={publication.likes_count}
          totalComments={publication.comments_count}
          publishedAt={publication.created_at}
          isOwner={publication.is_owner}
          isLiked={publication.is_liked}
          isPinned={publication.is_pinned}
        >
          <Multimedia
            assets={publication.assets.map((asset) => ({
              id: asset.id,
              public_id: asset.cloudinary_public_id,
              public_url: asset.public_url,
              placeholder_url: asset.placeholder_url,
              type: asset.type,
              width: asset.width,
              height: asset.height,
            }))}
          />
        </Publication>
      ))}

      {hasNextPage && (
        <Divider>
          <Button
            className="font-medium"
            variant="light"
            size="sm"
            isLoading={isFetchingNextPage}
            isDisabled={isFetchingNextPage}
            onPress={() => fetchNextPage()}
          >
            Mostrar más
          </Button>
        </Divider>
      )}
    </section>
  );
}
