"use client";

import { InputPassword } from "@/components/ui/input-password";
import { Input } from "@/components/ui/input";
import { Button } from "@heroui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signUpAction } from "./actions";
import { useActionState } from "react";
import { Alert } from "@heroui/alert";

const formSchema = z.object({
  email: z
    .email("El correo electrónico es inválido.")
    .nonempty("El correo electrónico es requerido."),
  password: z
    .string()
    .min(8, "La contraseña debe contener al menos 8 caracteres."),
  name: z.string().nonempty("Danos tu nombre completo."),
  username: z
    .string()
    .min(3, "El nombre de usuario debe contener al menos 3 caracteres.")
    .max(30, "El nombre de usuario debe contener máximo 30 caracteres.")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "El nombre de usuario debe contener sólo letras, números, guiones bajos y puntos."
    ),
});

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    undefined
  );

  const {
    register,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      username: "",
    },
  });

  return (
    <form
      className="flex flex-col gap-2 w-full"
      autoComplete="off"
      action={formAction}
    >
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
      <Input
        label="Nombre completo"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Nombre de usuario"
        isInvalid={!!errors.username}
        errorMessage={errors.username?.message}
        {...register("username")}
      />

      <div className="text-tiny text-default-600">
        Al registrarte, aceptas nuestras{" "}
        <Link className="text-link" href="/help/conditions" target="_blank">
          condiciones de uso
        </Link>{" "}
        y{" "}
        <Link className="text-link" href="/help/privacy" target="_blank">
          políticas de privacidad.
        </Link>
      </div>

      <Button
        className="mt-4"
        color="primary"
        size="lg"
        type="submit"
        isDisabled={isPending || !(isDirty && isValid)}
        isLoading={isPending}
        fullWidth
      >
        Registrarme
      </Button>
      <Button
        className="mt-2 font-medium"
        color="secondary"
        variant="shadow"
        fullWidth
      >
        <span className="relative z-10">Registrarme como creador</span>
      </Button>
    </form>
  );
}
