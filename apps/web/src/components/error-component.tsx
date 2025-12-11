"use client";

import { Button } from "@heroui/react";
import { Bug } from "lucide-react";
import { useRouter } from "next/navigation";
import { Heading } from "./heading";

export function ErrorComponent({ onReset }: { onReset: () => void }) {
  const router = useRouter();

  return (
    <div className="my-6 flex min-h-full flex-col items-center justify-center gap-6">
      <Bug size={48} />
      <Heading level="h3">Algo no funciona bien</Heading>
      <p className="text-center">
        Tuvimos un error, puede ser algo momentáneo, puedes intentarlo
        nuevamente. En caso de que persista aún el error haremos todo lo posible
        para resolverlo.
      </p>

      <div className=" flex items-center gap-2">
        <Button color="primary" onPress={onReset}>
          Reintentar
        </Button>
        <Button variant="bordered" onPress={() => router.back()}>
          Volver atrás
        </Button>
      </div>
    </div>
  );
}
