import { Header } from "@/components/header";

import { Form } from "./form";
import { PublicProfileObject } from "@/api/types/public-profile.object";
import { fetchAPI } from "@/api/fetch";

async function fetchProfile(): Promise<PublicProfileObject> {
  const response = await fetchAPI("/profile", { cache: "no-store" });
  return response.json();
}

export default function EditProfile() {
  const promise = fetchProfile();
  return (
    <main>
      <Header>Editar perfil</Header>
      <Form promise={promise} />
    </main>
  );
}
