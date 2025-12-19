import {
  BugIcon,
  CircleQuestionMarkIcon,
  FlameIcon,
  HeartIcon,
  HomeIcon,
  MessagesSquareIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  UserIcon,
  WalletMinimalIcon,
} from "lucide-react";

import { MenuButton } from "./menu-button";
import { MenuHeader } from "./menu-header";

import { fetchAPI } from "@/api/fetch";
import { CurrentProfileObject } from "@/api/types/current-profile.object";
import { BalanceBadge } from "@/app/(application)/wallet/balance";
import { CounterNotifications } from "./counter-notifications";
import { CounterMessages } from "./counter-messages";

export async function SideMenu() {
  const response = await fetchAPI("/profile", { cache: "no-store" });
  const profile = (await response.json()) as CurrentProfileObject;

  return (
    <div className="tablet:w-20 desktop:w-[320px] desktop:items-start tablet:flex border-divider hidden h-full flex-col items-center gap-6 border-r py-6">
      <MenuHeader
        name={profile.name}
        username={profile.username}
        picture={profile.picture}
      />

      <div className="desktop:items-stretch flex w-full grow flex-col items-center gap-2">
        <MenuButton href="/" startContent={<HomeIcon />}>
          Inicio
        </MenuButton>
        <MenuButton href="/explore/for-you" startContent={<SearchIcon />}>
          Explorar
        </MenuButton>
        <MenuButton
          href="/notifications"
          startContent={
            <CounterNotifications>
              <HeartIcon />
            </CounterNotifications>
          }
        >
          Notifications
        </MenuButton>
        <MenuButton
          href="/messages"
          startContent={
            <CounterMessages>
              <MessagesSquareIcon />
            </CounterMessages>
          }
        >
          Mensajes
        </MenuButton>
        <MenuButton href={`/u/${profile.username}`} startContent={<UserIcon />}>
          Mi Perfil
        </MenuButton>
        <MenuButton href="/creator/on-boarding" startContent={<FlameIcon />}>
          Conviértete en creador
        </MenuButton>
        <MenuButton
          href="/wallet"
          startContent={<WalletMinimalIcon />}
          endContent={<BalanceBadge />}
        >
          Billetera
        </MenuButton>
        <MenuButton href="/create" startContent={<PlusIcon />}>
          Crear
        </MenuButton>
      </div>

      <div className="flex w-full flex-col">
        <MenuButton startContent={<SparklesIcon />}>Novedades</MenuButton>
        <MenuButton startContent={<CircleQuestionMarkIcon />}>
          Soporte
        </MenuButton>
        <MenuButton startContent={<BugIcon />}>Reportar un problema</MenuButton>
      </div>
    </div>
  );
}
