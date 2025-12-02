"use client";

import { CircleFadingPlusIcon } from "lucide-react";
import Link from "next/link";

import { Heading } from "@/components/heading";
import { Button } from "@heroui/button";

export function FeedEmpty() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <CircleFadingPlusIcon className="text-default-200" size={48} />

      <div className="text-center mx-auto max-w-1/2">
        <Heading level="h3">Nada que ver aquí</Heading>
        <p className="text-default-600 text-small">
          Comienza a explorar y a seguir a tus creadores favoritos para ver más
          contenido en este espacio.
        </p>
      </div>

      <Button color="primary" variant="bordered" as={Link} href="/explore">
        Explorar
      </Button>
    </div>
  );
}
