"use client";

import dayjs from "dayjs";
import Link from "next/link";

import { ExpandableTextbox } from "@/components/expandable-textbox";
import { Avatar } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { CommentObject, PublicationObject } from "@/api/types/content.types";
import { PaginationObject } from "@/api/types/response.types";

type Author = {
  name: string;
  username: string;
  picture?: string;
};

export type CommentProps = {
  children: React.ReactNode | string;
  author: Author;
  publishedAt: number;
  isOwned?: boolean;
  publication: string;
  commentId: string;
};

export function Comment({
  children,
  author,
  publishedAt,
  isOwned,
  publication,
  commentId,
}: CommentProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteComment, isPending } = useMutation({
    mutationFn: async () =>
      api.delete(`/publications/${publication}/comment/${commentId}`),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["comments", publication],
      });
      await queryClient.cancelQueries({
        queryKey: ["publication", publication],
      });

      // Get all comment queries for this publication
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll({
        queryKey: ["comments", publication],
      });

      // Snapshot previous values for all pages
      const previousCommentsMap = new Map<
        string,
        PaginationObject<CommentObject> | undefined
      >();

      // Optimistically remove comment from all pages
      queries.forEach((query) => {
        const queryKey = query.queryKey;
        const previousComments =
          queryClient.getQueryData<PaginationObject<CommentObject>>(queryKey);

        previousCommentsMap.set(JSON.stringify(queryKey), previousComments);

        if (previousComments) {
          const updatedData = previousComments.data.filter(
            (comment) => comment.id !== commentId
          );

          queryClient.setQueryData<PaginationObject<CommentObject>>(queryKey, {
            ...previousComments,
            data: updatedData,
            meta: {
              ...previousComments.meta,
              total_count: Math.max(0, previousComments.meta.total_count - 1),
            },
          });
        }
      });

      // Snapshot the previous publication data
      const publicationQueryKey = ["publication", publication];
      const previousPublication =
        queryClient.getQueryData<PublicationObject>(publicationQueryKey);

      // Optimistically decrement publication comments_count
      if (previousPublication) {
        queryClient.setQueryData<PublicationObject>(publicationQueryKey, {
          ...previousPublication,
          comments_count: Math.max(0, previousPublication.comments_count - 1),
        });
      }

      return { previousCommentsMap, previousPublication };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCommentsMap) {
        context.previousCommentsMap.forEach((previousComments, queryKeyStr) => {
          const queryKey = JSON.parse(queryKeyStr);
          if (previousComments) {
            queryClient.setQueryData(queryKey, previousComments);
          }
        });
      }
      if (context?.previousPublication) {
        const publicationQueryKey = ["publication", publication];
        queryClient.setQueryData(
          publicationQueryKey,
          context.previousPublication
        );
      }
    },
    onSuccess: () => {
      // Invalidate to refetch and ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["comments", publication],
      });
      queryClient.invalidateQueries({
        queryKey: ["publication", publication],
      });
    },
  });

  function handleDelete() {
    if (isPending) return;
    deleteComment();
  }

  return (
    <div className="flex items-start gap-2">
      <Link href={`/u/${author.username}`}>
        <Avatar size="sm" src={author.picture} />
      </Link>

      <div className="flex grow flex-col items-start gap-1.5">
        <div className="flex items-center gap-2 w-full">
          <Link
            className="text-small font-semibold"
            href={`/u/${author.username}`}
          >
            {author.username}
          </Link>
          <div className="text-tiny text-foreground-500 grow">
            {dayjs(publishedAt).fromNow()}
          </div>
          {isOwned && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-tiny text-danger hover:cursor-pointer hover:underline underline-offset-2 disabled:opacity-50"
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </button>
          )}
        </div>

        <ExpandableTextbox className="text-small" characterLimit={120}>
          {children}
        </ExpandableTextbox>
      </div>
    </div>
  );
}
