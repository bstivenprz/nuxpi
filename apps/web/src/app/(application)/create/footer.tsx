"use client";

import { Settings2Icon } from "lucide-react";

import { Controller, useFormContext } from "react-hook-form";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from "@heroui/react";

import { CreateForm } from "./types";

export const DEFAULT_SELECTED_PRIVACY = "anyone";

export function Footer() {
  const form = useFormContext<CreateForm>();

  const isValid = form.formState.dirtyFields && form.formState.isValid;
  const isLoading = form.formState.isSubmitting;

  return (
    <div className="flex items-center gap-2">
      <Controller
        render={({ field }) => (
          <div className="grow">
            <Dropdown>
              <DropdownTrigger className="text-small hover:opacity-hover max-w-fit cursor-pointer font-medium">
                <Button
                  className="px-2"
                  variant="light"
                  size="sm"
                  startContent={
                    <Settings2Icon className="text-default-600" size={20} />
                  }
                >
                  Privacidad de comentarios
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                defaultSelectedKeys={new Set([DEFAULT_SELECTED_PRIVACY])}
                selectedKeys={new Set([field.value]) as Selection}
                selectionMode="single"
                disallowEmptySelection
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys as Set<string>)[0];
                  field.onChange(selectedKey);
                }}
              >
                <DropdownItem
                  key="anyone"
                  description="Cualquiera puede comentar"
                >
                  Cualquiera
                </DropdownItem>
                <DropdownItem
                  key="followers"
                  description="Seguidores y seguidos pueden comentar"
                >
                  Seguidores y seguidos
                </DropdownItem>
                <DropdownItem
                  key="sponsors"
                  description="Sólo los perfiles que te manden tokens pueden comentar"
                >
                  Tus sponsors
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
        control={form.control}
        name="comments_privacy"
      />
      <Button
        color="primary"
        variant="bordered"
        isDisabled={!isValid}
        isLoading={isLoading}
        type="submit"
      >
        Publicar
      </Button>
    </div>
  );
}
