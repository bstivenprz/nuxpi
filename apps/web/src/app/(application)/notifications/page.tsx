"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/header";
import { Heading } from "@/components/heading";
import { Button } from "@heroui/button";

import Notification from "./notification";

export default function Notifications() {
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

      <div className="space-y-6">
        <Heading level="caption">Recientes</Heading>
        <div className="flex flex-col gap-2">
          <Notification
            endContent={
              <Button size="sm" color="primary">
                Seguir también
              </Button>
            }
          />
          <Notification
            endContent={
              <div className="size-14 bg-white border border-default-100" />
            }
          />
        </div>

        <Heading level="caption">Anteriores</Heading>
        <div className="flex flex-col gap-2">
          <Notification
            endContent={
              <Button size="sm" color="primary">
                Seguir también
              </Button>
            }
            isReaded
          />
          <Notification
            endContent={
              <div className="size-14 bg-white border border-default-100" />
            }
            isReaded
          />
          <Button className="font-medium" size="sm" variant="light">
            Ver más
          </Button>
        </div>
      </div>
    </>
  );
}
