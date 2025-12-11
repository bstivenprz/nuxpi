"use server";

import { fetchAPI } from "@/api/fetch";
import { formDataToJSON } from "@/utils/form-data";
import { schema } from "./schema";
import { PublicationObject } from "@/api/types/content.types";
import { redirect } from "next/navigation";

type ActionState = {
  success?: boolean;
  error?: string;
};

export async function createPublicationAction(
  _: ActionState | undefined,
  formData: FormData
): Promise<ActionState | undefined> {
  const body = schema.parse(formDataToJSON(formData));
  const response = await fetchAPI("/publications", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return {
      success: false,
      error: "Error al crear la publicación",
    };
  }

  const publication = await response.json() as PublicationObject;

  redirect(`/p/${publication.id}`);
}
