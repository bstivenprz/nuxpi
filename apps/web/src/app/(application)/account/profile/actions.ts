"use server";

import { fetchAPI } from "@/api/fetch";
import { TAGS } from "@/utils/tags";
import { revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { formSchema } from "./schema";
import cloudinary from "@/libs/cloudinary/client";

type ActionState = {
  error: string;
};

export async function updateAction(
  username: string,
  _: ActionState | undefined,
  formData: FormData
): Promise<ActionState | undefined> {
  const form = formSchema.parse(Object.fromEntries(formData.entries()));

  try {
    await fetchAPI("/profile", {
      method: "PATCH",
      body: JSON.stringify(form),
    });
  } catch {
    return {
      error: "No pudimos actualizar tu perfil en estos momentos.",
    };
  }

  updateTag(TAGS.PUBLIC_PROFILE(username));
  redirect(`/u/${username}`);
}

type ImageActionState = {
  success: boolean;
  error?: string;
  value?: string;
};

export async function updateImageAction(
  formData: FormData
): Promise<ImageActionState> {
  const file = formData.get("file") as File;
  const type = formData.get("type") as "cover" | "picture";
  const username = String(formData.get("username"));

  if (!file)
    return {
      success: false,
      error: "No se seleccionó una foto válida.",
    };

  if (file.size > 5 * 1024 * 1024)
    return {
      success: false,
      error: "El archivo debe pesar menos de 5MB",
    };

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.v2.uploader.upload(dataURI, {
      folder: `profiles/${type}`,
      resource_type: "auto",
    });

    await fetchAPI("/profile", {
      method: "PATCH",
      body: JSON.stringify({ [type]: result.secure_url }),
    });

    revalidateTag(TAGS.PROFILE, "max");
    revalidateTag(TAGS.PUBLIC_PROFILE(username), "max");

    return {
      success: true,
      value: result.secure_url,
    };
  } catch (error) {
    console.error(`Error en ${updateImageAction.name}`, error);
    return {
      success: false,
      error: "Hemos fallado en algo, inténtalo nuevamente.",
    };
  }
}

export async function removeImageAction(
  formData: FormData
): Promise<ImageActionState> {
  const username = String(formData.get("username"));
  const type = formData.get("type") as "cover" | "picture";

  try {
    await fetchAPI(`/profile/${type}`, {
      method: "DELETE",
    });

    revalidateTag(TAGS.PROFILE, "max");
    revalidateTag(TAGS.PUBLIC_PROFILE(username), "max");

    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error en ${removeImageAction.name}:`, error);
    return {
      success: false,
      error: "Hemos fallado en algo, inténtalo nuevamente.",
    };
  }
}
