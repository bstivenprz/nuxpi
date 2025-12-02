"use client";

import Link from "next/link";

import { Avatar, Button, cn } from "@heroui/react";

export function CreateTrigger(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <Link
      className={cn(
        "flex cursor-pointer items-center gap-3 px-3 py-4",
        props.className
      )}
      href="/create"
    >
      <Avatar
        classNames={{ base: "bg-default-100", icon: "text-default-300" }}
      />
      <input
        className="text-small pointer-events-none grow bg-transparent outline-none"
        placeholder="¿Qué estás pensando?"
      />
      <Button variant="bordered">Publicar</Button>
    </Link>
  );
}
