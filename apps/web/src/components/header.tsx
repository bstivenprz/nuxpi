"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

import { Button, cn } from "@heroui/react";

import { Heading } from "./heading";

export interface HeaderProps {
  children?: React.ReactNode;
  placement?: "start" | "center" | "end";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  hideBackButton?: boolean;
  disableScrollHide?: boolean;
  invisibleBackground?: boolean;
}

export function Header({
  children,
  endContent,
  hideBackButton,
  placement = "start",
  startContent,
  disableScrollHide = false,
}: Readonly<HeaderProps>) {
  const router = useRouter();

  const otherProps = {
    [`data-placement-${placement}`]: true,
  };

  const [visible, setVisible] = React.useState(true);
  const [scrollPos, setScrollPos] = React.useState(0);

  React.useEffect(() => {
    if (disableScrollHide) return;

    function handleScrollPosition() {
      const currentScrollPosition = window.scrollY;
      const isVisible =
        scrollPos > currentScrollPosition || currentScrollPosition < 10;
      setScrollPos(currentScrollPosition);
      setVisible(isVisible);
    }

    window.addEventListener("scroll", handleScrollPosition);

    return () => {
      window.removeEventListener("scroll", handleScrollPosition);
    };
  }, [scrollPos, disableScrollHide]);

  const isString = children && typeof children === "string";

  return (
    <div
      className={cn(
        "sticky top-0 z-20 transition-transform duration-200",
        visible ? "transform-none" : "-translate-y-full"
      )}
    >
      <div className="bg-background relative flex w-full items-center desktop:py-3 mobile:py-1.5">
        {!hideBackButton && (
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <Button
              radius="full"
              size="sm"
              variant="light"
              isIconOnly
              onPress={router.back}
            >
              <ArrowLeft />
            </Button>
          </div>
        )}
        <div
          className={cn(
            "flex grow items-center overflow-hidden",
            placement === "start" && "data-[placement-start=true]:ml-10",
            placement === "center" && "data-[placement-center=true]:m-0",
            placement === "end" && "data-[placement-end=true]:m-0",
            !!startContent && "gap-2"
          )}
          {...otherProps}
        >
          {startContent}
          {isString ? (
            <>
              <Heading
                as="div"
                className="desktop:block mb-0 line-clamp-1 hidden truncate font-semibold"
                level="h5"
              >
                {children?.toString()}
              </Heading>
              <Heading
                as="div"
                className="desktop:hidden mb-0 line-clamp-1 block truncate font-semibold"
                level="h3"
              >
                {children?.toString()}
              </Heading>
            </>
          ) : (
            <div className="w-full">{children}</div>
          )}
        </div>
        {endContent}
      </div>
    </div>
  );
}
