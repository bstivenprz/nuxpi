import { Header } from "@/components/header";

import { Publication } from "./publication";

export default function PublicationPage() {
  return (
    <>
      <Header>Publicación</Header>

      <Publication externalId="external-id" caption="{caption}" />
    </>
  );
}
