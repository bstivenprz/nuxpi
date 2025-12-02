"use client";

import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { signInAction } from "./actions";
import { Alert } from "@heroui/react";

const formSchema = z.object({
  email: z
    .email("El correo electrónico es inválido.")
    .nonempty("El correo electrónico es requerido."),
  password: z.string().nonempty("La contraseña es obligatoria."),
});

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    undefined
  );

  const {
    register,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form className="w-full flex flex-col gap-2" action={formAction}>
      {state && (
        <Alert
          color="danger"
          title={state.error.title}
          description={state.error.description}
        />
      )}

      <Input
        label="Correo electrónico"
        type="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <InputPassword
        label="Contraseña"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        {...register("password")}
      />

      <div className="flex flex-col items-end">
        <Link className="text-link text-small" href="/forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button
        className="mt-4"
        color="primary"
        size="lg"
        type="submit"
        isDisabled={isPending || !(isDirty && isValid)}
        isLoading={isPending}
      >
        Ingresar
      </Button>
    </form>
  );
}
