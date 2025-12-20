"use client";

import {
  HomeIcon,
  SearchIcon,
  MessagesSquareIcon,
  PlusIcon,
  WalletMinimalIcon,
  UserIcon,
  SendIcon,
} from "lucide-react";

import { MenuButton } from "@/components/menu-button";
import { CounterMessages } from "@/components/counter-messages";

export function MobileNav({ username }: { username?: string }) {
  return (
    <div className="border-divider bg-background tablet:hidden fixed bottom-0 left-0 right-0 z-50 border-t">
      <div className="mx-auto w-full max-w-[621px]">
        <nav className="flex h-14 items-center justify-around">
          {/* Home */}
          <MenuButton href="/" isIconOnly aria-label="Inicio">
            <HomeIcon />
          </MenuButton>

          {/* Explorar */}
          <MenuButton href="/explore/for-you" isIconOnly aria-label="Explorar">
            <SearchIcon />
          </MenuButton>

          {/* Chat CENTRADO */}
          <MenuButton href="/messages" isIconOnly aria-label="Mensajes">
            <CounterMessages>
              <SendIcon />
            </CounterMessages>
          </MenuButton>

          {/* Wallet */}
          <MenuButton href="/wallet" isIconOnly aria-label="Billetera">
            <WalletMinimalIcon />
          </MenuButton>

          {/* Perfil */}
          <MenuButton
            href={username ? `/u/${username}` : "/account"}
            isIconOnly
            aria-label="Mi perfil"
          >
            <UserIcon />
          </MenuButton>
        </nav>
      </div>
    </div>
  );
}
