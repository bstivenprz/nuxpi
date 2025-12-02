"use client";

import {
  Button,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  User,
} from "@heroui/react";
import { EmptyState } from "../empty-state";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import React from "react";
import { PaginationObject } from "@/api/types/pagination.object";
import { PublicProfileObject } from "@/api/types/public-profile.object";
import { AccountBox } from "../account-box";
import { numberFormat } from "@/utils/number-format";

export function FollowersPopUp({
  name,
  username,
}: {
  name: string;
  username: string;
}) {
  const [pagination, setPagination] = React.useState<{
    page: number;
    takge: number;
  }>({
    page: 1,
    takge: 10,
  });

  const {
    data: followers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["followers", username],
    queryFn: () =>
      api<PaginationObject<PublicProfileObject>>(
        `/profile/${username}/followers`,
        {
          params: pagination,
        }
      ),
    select: (response) => response.data,
  });

  return (
    <ModalContent>
      <ModalHeader>Seguidores</ModalHeader>
      <ModalBody className="max-h-3/4 overflow-auto pb-6 px-4">
        {(!followers || isLoading) && <Spinner />}
        {followers?.meta.total_count === 0 && (
          <EmptyState>
            <div>
              <span className="font-semibold">{name}</span> aún no tiene
              seguidores.
            </div>
          </EmptyState>
        )}
        {isError && <EmptyState>Hubo un error.</EmptyState>}
        {followers?.data.map((profile) => (
          <AccountBox
            key={`follower-user-${profile.username}`}
            name={profile.name}
            username={profile.username}
            isFollowing={profile.is_following}
            hideButton={profile.is_owner}
          />
        ))}
        {followers?.meta.has_next_page && (
          <Button
            className="font-medium"
            variant="light"
            size="sm"
            onPress={() =>
              setPagination((prev) => {
                return {
                  ...prev,
                  page: prev.page + 1,
                };
              })
            }
          >
            Mostrar más
          </Button>
        )}
      </ModalBody>
    </ModalContent>
  );
}
