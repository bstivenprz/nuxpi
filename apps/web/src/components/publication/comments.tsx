import { useQuery } from "@tanstack/react-query";
import { Comment } from "./comment";
import { Button } from "@heroui/react";
import { PaginationObject } from "@/api/types/response.types";
import { CommentObject } from "@/api/types/content.types";
import { api } from "@/api/axios";
import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Loader } from "../ui/loader";

export interface CommentsRef {
  scrollToTop: () => void;
}

export const Comments = forwardRef<CommentsRef, { publication: string }>(
  ({ publication }, ref) => {
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      },
    }));

    const { data, isLoading } = useQuery({
      queryKey: ["comments", publication, page],
      queryFn: async () => {
        const response = await api<PaginationObject<CommentObject>>(
          `/publications/${publication}/comments`,
          {
            params: {
              page,
            },
          }
        );
        return response.data;
      },
      enabled: Boolean(publication),
      throwOnError: true,
    });

    if (isLoading) return <Loader size="sm" />;
    if (!data || data?.meta.page_count === 0) return null;

    return (
      <div
        ref={scrollContainerRef}
        className="flex w-full flex-col gap-2 max-h-[360px] overflow-auto"
      >
      {data?.data.map((comment) => (
        <Comment
          key={comment.id}
          author={{
            name: comment.author.name,
            username: comment.author.username,
            picture: comment.author.picture,
          }}
          publishedAt={comment.created_at}
          isOwned={comment.is_owner}
          publication={publication}
          commentId={comment.id}
        >
          {comment.content}
        </Comment>
      ))}

      {data?.meta.has_next_page && (
        <Button
          className="font-medium"
          variant="light"
          size="sm"
          onPress={() => setPage((prev) => prev + 1)}
        >
          Ver más comentarios
        </Button>
      )}
      </div>
    );
  }
);

Comments.displayName = "Comments";
