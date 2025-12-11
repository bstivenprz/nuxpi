
import { ExpandableTextbox } from "@/components/expandable-textbox";
import { Heading } from "@/components/heading";
import { Button } from "@heroui/button";

import { Content } from "./components/content";
import { Picture } from "./components/picture";
import Image from "next/image";
import { Tools } from "./components/tools";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicProfileObject } from "@/api/types/public-profile.object";
import { fetchAPI } from "@/api/fetch";
import { Connections } from "./components/connections";
import { FollowButton } from "@/components/follow-button";
import { TAGS } from "@/utils/tags";
import { Header } from "@/components/header";

export const dynamicParams = true;

export async function fetchPublicProfile(
  username: string
): Promise<PublicProfileObject | null> {
  try {
    const response = await fetchAPI(`/profile/${username}`, {
      cache: "force-cache",
      next: {
        revalidate: 3600,
        tags: [TAGS.PUBLIC_PROFILE(username)],
      },
    });

    return response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchPublicProfile(username);
  if (!profile)
    return {
      title: "Usuario no encontrado",
    };

  return {
    title: `${profile.name} (@${profile.username}) • Nuxpi, exprésate más`,
    description: profile.presentation,
    openGraph: {
      title: `${profile.name} (@${profile.username}) • Nuxpi, exprésate más`,
      description: profile.presentation,
    },
  };
}

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await fetchPublicProfile(username);
  if (!profile) notFound();

  return (
    <>
      <Header endContent={<Tools isOwner={profile.is_owner} />}>
        {profile.name}
      </Header>
      <div>
        <div className="aspect-[3.6/1] relative bg-default-100">
          {profile.cover && (
            <Image
              className="object-cover object-center"
              src={profile.cover}
              alt="cover"
              fill
            />
          )}
        </div>

        <div className="flex flex-col gap-3 px-4 pb-4">
          <div className="-mt-20">
            <Picture
              classNames={{
                base: "bg-default-100 ring-4 ring-background",
                icon: "text-default-300",
              }}
              src={profile.picture}
            />
          </div>

          <div className="grow">
            <Heading
              as="div"
              className="mobile:m-0 desktop:m-0 line-clamp-1 font-semibold"
              level="h4"
            >
              {profile.name}
            </Heading>
            <div className="text-default-600">{profile.username}</div>
          </div>

          {profile.presentation && (
            <ExpandableTextbox characterLimit={120} className="leading-none">
              {profile.presentation}
            </ExpandableTextbox>
          )}

          <Connections name={profile.name} username={profile.username} />

          <div className="mobile:flex-col desktop:flex-row flex items-center gap-2">
            {profile.is_owner ? (
              <Button as="a" href="/account/profile" variant="ghost" fullWidth>
                Editar perfil
              </Button>
            ) : (
              <>
                <FollowButton
                  username={username}
                  initialState={profile.is_following}
                  fullWidth
                />
                <Button variant="bordered" fullWidth>
                  Apoyar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Content username={username} isOwner={profile.is_owner} />
    </>
  );
}
