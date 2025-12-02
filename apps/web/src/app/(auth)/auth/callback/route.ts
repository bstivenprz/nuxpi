import { NextResponse } from "next/server";

// The client you created from the Server-Side Auth instructions
import { createClient } from "@/libs/supabase/server";
import { fetchAPI } from "@/api/fetch";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { session, user } = data;
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
              email: user.email,
              name: user.user_metadata.full_name ?? undefined,
            }),
          });
        } catch (e) {
          console.error(
            "Error sincronizando identidad en la base de datos:",
            e
          );
          const { error } = await supabase.auth.admin.deleteUser(user.id);
          if (error)
            console.error(
              "Hubo un error eliminando usuario sin identidad en Supabase:",
              error.message
            );

          return NextResponse.redirect(`${origin}/auth/auth-code-error`);
        } finally {
          await supabase.auth.refreshSession();
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
