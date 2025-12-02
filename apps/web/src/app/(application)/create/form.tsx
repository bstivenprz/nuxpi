"use client";

import { FormProvider, useForm } from "react-hook-form";

import { Avatar } from "@heroui/react";

import { Actions } from "./actions";
import { Caption } from "./caption";
import { DEFAULT_SELECTED_PRIVACY, Footer } from "./footer";
import { type CreateForm } from "./types";

export function CreatePublicationForm() {
  const form = useForm<CreateForm>({
    defaultValues: {
      caption: "",
      comments_privacy: DEFAULT_SELECTED_PRIVACY,
    },
  });

  async function onSubmit({}: CreateForm) {}

  return (
    <FormProvider {...form}>
      <form className="flex gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Avatar />
        </div>

        <div className="relative space-y-1 w-full">
          <Caption />
          <Actions />
          <Footer />
        </div>
      </form>
    </FormProvider>
  );
}
