"use client";

import Link, { LinkProps } from "next/link";

import React from "react";

import { cn } from "@heroui/react";

const Anchor = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & React.HTMLAttributes<HTMLAnchorElement>
>((props, ref) => (
  <Link
    {...props}
    className={cn(
      "text-blue-500 font-semibold hover:opacity-70",
      props.className
    )}
    ref={ref}
  >
    {props.children}
  </Link>
));

Anchor.displayName = "Anchor";

export { Anchor };
