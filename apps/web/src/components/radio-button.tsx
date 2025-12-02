"use client";

import { cn, type RadioProps, useRadio, VisuallyHidden } from "@heroui/react";

export interface RadioButtonProps extends RadioProps {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export function RadioButton({
  startContent,
  endContent,
  ...props
}: RadioButtonProps) {
  const { Component, children, getBaseProps, getInputProps } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "inline-flex m-0 px-3 items-center justify-center gap-1",
        "cursor-pointer border border-default-200",
        "text-small font-semibold h-8",
        "hover:bg-content2",
        "data-[selected=true]:border-primary data-[selected=true]:font-semibold data-[selected=true]:text-primary",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
        props.className
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      {startContent}
      {children}
      {endContent}
    </Component>
  );
}
