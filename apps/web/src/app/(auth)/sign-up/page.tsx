import Link from "next/link";

import { Heading } from "@/components/heading";
import { SignUpForm } from "./form";
import { GoogleAuthButton } from "@/components/google-auth-button";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <Heading level="h2">Regístrate</Heading>

        <div className="text-small text-default-600">
          Crea una cuenta de Nuxpi para crear, explorar y ganar.
        </div>
      </div>

      <GoogleAuthButton />

      <SignUpForm />

      <div className="text-small text-foreground-600">
        ¿Ya tienes una cuenta?{" "}
        <Link className="text-link" href="/sign-in">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
