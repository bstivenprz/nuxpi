import { Avatar } from "@heroui/react";

export function Message({
  children,
  picture,
  isResponse,
}: {
  children: React.ReactNode;
  picture?: string;
  isResponse?: boolean;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className={`flex mt-2 ${isResponse ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] w-fit flex items-center gap-2 ${isResponse && "flex-row-reverse"}`}
        >
          {!isResponse && <Avatar size="sm" src={picture} />}
          <div
            className={`py-2 px-3 rounded-xl text-sm w-fit ${isResponse ? "bg-primary text-primary-foreground" : "bg-default-100 text-foreground"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
