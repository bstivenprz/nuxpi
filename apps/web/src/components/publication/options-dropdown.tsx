"use client";

import {
  BookmarkIcon,
  EllipsisIcon,
  Link2Icon,
  PinIcon,
  TrashIcon,
} from "lucide-react";

import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useRouter } from "next/navigation";

export function OptionsDropdown({
  isOwner,
  externalId,
}: {
  isOwner?: boolean;
  externalId: string;
}) {
  const router = useRouter();

  const { mutate: deletePublication } = useMutation({
    mutationFn: (id: string) => api.delete(`/publications/${id}`),
    onSuccess: () => {
      addToast({
        title: "Publicación eliminada.",
      });
      router.push("/");
    },
    onError: () => {
      addToast({
        title: "Error al eliminar la publicación.",
        description: "Por favor, intenta nuevamente.",
        color: "danger",
      });
    },
  });

  function copyPublicationURLToClipboard() {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      title: "Enlace copiado.",
    });
  }

  function togglePinPublication() {
    addToast({
      title: "Publicación fijada.",
    });
  }

  function toggleBookmarkPublication() {
    addToast({
      title: "Publicación guardada.",
    });
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" size="sm" isIconOnly>
          <EllipsisIcon size={18} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="light">
        <DropdownItem
          endContent={<Link2Icon size={18} />}
          key="copy-link"
          onPress={copyPublicationURLToClipboard}
        >
          Copiar enlace
        </DropdownItem>
        {isOwner ? (
          <DropdownItem
            endContent={<PinIcon size={18} />}
            key="pin"
            onPress={togglePinPublication}
          >
            Fijar en el perfil
          </DropdownItem>
        ) : null}
        <DropdownItem
          endContent={<BookmarkIcon size={18} />}
          showDivider
          key="save"
          onPress={toggleBookmarkPublication}
        >
          Guardar
        </DropdownItem>
        {isOwner ? (
          <DropdownItem
            className="text-danger"
            endContent={<TrashIcon size={18} />}
            key="delete"
            onPress={() => deletePublication(externalId)}
          >
            Eliminar
          </DropdownItem>
        ) : null}
      </DropdownMenu>
    </Dropdown>
  );
}
