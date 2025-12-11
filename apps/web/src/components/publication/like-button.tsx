'use client'

import { api } from "@/api/axios";
import { numberFormat } from "@/utils/number-format";
import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { useState } from "react";

export function LikeButton({ count, id, isLiked = false }: { count: number; id: string; isLiked?: boolean }) {
  const [state, setState] = useState(count)
  const [liked, setLiked] = useState(isLiked)

  const { mutate: like } = useMutation({
    mutationFn: () => api.post(`/publications/${id}/like`),
    onMutate: async () => {
      setLiked(true);
      setState((prev) => prev + 1);
    },
    onError: () => {
      setLiked(false);
      setState((prev) => Math.max(prev - 1, 0));
    },
  });

  const { mutate: unlike } = useMutation({
    mutationFn: () => api.delete(`/publications/${id}/like`),
    onMutate: async () => {
      setLiked(false);
      setState((prev) => Math.max(prev - 1, 0));
    },
    onError: () => {
      setLiked(true);
      setState((prev) => prev + 1);
    },
  });

  function handleButton() {
    if (liked) {
      unlike()
    } else {
      like()
    }
  }

  return (
    <Button
      className="text-default-600"
      variant="light"
      size="sm"
      radius="full"
      startContent={<HeartIcon className={liked ? "text-danger" : "text-default-600"} fill={liked ? "hsl(var(--heroui-danger) / 1)" : "none"} size={20} />}
      isIconOnly={state === 0}
      onPress={handleButton}
    >
      {state > 0 && numberFormat(state)}
    </Button>
  )
}