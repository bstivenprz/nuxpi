"use client";

import Link from "next/link";

import { Avatar, Button, cn } from "@heroui/react";
import { useAuthenticated } from "@/hooks/use-authenticated";

export function CreateTrigger(props: React.HTMLAttributes<HTMLElement>) {
  const profile = useAuthenticated()

  return (
    <Link
      className={cn(
        "flex cursor-pointer items-center gap-3 py-4",
        props.className
      )}
      href="/create"
    >
      <Avatar
        classNames={{ base: "bg-default-100", icon: "text-default-300" }}
        src={profile?.picture}
      />
      <input
        className="text-small pointer-events-none grow bg-transparent outline-none"
        placeholder="¿Qué estás pensando?"
      />
      <Button variant="bordered">Publicar</Button>
    </Link>
  );
}
