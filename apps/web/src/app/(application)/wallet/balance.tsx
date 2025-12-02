"use client";

import { ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

import { Heading } from "@/components/heading";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";

interface BalanceProps {
  hideActions?: boolean;
}

export function Balance({ hideActions = false }: BalanceProps) {
  const balance = "{balance}";
  const retained_balance = 1;
  const is_allow_withdraw = false;

  const isLoading = false;

  return (
    <div className="rounded-medium border-default-200 mobile:p-2 desktop:p-4 space-y-6 border">
      <div className="flex flex-col">
        <Heading level="caption">Balance disponible</Heading>
        <Skeleton isLoaded={!isLoading}>
          <Heading className="desktop:wide:mb-0" level="h2">
            {balance} TK
          </Heading>
        </Skeleton>
      </div>

      <Alert
        variant="flat"
        title="Saldo retenido"
        description={`${`{retained_balance}`} TK`}
        isVisible={!!retained_balance && retained_balance > 0}
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
            isDisabled={!is_allow_withdraw}
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
