"use client";

import { numberFormat } from "@/utils/number-format";
import { Button } from "@heroui/button";

type SelectedAccountsAlertProps = {
  startContent?: React.ReactNode;
  count?: number;
  onRemoveAll?: () => void;
};

export function SelectedAccountsAlert({
  startContent,
  count = 0,
  onRemoveAll,
}: SelectedAccountsAlertProps) {
  if (count === 0) return null;
  return (
    <div className="text-small border-default-200 bg-default-50 mb-2 flex w-full items-center gap-2 border px-4 py-2">
      {startContent}
      <div className="grow font-semibold">
        {numberFormat(count)} usuarios seleccionados
      </div>
      <Button
        className="text-default-500 p-0 font-medium underline underline-offset-4 data-[hover=true]:bg-transparent"
        size="sm"
        variant="light"
        onPress={onRemoveAll}
        disableRipple
      >
        Quitar todos
      </Button>
    </div>
  );
}
