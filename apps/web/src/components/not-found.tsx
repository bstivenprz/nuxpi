import { Bug } from "lucide-react";

import { Heading } from "./heading";
import Link from "next/link";

export function NotFound() {
  return (
    <div className="my-6 flex min-h-full flex-col items-center justify-center gap-6">
      <Bug size={48} />
      <Heading level="h3">Esta página no está disponible</Heading>
      <p className="text-center">
        Es posible que el enlace que has seguido sea incorrecto o que se haya
        eliminado la página. Intenta buscar lo que necesitas desde la página
        principal.
      </p>

      <Link className="text-link" href="/">
        Volver a inicio
      </Link>
    </div>
  );
}
