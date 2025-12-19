"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/header";
import { Button } from "@heroui/button";

import { api } from "@/api/axios";
import { NotificationObject } from "@/api/types/notification.object";
import { PaginationObject } from "@/api/types/pagination.object";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/empty-state";
import Notification from "./notification";
import Image from "next/image";
import { addToast } from "@heroui/react";

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response =
        await api<PaginationObject<NotificationObject>>("/notifications");
      return response.data;
    },
  });

  async function readAllNotifications() {
    try {
      await api.post("/notifications/read-all");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      api.post("/notifications/read-all");
    } catch {
      addToast({
        title: "Error al marcar todas como leídas.",
        description: "Por favor, intenta nuevamente.",
        color: "danger",
      });
    }
  }

  return (
    <>
      <Header
        endContent={
          <Button
            as={Link}
            href="/settings/notifications"
            variant="light"
            size="sm"
            isIconOnly
          >
            <SettingsIcon />
          </Button>
        }
      >
        Notificaciones
      </Header>

      <div className="flex justify-end py-2">
        <a
          className="text-tiny text-default-500 hover:text-default-600 hover:underline cursor-pointer"
          onClick={readAllNotifications}
        >
          Marcar todas como leídas
        </a>
      </div>

      {isLoading && <Loader />}
      {(!data || data?.meta.page_count === 0) && (
        <EmptyState>Nada que ver por aquí.</EmptyState>
      )}

      {data && data?.meta.page_count > 0 && (
        <div className="flex flex-col gap-2">
          {data.data.map((notification, index) => (
            <Notification
              key={`notification-${index}`}
              author={{
                displayName: notification.initiator_profile.name,
                username: notification.initiator_profile.username,
                picture: notification.initiator_profile.picture,
              }}
              content={notification.content}
              href={notification.href}
              notifiedAt={notification.notified_at}
              endContent={
                notification.thumbnail ? (
                  <div className="relative">
                    <Image
                      className="border border-default-100 rounded-xl"
                      src={notification.thumbnail}
                      alt="Thumbnail"
                      width={100}
                      height={100}
                    />
                  </div>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
