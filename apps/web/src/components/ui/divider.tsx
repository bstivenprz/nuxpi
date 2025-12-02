"use client";

interface DividerProps {
  children: React.ReactNode | string;
}

export function Divider({ children }: Readonly<DividerProps>) {
  return (
    <div className="relative flex items-center py-5">
      <div className="border-divider grow border-t"></div>
      {typeof children === "string" ? (
        <span className="text-tiny text-foreground-400 mx-3 shrink">
          {children}
        </span>
      ) : (
        children
      )}
      <div className="border-divider grow border-t"></div>
    </div>
  );
}
