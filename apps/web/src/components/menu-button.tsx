"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, ButtonProps } from "@heroui/button";

export function MenuButton(props: ButtonProps) {
  const pathname = usePathname();
  const isActiveRoute = props.href ? pathname === props.href : false;

  return (
    <Button
      {...props}
      className={`desktop:justify-start min-h-min gap-4 py-4 ${
        isActiveRoute ? "font-bold" : "font-medium"
      }`}
      as={props.href ? Link : undefined}
      variant="light"
    />
  );
}
