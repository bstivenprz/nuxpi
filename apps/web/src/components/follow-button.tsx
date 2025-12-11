"use client";

import { api } from "@/api/axios";
import { Button, ButtonProps } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export function FollowButton({
  username,
  initialState = false,
  onSuccess,
  ...props
}: {
  username: string;
  initialState?: boolean;
  onSuccess?: () => void
} & ButtonProps) {
  const queryClient = useQueryClient();

  const [isFollowing, setIsFollowing] = React.useState(initialState);

  const mutation = useMutation({
    mutationFn: (variables: { isFollowing: boolean; username: string }) =>
      api<{ is_following: boolean }>(`/profile/${variables.username}/follow`, {
        method: variables.isFollowing ? "DELETE" : "POST",
      }),
    onMutate: () => {
      const previousIsFollowing = isFollowing;
      const nextIsFollowing = !isFollowing;
      setIsFollowing(nextIsFollowing);
      return {
        previousIsFollowing,
      };
    },
    onError: (_, __, context) => {
      if (context?.previousIsFollowing) {
        setIsFollowing(context.previousIsFollowing);
      }

      addToast({
        description: "No puedes seguir a este usuario.",
      });
    },
    onSuccess: (response) => {
      setIsFollowing(response.data.is_following);
      onSuccess?.()
    },
    onSettled: async (_, __, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["followers", variables.username],
      });
    },
  });

  return (
    <Button
      {...props}
      color={isFollowing ? "default" : "primary"}
      variant={isFollowing ? "bordered" : "solid"}
      onPress={() => mutation.mutate({ isFollowing, username })}
    >
      {isFollowing ? "Siguiendo" : "Seguir"}
    </Button>
  );
}
