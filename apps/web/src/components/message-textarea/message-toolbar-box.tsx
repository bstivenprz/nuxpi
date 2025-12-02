import { XIcon } from "lucide-react";

import type React from "react";

export interface MessageToolbarBoxProps {
  title: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function MessageToolbarBox({
  title,
  children,
  isOpen,
  onClose,
}: MessageToolbarBoxProps) {
  if (!isOpen) return null;
  return (

    <div className="animate-in fade-in slide-in-from-bottom duration-200">
      <div className="border-default-200 border-x border-t p-3 bg-background w-full">
        <div className="mb-3 flex items-center">
          <div className="font-semibold text-small grow">{title}</div>
          <button
            className="text-foreground-600 cursor-pointer"
            onClick={onClose}
          >
            <XIcon size={16} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
