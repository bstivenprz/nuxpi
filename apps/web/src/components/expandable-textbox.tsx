"use client";

import React from "react";

interface ExpandableTextboxProps {
  children?: React.ReactNode | string;
  characterLimit?: number;
  className?: string;
}

export function ExpandableTextbox({
  children,
  characterLimit = 2,
  className,
}: ExpandableTextboxProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);

  React.useLayoutEffect(() => {
    if (children && typeof children === "string") {
      setShowButton(children.length > characterLimit);
    }
  }, [children, characterLimit]);

  function expand() {
    console.log("clicked");
    setIsExpanded((prev) => !prev);
  }

  return (
    <div className={className}>
      <div className="w-full leading-tight">
        {isExpanded
          ? children
          : showButton
          ? `${(children as string).substring(0, characterLimit)}...`
          : children}

        {showButton && (
          <span
            className="text-default-600 ml-2 font-medium hover:cursor-pointer hover:underline focus:outline-none"
            onClick={expand}
          >
            {isExpanded ? "ver menos" : "ver más"}
          </span>
        )}
      </div>
    </div>
  );
}
