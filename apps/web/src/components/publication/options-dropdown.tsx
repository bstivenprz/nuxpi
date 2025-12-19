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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OptionsDropdown({
  isOwner,
  externalId,
  initialIsPinned,
}: {
  isOwner?: boolean;
  externalId: string;
  initialIsPinned?: boolean;
}) {
  const [isPinned, setIsPinned] = useState(initialIsPinned);

  const router = useRouter();
  const queryClient = useQueryClient();

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
    navigator.clipboard.writeText(`${window.location.origin}/p/${externalId}`);
    addToast({
      title: "Enlace copiado.",
    });
  }

  async function pinPublication() {
    try {
      await api.post(`/content/profile/pin/${externalId}`);
      addToast({
        title: "Publicación fijada.",
      });
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      setIsPinned(true);
    } catch {
      addToast({
        title: "Error al fijar la publicación.",
        description: "Por favor, intenta nuevamente.",
        color: "danger",
      });
    }
  }

  async function unpinPublication() {
    try {
      await api.delete(`/content/profile/pin/${externalId}`);
      addToast({
        title: "Publicación desfijada.",
      });
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      setIsPinned(false);
    } catch {
      addToast({
        title: "Error al desfijar la publicación.",
        description: "Por favor, intenta nuevamente.",
        color: "danger",
      });
    }
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
            onPress={() => (isPinned ? unpinPublication() : pinPublication())}
          >
            {isPinned ? "Desfijar" : "Fijar"}
          </DropdownItem>
        ) : null}
        <DropdownItem
          endContent={<BookmarkIcon size={18} />}
          showDivider={isOwner}
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
