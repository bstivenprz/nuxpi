import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  let headerCookies: Record<string, string> = {};
  const clientCookies = (await cookies()).toString();
  if (clientCookies) {
    headerCookies["Cookie"] = clientCookies;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...headerCookies,
        ...options.headers,
      },
      ...options,
    }
  );

  if (!response.ok) {
    if (response.status === 401) redirect("/sign-in");
    throw new Error(
      `HTTP Error ${response.statusText} ${response.status} ${response.url}`
    );
  }

  return response;
}
