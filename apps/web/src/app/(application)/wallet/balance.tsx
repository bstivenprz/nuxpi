"use client";

import { ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

import { Heading } from "@/components/heading";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { Chip } from "@heroui/react";

interface WalletBalanceResponse {
  balance: number;
  retained_balance: number;
}

const queryFn =  async () => {
  const response = await api.get<WalletBalanceResponse>("/wallet/balance");
  return response.data;
}

export function Balance({ hideActions = false }: { hideActions?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn,
    placeholderData: {
      balance: 0,
      retained_balance: 0,
    },
    initialData: {
      balance: 0,
      retained_balance: 0,
    }
  });

  return (
    <div className="rounded-medium border-default-200 mobile:p-2 desktop:p-4 space-y-6 border">
      <div className="flex flex-col">
        <Heading level="caption">Balance disponible</Heading>
        <Skeleton isLoaded={!isLoading}>
          <Heading className="desktop:wide:mb-0" level="h2">
            {data?.balance} TK
          </Heading>
        </Skeleton>
      </div>

      <Alert
        variant="flat"
        title="Saldo retenido"
        description={`${data?.retained_balance} TK`}
        isVisible={!!data?.retained_balance && data?.retained_balance > 0}
      />

      {!hideActions && (
        <div className="mobile:grid-cols-1 desktop:grid-cols-2 grid items-start gap-2">
          <Button
            color="primary"
            startContent={
              <ArrowUpRightIcon className="text-primary-foreground" />
            }
            fullWidth
            as={Link}
            href="/wallet/topup"
          >
            Recargar
          </Button>
          <Button
            className="no-underline"
            variant="bordered"
            startContent={<ArrowDownLeftIcon />}
            isDisabled={!data?.balance || data?.balance <= 0}
            href="/wallet/withdraw"
            fullWidth
          >
            Retirar
          </Button>
        </div>
      )}
    </div>
  );
}

export function BalanceBadge() {
  const { data } = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn,
    placeholderData: {
      balance: 0,
      retained_balance: 0,
    },
    initialData: {
      balance: 0,
      retained_balance: 0,
    }
  });

  return (
    <Chip
    classNames={{
      content: "font-semibold",
      base: "px-2",
    }}
    size="sm"
    color="danger"
    radius="none"
  >
    {data.balance} TK
  </Chip>
  )
}