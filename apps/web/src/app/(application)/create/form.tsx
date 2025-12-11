"use client";

import { FormProvider, useForm } from "react-hook-form";

import { Alert, Avatar } from "@heroui/react";

import { Tools } from "./tools";
import { Caption } from "./caption";
import { Footer } from "./footer";
import { useActionState } from "react";
import { createPublicationAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { useAuthenticated } from "@/hooks/use-authenticated";
import { MultimediaPreview } from "./multimedia-preview";

export function CreatePublicationForm() {
  const profile = useAuthenticated();

  const [state, formAction, isPending] = useActionState(
    createPublicationAction,
    undefined
  );

  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <FormProvider {...form}>
      {state?.success === false && (
        <Alert
          color="danger"
          title="Tuvimos un problema"
          description={state?.error}
        />
      )}

      <form className="space-y-6" action={formAction}>
        <div className="flex gap-3">
          <div>
            <Avatar src={profile?.picture} />
          </div>

          <div className="grow">
            <Caption />
            <Tools />
            {form.formState.errors && (
              <div className="text-tiny text-danger">
                {form.formState.errors.root?.message}
              </div>
            )}
          </div>
        </div>

        <MultimediaPreview />
        <Footer isPending={isPending} />
      </form>
    </FormProvider>
  );
}
