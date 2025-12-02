"use server";

import { fetchAPI } from "@/api/fetch";
import { AuthErrorMap } from "@/libs/supabase/error-codes";
import { toSupabaseErrorMap } from "@/libs/supabase/error-map";
import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";

type ActionState = {
  error: AuthErrorMap;
};

export async function signUpAction(
  _: ActionState | undefined,
  formData: FormData
): Promise<ActionState | undefined> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const name = String(formData.get("name"));
  const username = String(formData.get("username")).toLowerCase().trim();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        username,
      },
    },
  });

  if (error) return { error: toSupabaseErrorMap(error) };

  const { user, session } = data;
  if (user && session?.access_token) {
    try {
      await fetchAPI("/identity/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          uuid: session.user.id,
          email,
          name,
          username,
        }),
      });
    } catch (e) {
      console.error("Error sincronizando identidad en la base de datos:", e);
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error)
        console.error(
          "Hubo un error eliminando usuario sin identidad en Supabase:",
          error.message
        );

      return {
        error: {
          title: "Hubo un error en el registro",
          description: "Tuvimos un inconveniente creando tu usuario.",
        },
      };
    } finally {
      await supabase.auth.refreshSession();
    }
  }

  redirect("/");
}
