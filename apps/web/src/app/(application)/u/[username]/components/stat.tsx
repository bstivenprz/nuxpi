import React from "react";

import { Tooltip } from "@heroui/tooltip";

type StatProps = {
  icon: React.ReactNode;
  tooltip: string;
  children: string;
};

export function Stat({ children, icon, tooltip }: StatProps) {
  return (
    <Tooltip content={tooltip} size="sm">
      <div className="inline-flex items-center gap-1.5">
        {icon}
        <span className="text-small font-semibold">{children}</span>
      </div>
    </Tooltip>
  );
}
