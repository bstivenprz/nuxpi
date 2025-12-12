"use server";

import { fetchAPI } from "@/api/fetch";
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
  const body = {
    caption: formData.get("caption") as string,
    audience: formData.get("audience") as string,
    assets: (formData.get("assets") as string)?.split(",") ?? [],
  };

  const response = await fetchAPI("/publications", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Error creating publication:", response.status);
    return {
      success: false,
      error: "Error al crear la publicación",
    };
  }

  const publication = (await response.json()) as PublicationObject;

  redirect(`/p/${publication.id}`);
}
