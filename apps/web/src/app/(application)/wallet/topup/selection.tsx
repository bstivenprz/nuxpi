"use client";

import React from "react";

import { numberFormat } from "@/utils/number-format";
import { RadioGroup, RadioProps, useRadio } from "@heroui/radio";
import { tv, VariantProps, VisuallyHidden } from "@heroui/react";

export const OPTIONS = [
  {
    tokens: 1,
    price: 3,
  },
  {
    tokens: 5,
    price: 10,
  },
  {
    tokens: 10,
    price: 18,
  },
  {
    tokens: 20,
    price: 34,
  },
  {
    tokens: 30,
    price: 48,
  },
  {
    tokens: 50,
    price: 75,
  },
];

export function SelectionTopUp() {
  const [amount, setAmount] = React.useState<string>("1");

  return (
    <RadioGroup
      classNames={{
        label: "text-tiny font-medium uppercase text-primary",
      }}
      label="Selecciona una opción"
      onValueChange={setAmount}
      value={amount}
    >
      {OPTIONS.map((option) => (
        <Radio
          key={option.tokens}
          endContent={Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(option.price)}
          startContent={`${option.tokens} token${option.tokens > 1 ? "s" : ""}`}
          description={
            <div className="text-success">{`$${numberFormat(
              option.price / option.tokens
            )} por token`}</div>
          }
          value={String(option.tokens)}
        />
      ))}
    </RadioGroup>
  );
}

const radioOption = tv({
  base: [
    "group tap-highlight-transparent border-divider hover:border-primary cursor-pointer gap-4 border px-3 py-4",
    "data-[selected=true]:border-primary active:opacity-50 data-[selected=true]:border-2",
  ],
  variants: {
    variant: {
      default: "bg-content1",
      featured: "bg-gradient-to-tr from-purple-600 to-rose-500 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type RadioOptionVariants = VariantProps<typeof radioOption>;

type Props = {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
};

const Radio = React.forwardRef<
  HTMLInputElement,
  RadioProps & RadioOptionVariants & Props
>((props, ref) => {
  const {
    Component,
    description,
    getBaseProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={radioOption({ variant: props.variant })}
      ref={ref}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div {...getLabelWrapperProps()}>
        {(props.startContent || props.endContent) && (
          <div
            {...getLabelProps()}
            className="flex items-center justify-between font-semibold"
          >
            {props.startContent && <div>{props.startContent}</div>}
            {props.endContent && <div>{props.endContent}</div>}
          </div>
        )}
      </div>
      {description && (
        <div className="text-tiny text-default-400 ms-2 ml-1">
          {description}
        </div>
      )}
    </Component>
  );
});

Radio.displayName = "SelectionOption";
