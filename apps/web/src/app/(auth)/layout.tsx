import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <div className="relative z-10 container mx-auto my-24 max-w-md">
        {children}
      </div>
    </div>
  );
}
