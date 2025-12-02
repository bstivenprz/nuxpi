"use client";

import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/libs/supabase/client";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/user";

type MenuHeaderProps = {
  name: string;
  username: string;
  picture?: string;
};

export function MenuHeader({ name, username, picture }: MenuHeaderProps) {
  const supabase = createClient();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/sign-in");
  }

  return (
    <div className="flex items-center px-4 w-full">
      <User
        className="grow justify-start"
        classNames={{
          name: "font-semibold",
        }}
        avatarProps={{
          classNames: {
            base: "bg-default-100",
            icon: "text-default-300",
          },
          src: picture,
        }}
        as={Link}
        href={`/u/${username}`}
        name={name}
        description={username}
      />

      <Dropdown>
        <DropdownTrigger>
          <Button
            className="desktop:inline-flex hidden"
            size="sm"
            variant="light"
            radius="full"
            isIconOnly
          >
            <MoreVerticalIcon size={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="light">
          <DropdownItem key="profile-settings" href="/account/profile">
            Personalizar perfil
          </DropdownItem>
          <DropdownItem key="account-settings" href="/settings" showDivider>
            Configuración
          </DropdownItem>
          <DropdownItem
            className="text-danger"
            color="danger"
            key="logout"
            onPress={logout}
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
