"use client";

import { PublicProfileObject } from "@/api/types/public-profile.object";
import { use, useActionState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@heroui/button";
import { Input } from "@/components/ui/input";
import { Alert, Select, SelectItem, Textarea } from "@heroui/react";
import { updateAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema";
import { Images } from "./images";

export function Form({ promise }: { promise: Promise<PublicProfileObject> }) {
  const profile = use(promise);

  const action = updateAction.bind(null, profile.username);
  const [state, formAction, isPending] = useActionState(action, undefined);

  const {
    control,
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  return (
    <div className="flex flex-col">
      <Images
        username={profile.username}
        cover={profile.cover}
        picture={profile.picture}
      />

      <form className="flex flex-col gap-3" action={formAction}>
        <Input
          description="Este es el nombre que se mostrará públicamente en tu perfil."
          label="Nombre público"
          maxLength={40}
          isInvalid={!!errors?.name}
          errorMessage={errors?.name?.message}
          defaultValue={profile.name}
          {...register("name")}
        />
        <Controller
          control={control}
          name="presentation"
          render={({ field }) => (
            <Textarea
              variant="bordered"
              label={`Presentación (${field.value?.length ?? 0}/500)`}
              maxLength={500}
              rows={3}
              isInvalid={!!errors?.presentation}
              errorMessage={errors?.presentation?.message}
              defaultValue={profile.presentation}
              {...field}
            />
          )}
        />
        <Select
          name="gender"
          variant="bordered"
          label="Sexo"
          description="Esto no formará parte de tu perfil público."
          defaultSelectedKeys={profile.gender ? [profile.gender] : []}
        >
          <SelectItem key="male">Hombre</SelectItem>
          <SelectItem key="female">Mujer</SelectItem>
          <SelectItem key="lgbtiq">LGBTIQ+</SelectItem>
          <SelectItem key="other">Otro</SelectItem>
          <SelectItem key="prefer_not_say">Prefiero no decirlo</SelectItem>
        </Select>

        {state && (
          <Alert
            color="danger"
            title="Tuvimos un problema"
            description={state.error}
          />
        )}

        <Button
          color="primary"
          type="submit"
          isDisabled={isPending || !isValid}
          isLoading={isPending}
          fullWidth
        >
          Listo
        </Button>
      </form>
    </div>
  );
}
