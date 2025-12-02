"use client";

import { api } from "@/api/axios";
import { PaginationObject } from "@/api/types/pagination.object";
import { PublicProfileObject } from "@/api/types/public-profile.object";
import { usePopUp } from "@/providers/popup-provider";
import { numberFormat } from "@/utils/number-format";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { useQuery } from "@tanstack/react-query";

export function Connections({
  name,
  username,
}: {
  name: string;
  username: string;
}) {
  const { open } = usePopUp();

  const {
    data: connections,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["followers", username],
    queryFn: () =>
      api<PaginationObject<PublicProfileObject>>(
        `/profile/${username}/followers?page=1&take=3`
      ),
    select: (response) => response.data,
  });

  if (!connections || isLoading || isError) return null;

  return (
    <div className="flex min-w-max items-center gap-2">
      {connections.meta.total_count > 0 && connections.data.length > 0 && (
        <AvatarGroup max={3} renderCount={() => void 0}>
          {connections.data.map(({ picture, username }) => (
            <Avatar
              classNames={{
                base: "size-6",
              }}
              src={picture}
              alt={username}
              key={username}
            />
          ))}
        </AvatarGroup>
      )}
      <a
        className="text-default-400 text-small inline-flex cursor-pointer items-center gap-1 hover:underline"
        onClick={() => open("followers", { name, username })}
      >
        {numberFormat(connections.meta.total_count)} seguidores
      </a>
    </div>
  );
}
