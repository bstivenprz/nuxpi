"use client";

import { api } from "@/api/axios";
import { Badge } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

export function CounterMessages({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ["inbox-counters"],
    queryFn: async () => {
      const response = await api.get<{ unreaded_count: number }>(
        "/inbox/counters"
      );
      return response.data.unreaded_count;
    },
    initialData: 0,
  });

  return (
    <Badge
      color="danger"
      content={data}
      placement="top-right"
      size="sm"
      showOutline={false}
      isDot
      isInvisible={data === 0}
    >
      {children}
    </Badge>
  );
}
