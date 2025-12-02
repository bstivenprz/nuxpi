"use client";

import { cn, type RadioProps, useRadio, VisuallyHidden } from "@heroui/react";

export interface ChipRadioProps extends RadioProps {
  endContent?: React.ReactNode;
}

export function ChipRadio({ endContent, ...props }: ChipRadioProps) {
  const { Component, children, getBaseProps, getInputProps } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "inline-flex m-0 px-3 items-center justify-center",
        "cursor-pointer border-1 rounded-full border-default-200",
        "text-tiny font-medium h-8",
        "hover:bg-content2",
        "data-[selected=true]:border-primary data-[selected=true]:font-semibold data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
        props.className
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      {children}
      {endContent && <span className="ml-2">{endContent}</span>}
    </Component>
  );
}
