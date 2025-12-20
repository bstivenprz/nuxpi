import { GoogleAuthButton } from "@/components/google-auth-button";
import { Heading } from "@/components/heading";
import Link from "next/link";
import { SignInForm } from "./form";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Image
        className="text-foreground"
        src="https://res.cloudinary.com/nuxpi/image/upload/v1765555756/watermark_dark.svg"
        alt="Watermark"
        width={100}
        height={100}
      />

      <div className="text-center">
        <Heading>Iniciar sesión</Heading>

        <div className="text-small text-default-600">
          Ingresa tu correo electrónico y contraseña para acceder a tu cuenta.
        </div>
      </div>

      <GoogleAuthButton />

      <SignInForm />

      <div className="text-small text-foreground-600">
        ¿No tienes una cuenta aún?{" "}
        <Link className="text-link" href="/sign-up">
          ¡Regístrate ahora!
        </Link>
      </div>
    </div>
  );
}
