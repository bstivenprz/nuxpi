"use client";

import { api } from "@/api/axios";
import { Badge } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

export function CounterNotifications({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useQuery({
    queryKey: ["notifications-counter"],
    queryFn: async () => {
      const response = await api.get("/notifications/counter");
      return response.data;
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
