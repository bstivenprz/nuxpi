import { ChipRadio } from "@/components/ui/chip-radio";
import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/empty-state";
import { ViewToggle } from "@/components/view-toggle";
import { Button } from "@heroui/button";
import { RadioGroup } from "@heroui/radio";
import { api } from "@/api/axios";
import { PublicationObject } from "@/api/types/content.types";
import { PaginationObject } from "@/api/types/pagination.object";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader } from "@/components/ui/loader";
import Image from "next/image";
import { Publication } from "@/components/publication/publication";
import { Multimedia as MultimediaComponent } from "@/components/publication/multimedia";

export function Multimedia({ username }: { username: string }) {
  const [gridView, setGridView] = useState<boolean>(true);
  const [mediaType, setMediaType] = useState<"all" | "image" | "video">("all");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<PaginationObject<PublicationObject>>({
      queryKey: ["multimedia", username, mediaType],
      queryFn: async ({ pageParam }) => {
        const response = await api<PaginationObject<PublicationObject>>(
          `/content/profile/public/${username}`,
          {
            params: {
              page: pageParam,
              type: "multimedia",
              media_type: mediaType,
            },
          }
        );
        return response.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.has_next_page) {
          return lastPage.meta.page + 1;
        }
        return undefined;
      },
      enabled: Boolean(username),
      throwOnError: true,
    });

  const flatData = data?.pages.flatMap((page) => page.data) ?? [];

  function toggleView() {
    setGridView((prev) => !prev);
  }

  function changeMediaType(value: string) {
    const mediaType = value as "all" | "image" | "video";
    setMediaType(mediaType);
  }

  return (
    <section>
      <div className="flex items-center mb-4">
        <RadioGroup
          classNames={{ base: "grow" }}
          orientation="horizontal"
          value={mediaType}
          onValueChange={changeMediaType}
        >
          <ChipRadio value="all">Todas</ChipRadio>
          <ChipRadio value="image">Fotos</ChipRadio>
          <ChipRadio value="video">Videos</ChipRadio>
        </RadioGroup>
        <ViewToggle
          view={gridView ? "grid" : "list"}
          onChangeView={toggleView}
        />
      </div>

      <div>
        {isLoading && <Loader />}

        {!isLoading &&
          (!data ||
            data.pages.length === 0 ||
            data.pages[0]?.meta.page_count === 0) && (
            <EmptyState>Aún no hay contenido aquí.</EmptyState>
          )}

        {gridView ? (
          <div className="grid grid-cols-3 gap-1">
            {flatData.flatMap((publication) =>
              publication.assets
                .filter((asset) => asset.type === "image")
                .map((asset) => (
                  <div key={asset.id} className="relative aspect-square">
                    <Image
                      src={asset.public_url}
                      alt={publication.caption ?? "Publicación"}
                      width={asset.width}
                      height={asset.height}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
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
              >
                <MultimediaComponent
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
          </div>
        )}

        {hasNextPage && (
          <Divider>
            <Button
              className="font-medium"
              variant="light"
              size="sm"
              onPress={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
              isDisabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Cargando..." : "Mostrar más"}
            </Button>
          </Divider>
        )}
      </div>
    </section>
  );
}
