"use client";

import {
  BookmarkIcon,
  EllipsisIcon,
  HeartOffIcon,
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

export function OptionsDropdown() {
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

  function toggleHideInsights() {}

  function toggleBookmarkPublication() {
    addToast({
      title: "Publicación guardada.",
    });
  }

  function deletePublication() {
    addToast({
      title: "Publicación eliminada.",
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
        <DropdownItem
          endContent={<PinIcon size={18} />}
          key="pin"
          onPress={togglePinPublication}
        >
          Fijar en el perfil
        </DropdownItem>
        <DropdownItem
          endContent={<HeartOffIcon size={18} />}
          showDivider
          key="hide-insights"
          onPress={toggleHideInsights}
        >
          Ocultar me gustas y comentarios
        </DropdownItem>

        <DropdownItem
          endContent={<BookmarkIcon size={18} />}
          showDivider
          key="save"
          onPress={toggleBookmarkPublication}
        >
          Guardar
        </DropdownItem>

        <DropdownItem
          className="text-danger"
          endContent={<TrashIcon size={18} />}
          key="delete"
          onPress={deletePublication}
        >
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
