import { Header } from "@/components/header";

import { CreatePublicationForm } from "./form";

export default function CreatePage() {
  return (
    <main className="space-y-6">
      <Header>Crear publicación</Header>
      <CreatePublicationForm />
    </main>
  );
}
