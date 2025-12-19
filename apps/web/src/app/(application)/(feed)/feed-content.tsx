"use client";

import { api } from "@/api/axios";
import { PublicationObject } from "@/api/types/content.types";
import { PaginationObject } from "@/api/types/pagination.object";
import { Multimedia } from "@/components/publication/multimedia";
import { Publication } from "@/components/publication/publication";
import { Loader } from "@/components/ui/loader";
import { useQuery } from "@tanstack/react-query";
import { FeedEmpty } from "./feed-empty";

export function FeedContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: () => api<PaginationObject<PublicationObject>>(`/feed`),
    select: (response) => response.data,
  });

  if (isLoading) return <Loader />;

  if (!data || data?.meta.page_count === 0)
    return <FeedEmpty />;

  return (
    <div>
      {data?.data.map((publication) => (
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
    </div>
  );
}
