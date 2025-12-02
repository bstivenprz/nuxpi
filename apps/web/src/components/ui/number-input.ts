import { extendVariants, NumberInput as NumberInputBase } from "@heroui/react";

export const NumberInput = extendVariants(NumberInputBase, {
  defaultVariants: {
    variant: "bordered",
  },
  variants: {
    variant: {
      bordered: {
        inputWrapper: "border-small",
      },
    },
  },
});
