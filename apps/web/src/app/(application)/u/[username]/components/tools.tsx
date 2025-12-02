"use client";

import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { addToast } from "@heroui/react";
import {
  SettingsIcon,
  HeartIcon,
  MoreVerticalIcon,
  Link2Icon,
  BellOffIcon,
  HandFistIcon,
  MessageSquareWarningIcon,
} from "lucide-react";
import Link from "next/link";

export function Tools({ isOwner }: { isOwner?: boolean }) {
  function favorite() {}

  function copy() {
    addToast({
      title: "¡Copiado!",
    });
  }

  function mute() {}

  function block() {}

  function report() {}

  return (
    <div className="flex items-center gap-2">
      {isOwner ? (
        <>
          <Button
            radius="full"
            as={Link}
            href="/settings"
            variant="light"
            isIconOnly
          >
            <SettingsIcon size={18} />
          </Button>
        </>
      ) : (
        <>
          <Button
            radius="full"
            variant="light"
            isIconOnly
            onPress={favorite}
            // isLoading={isFavoriting}
          >
            <HeartIcon size={18} />
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button radius="full" variant="light" isIconOnly>
                <MoreVerticalIcon size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="flat">
              <DropdownItem
                startContent={<Link2Icon size={18} />}
                key="copy"
                onPress={copy}
              >
                Copiar enlace
              </DropdownItem>
              <DropdownItem
                startContent={<BellOffIcon size={18} />}
                key="mute"
                onPress={mute}
              >
                Silenciar
              </DropdownItem>
              <DropdownItem
                startContent={<HandFistIcon size={18} />}
                className="text-danger"
                key="block"
                onPress={block}
              >
                Bloquear
              </DropdownItem>
              <DropdownItem
                startContent={<MessageSquareWarningIcon size={18} />}
                className="text-danger"
                key="report"
                onPress={report}
              >
                Reportar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}
    </div>
  );
}
