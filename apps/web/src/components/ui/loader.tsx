import { Spinner, tv, VariantProps } from "@heroui/react";

const loader = tv({
  base: "flex flex-col justify-center items-center w-full",
  variants: {
    size: {
      sm: "my-4",
      md: "my-8",
      lg: "my-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type LoaderVariants = VariantProps<typeof loader>;

export function Loader({ size = "md" }: LoaderVariants) {
  const classes = loader({ size });

  return (
    <div className={classes}>
      <Spinner size={size} />
    </div>
  );
}
