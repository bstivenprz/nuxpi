"use client";

import { FlameIcon } from "lucide-react";

import React from "react";

import { RadioGroup } from "@heroui/react";

import { BitsAmountInput } from "./bits-amount-input";
import { RadioButton } from "./radio-button";

export interface BitSelectorProps {
  isDisabled?: boolean;
  onAmountChange?: (amount: number) => void;
}

export function BitsSelector({ onAmountChange, isDisabled }: BitSelectorProps) {
  const [radioAmountSelected, setRadioAmountSelected] =
    React.useState<string>();
  const [showNumberInput, onShowNumberInput] = React.useState<boolean>(false);

  function handleRadioChange(value: string) {
    if (value === "other") onShowNumberInput(true);
    else onShowNumberInput(false);
    setRadioAmountSelected(value);
    onAmountChange?.(parseInt(value, 10));
  }

  return (
    <div className="flex flex-col gap-2">
      <RadioGroup
        classNames={{
          wrapper: "gap-1",
        }}
        orientation="horizontal"
        isDisabled={isDisabled}
        value={radioAmountSelected}
        onValueChange={handleRadioChange}
      >
        {[1, 3, 6, 10].map((bitAmount, key) => (
          <RadioButton
            key={`radio_button_${key}`}
            value={bitAmount.toString()}
            startContent={<FlameIcon className="text-danger" fill="hsl(var(--heroui-danger) / 1)" size={16} />}
          >
            {bitAmount}
          </RadioButton>
        ))}
        <RadioButton value="other">Otro monto</RadioButton>
      </RadioGroup>

      {showNumberInput && <BitsAmountInput onChange={onAmountChange} />}
    </div>
  );
}
