import Link from "next/link";

import { Controller, useForm } from "react-hook-form";

import { Avatar, Button, Textarea } from "@heroui/react";

interface CommentTextareaForm {
  comment: string;
}

export function CommentTextarea() {
  const form = useForm<CommentTextareaForm>({
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(form: CommentTextareaForm) {}

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  }

  const isValid = form.formState.isDirty && form.formState.isValid;
  const isLoading = form.formState.isSubmitting;

  return (
    <form
      className="flex w-full items-center gap-2 py-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Link href={`/u/username`}>
        <Avatar size="sm" />
      </Link>

      <Controller
        render={({ field }) => (
          <Textarea
            classNames={{
              inputWrapper: "border-none shadow-none px-0",
              innerWrapper: "items-center",
            }}
            endContent={
              <Button
                isDisabled={!isValid}
                isLoading={isLoading}
                type="submit"
                variant="light"
                size="sm"
              >
                Publicar
              </Button>
            }
            autoComplete="off"
            autoCorrect="off"
            minRows={1}
            placeholder="Escribe un comentario"
            variant="bordered"
            onKeyDown={handleKeyDown}
            {...field}
          />
        )}
        rules={{
          required: true,
        }}
        control={form.control}
        name="comment"
      />
    </form>
  );
}
