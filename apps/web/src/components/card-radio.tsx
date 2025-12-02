"use client";

import { cn, Radio, type RadioProps } from "@heroui/react";

export interface CardRadioProps extends RadioProps {
  title?: string;
  description?: string;
  startContent?: React.ReactNode;
}

export function CardRadio({
  title,
  children,
  description,
  startContent,
  ...props
}: CardRadioProps) {
  return (
    <Radio
      classNames={{
        base: cn(
          "inline-flex m-0 hover:bg-content2 items-center justify-between",
          "flex-row-reverse min-w-full cursor-pointer rounded-medium gap-4 p-4 border border-default-200",
          "data-[selected=true]:border-primary"
        ),
      }}
      {...props}
    >
      <div className="flex items-center gap-4">
        {startContent}
        <div>
          {title && <div className="text-tiny">{title}</div>}
          <div className="text-large font-semibold">{children}</div>
          {description && (
            <div className="text-small text-foreground-500">{description}</div>
          )}
        </div>
      </div>
    </Radio>
  );
}
