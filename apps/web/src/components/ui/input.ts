"use client";

import { Input as InputBase } from "@heroui/input";
import { extendVariants } from "@heroui/react";

export const Input = extendVariants(InputBase, {
  defaultVariants: {
    variant: "bordered",
  },
  variants: {
    variant: {
      bordered: {
        inputWrapper: "border-small shadow-none",
      },
    },
  },
});
