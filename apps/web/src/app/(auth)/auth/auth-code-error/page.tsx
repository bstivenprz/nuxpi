"use client";

import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <main className="flex flex-col w-full h-full justify-center items-center">
      <Alert
        color="danger"
        title="Error al iniciar sesión"
        description="Tuvimos problemas para autenticarte este momento, inténtalo de nuevo más tarde."
        endContent={
          <Button as={Link} href="/sign-in">
            Volver a intentarlo
          </Button>
        }
      />
    </main>
  );
}
