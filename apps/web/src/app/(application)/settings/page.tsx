"use client";

import {
  BellIcon,
  CircleDollarSignIcon,
  EyeIcon,
  InfoIcon,
  LockIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/header";
import { Menu, MenuItem } from "@/components/menu";

export default function Settings() {
  return (
    <main>
      <Header>Configuración</Header>

      <Menu className="my-4">
        <MenuItem
          startContent={<CircleDollarSignIcon />}
          description="Gana dinero compartiendo tu contenido"
          as={Link}
          href="/creator"
        >
          Conviértete en creador
        </MenuItem>
        <MenuItem
          startContent={<UserIcon />}
          description="Personaliza tu perfil público"
          as={Link}
          href="/account/profile"
        >
          Editar perfil
        </MenuItem>
        <MenuItem
          startContent={<UserIcon />}
          description="Administra tus datos personales y información bancaria"
          as={Link}
          href="/settings/account"
        >
          Cuenta
        </MenuItem>
        <MenuItem
          startContent={<WalletIcon />}
          description="Consulta tu saldo actual y monitorea tus transacciones"
          as={Link}
          href="/wallet"
        >
          Billetera y transacciones
        </MenuItem>
        <MenuItem
          startContent={<BellIcon />}
          description="Modifica el comportamiento de tus notificaciones"
          as={Link}
          href="/settings/notifications"
        >
          Notificaciones
        </MenuItem>
        <MenuItem
          startContent={<LockIcon />}
          description="Ajusta tus preferencias de seguridad y privacidad"
          as={Link}
          href="/settings/security"
        >
          Privacidad y seguridad
        </MenuItem>
        <MenuItem
          startContent={<EyeIcon />}
          description="Cambia la apariencia del sitio"
          as={Link}
          href="/settings/privacy"
        >
          Apariencia y idioma
        </MenuItem>
        <MenuItem
          startContent={<InfoIcon />}
          description="Encuentra respuestas a tus preguntas y obtén soporte técnico"
          as={Link}
          href="/support"
        >
          Ayuda y soporte
        </MenuItem>
      </Menu>
    </main>
  );
}
