import { Alert } from "@heroui/alert";

export function Announcements() {
  // TODO: Ocultar este componente al cerrarse todos los anuncios del feed.
  // Usar AlertEvent => onVisibleChange(isVisible: boolean) => void

  return (
    <div className="flex flex-col gap-2 pb-4">
      <Alert
        description="Comienza a seguir a tus creadores favoritos para ver su contenido."
        isClosable
      />
    </div>
  );
}
