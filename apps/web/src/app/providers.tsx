"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { popupRegistry } from "@/components/popups/registry";
import { PopUpProvider } from "@/providers/popup-provider";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import z from "zod";
import { es } from "zod/locales";

z.config(es());

dayjs.extend(relativeTime);
dayjs.locale("es");

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={router.push}>
        <PopUpProvider registry={popupRegistry}>{children}</PopUpProvider>
        <ToastProvider
          toastProps={{
            radius: "none",
            color: "primary",
            variant: "solid",
            hideCloseButton: true,
          }}
          maxVisibleToasts={1}
          placement="bottom-center"
        />
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
