import { Button, ButtonProps } from "@heroui/button";

type Props = {
  description?: string;
  hideArrow?: boolean;
};

export type MenuItemProps = ButtonProps & Props;

export function MenuItem({
  children,
  description,
  endContent,
  hideArrow,
  ...props
}: MenuItemProps) {
  return (
    <Button
      {...props}
      className="justify-start py-8 text-start mobile:gap-4 mobile:px-2 desktop:gap-6 desktop:px-4"
      endContent={
        endContent ? (
          endContent
        ) : !hideArrow ? (
          <i className="fa-regular fa-chevron-right fa-lg" />
        ) : null
      }
      variant="light"
      fullWidth
    >
      <div className="grow">
        <div className="font-medium">{children}</div>
        {description && (
          <div className="line-clamp-2 text-foreground-500 mobile:hidden tablet:block tablet:text-tiny desktop:text-small">
            {description}
          </div>
        )}
      </div>
    </Button>
  );
}
