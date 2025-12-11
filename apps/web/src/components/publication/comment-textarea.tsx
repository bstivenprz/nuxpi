"use client";

import Link from "next/link";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Avatar, Button, Textarea } from "@heroui/react";
import { useAuthenticated } from "@/hooks/use-authenticated";
import { api } from "@/api/axios";
import { CommentObject, PublicationObject } from "@/api/types/content.types";
import { PaginationObject } from "@/api/types/response.types";
import { CommentsRef } from "./comments";

interface CommentTextareaForm {
  comment: string;
}

export function CommentTextarea({
  publication,
  commentsRef,
}: {
  publication: string;
  commentsRef?: React.RefObject<CommentsRef|null>;
}) {
  const profile = useAuthenticated();
  const queryClient = useQueryClient();

  const form = useForm<CommentTextareaForm>({
    defaultValues: {
      comment: "",
    },
    mode: "onChange",
  });

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: async (content: string) =>
      api.post(`/publications/${publication}/comment`, { content }),
    onMutate: async (content) => {
      try {
        if (!profile) {
          console.log("Previus comments");

          return { previousComments: undefined, previousPublication: undefined };
        }

        // Cancel any outgoing refetches
        await queryClient.cancelQueries({
          queryKey: ["comments", publication],
        });
        await queryClient.cancelQueries({
          queryKey: ["publication", publication],
        });

        // Snapshot the previous value for page 1
        const commentsQueryKey = ["comments", publication, 1];
        const previousComments =
          queryClient.getQueryData<PaginationObject<CommentObject>>(
            commentsQueryKey
          );

        // Snapshot the previous publication data
        const publicationQueryKey = ["publication", publication];
        const previousPublication =
          queryClient.getQueryData<PublicationObject>(publicationQueryKey);

        // Optimistically update page 1 (new comments appear on first page)
        const optimisticComment: CommentObject = {
          id: `temp-${Date.now()}`,
          content,
          author: {
            name: profile.name,
            username: profile.username,
            picture: profile.picture,
          },
          created_at: Date.now(),
          is_owner: true,
        };

        console.log("Previous comments", previousComments);

        if (previousComments) {
          queryClient.setQueryData<PaginationObject<CommentObject>>(
            commentsQueryKey,
            {
              ...previousComments,
              data: [optimisticComment, ...previousComments.data],
              meta: {
                ...previousComments.meta,
                total_count: previousComments.meta.total_count + 1,
              },
            }
          );
        } else {
          // If no cache exists, create initial cache with the optimistic comment
          queryClient.setQueryData<PaginationObject<CommentObject>>(
            commentsQueryKey,
            {
              data: [optimisticComment],
              meta: {
                page: 1,
                take: 10,
                total_count: 1,
                page_count: 1,
                has_previous_page: false,
                has_next_page: false,
              },
            }
          );
        }

        // Optimistically update publication comments_count
        if (previousPublication) {
          queryClient.setQueryData<PublicationObject>(
            publicationQueryKey,
            {
              ...previousPublication,
              comments_count: previousPublication.comments_count + 1,
            }
          );
        }

        // Scroll to top after optimistic update for immediate feedback
        setTimeout(() => {
          commentsRef?.current?.scrollToTop();
        }, 0);

        return { previousComments, previousPublication };
      } catch (error) {
        console.error("Error creating comment", error);
      }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        const commentsQueryKey = ["comments", publication, 1];
        queryClient.setQueryData(commentsQueryKey, context.previousComments);
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
      // Reset form after successful submission
      form.reset();
      // Invalidate to refetch with actual data
      queryClient.invalidateQueries({
        queryKey: ["comments", publication],
      });
      queryClient.invalidateQueries({
        queryKey: ["publication", publication],
      });
      // Scroll to top after a short delay to ensure DOM is updated
      setTimeout(() => {
        commentsRef?.current?.scrollToTop();
      }, 100);
    },
  });

  async function onSubmit(data: CommentTextareaForm) {
    createComment(data.comment);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  }

  const isValid = form.formState.isValid;

  return (
    <form
      className="flex w-full items-center gap-2 py-3"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Link href={`/u/${profile?.username}`}>
        <Avatar size="sm" src={profile?.picture} />
      </Link>

      <Controller
        render={({ field }) => (
          <Textarea
            classNames={{
              inputWrapper: "border-none shadow-none p-0",
              innerWrapper: "items-center",
            }}
            endContent={
              <Button
                isDisabled={!isValid}
                isLoading={isPending}
                type="submit"
                variant="light"
                size="sm"
              >
                Publicar
              </Button>
            }
            autoComplete="off"
            autoCorrect="off"
            autoFocus={true}
            minRows={1}
            placeholder="Escribe un comentario"
            variant="bordered"
            onKeyDown={handleKeyDown}
            {...field}
          />
        )}
        rules={{
          required: true,
        }}
        control={form.control}
        name="comment"
      />
    </form>
  );
}
