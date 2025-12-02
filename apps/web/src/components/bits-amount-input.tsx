"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

import React from "react";

import { NumberInput } from "@/components/ui/number-input";
import { Button } from "@heroui/button";

const BITS_AMOUNT_INPUT_DEFAULT = 1;
const BITS_MIN_AMOUNT = 1;

export interface BitsAmountInputProps {
  value?: number;
  max?: number;
  onChange?: (amount: number) => void;
}

export function BitsAmountInput({
  value = BITS_AMOUNT_INPUT_DEFAULT,
  max,
  onChange,
}: BitsAmountInputProps) {
  const [amount, setAmount] = React.useState<number>(value);
  const [maxReached, setMaxReached] = React.useState<boolean>(false);

  function increase() {
    setAmount((prev) => {
      const limit = typeof max === "number" ? max : Infinity;
      if (prev >= limit) {
        setMaxReached(true);
        return prev;
      }
      const newAmount = prev + 1;
      onChange?.(newAmount);
      return newAmount;
    });
  }

  function decrease() {
    setAmount((prev) => {
      const newAmount = Math.max(BITS_MIN_AMOUNT, prev - 1);
      const limit = typeof max === "number" ? max : Infinity;
      if (newAmount < limit) setMaxReached(false);
      onChange?.(newAmount);
      return newAmount;
    });
  }

  return (
    <NumberInput
      className="w-40"
      classNames={{
        inputWrapper: "shadow-none",
        input: "text-center font-bold",
      }}
      size="sm"
      variant="bordered"
      startContent={
        <Button variant="bordered" size="sm" isIconOnly onPress={decrease}>
          <MinusIcon size={16} />
        </Button>
      }
      endContent={
        <Button variant="bordered" size="sm" isIconOnly onPress={increase}>
          <PlusIcon size={16} />
        </Button>
      }
      value={amount}
      min={BITS_MIN_AMOUNT}
      defaultValue={BITS_AMOUNT_INPUT_DEFAULT}
      isInvalid={maxReached}
      errorMessage={maxReached ? `El monto máximo es ${max}` : undefined}
      hideStepper
    />
  );
}
