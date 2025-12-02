"use client";

import React from "react";

import { tv } from "@heroui/react";

const heading = tv({
  base: "",
  variants: {
    level: {
      h1: "desktop:mb-8 desktop:text-4xl desktop:text-5xl mb-6 text-3xl font-bold tracking-tight",
      h2: "desktop:mb-6 desktop:text-3xl desktop:text-4xl mb-4 text-2xl font-semibold tracking-tight",
      h3: "desktop:mb-4 desktop:text-2xl mb-3 text-xl font-semibold",
      h4: "text-large desktop:mb-3 desktop:text-xl mb-2 font-semibold",
      h5: "text-medium desktop:text-large mb-2 font-medium",
      h6: "text-small desktop:text-medium mb-2 font-medium",
      caption: "text-small mb-2 font-medium text-default-400",
    },
  },
  defaultVariants: {
    level: "h1",
  },
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "caption";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  level?: HeadingLevel;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, as, level = "h1", className, ...restProps }, ref) => {
    const Component = as || level.startsWith("h") ? level : "div";
    return (
      <Component
        className={heading({ level, className })}
        ref={ref}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";
