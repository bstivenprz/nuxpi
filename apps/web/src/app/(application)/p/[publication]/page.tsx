"use client";

import { Header } from "@/components/header";

import { Publication } from "@/components/publication/publication";
import { notFound, useParams } from "next/navigation";
import { PublicationObject } from "@/api/types/content.types";
import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/ui/loader";
import { Multimedia } from "@/components/publication/multimedia";

export default function PublicationPage() {
  const { publication: publicationId } = useParams<{ publication: string }>();

  const { data: publication, isLoading } = useQuery({
    queryKey: ["publication", publicationId],
    queryFn: async () => {
      const response = await api<PublicationObject>(
        `/publications/${publicationId}`
      );
      return response.data;
    },
    enabled: Boolean(publicationId),
  });

  if (isLoading) return <Loader />;
  if (!publication) return notFound();

  return (
    <>
      <Header>Publicación</Header>

      <Publication
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
            public_id: asset.cloudinary_public_id,
            public_url: asset.public_url,
            placeholder_url: asset.placeholder_url,
            type: asset.type,
            width: asset.width,
            height: asset.height,
          }))}
        />
      </Publication>
    </>
  );
}
