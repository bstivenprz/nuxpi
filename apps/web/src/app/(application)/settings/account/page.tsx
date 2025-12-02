"use client";

import { LandmarkIcon, LogOutIcon, TrashIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "@/components/header";
import { Menu, MenuItem } from "@/components/menu";
import { createClient } from "@/libs/supabase/client";

export default function AccountSettings() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
  }

  return (
    <main>
      <Header>Cuenta</Header>

      <Menu>
        <MenuItem
          as={Link}
          href="/account"
          description="Administra tu cuenta principal y datos personales"
          startContent={<UserIcon />}
        >
          Información de la cuenta
        </MenuItem>
        <MenuItem
          as={Link}
          href="/account/banks"
          description="Agrega o actualiza tu información bancaria"
          startContent={<LandmarkIcon />}
        >
          Información bancaria
        </MenuItem>
        <MenuItem
          as={Link}
          href="/account/delete"
          description="Elimina tu cuenta permanentemente"
          startContent={<TrashIcon />}
        >
          Eliminar cuenta
        </MenuItem>
        <MenuItem
          color="danger"
          startContent={<LogOutIcon />}
          hideArrow
          onPress={logout}
        >
          Cerrar sesión
        </MenuItem>
      </Menu>
    </main>
  );
}
