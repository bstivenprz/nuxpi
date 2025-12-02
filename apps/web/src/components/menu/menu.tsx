import { cn } from "@heroui/react";

export function Menu(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex w-full flex-col", props.className)} {...props} />
  );
}
