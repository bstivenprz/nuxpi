"use server";

import { AuthErrorMap } from "@/libs/supabase/error-codes";
import { toSupabaseErrorMap } from "@/libs/supabase/error-map";
import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";

type ActionState = {
  error: AuthErrorMap;
};

export async function signInAction(
  _: ActionState | undefined,
  formData: FormData
): Promise<ActionState | undefined> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: toSupabaseErrorMap(error) };

  redirect("/");
}
