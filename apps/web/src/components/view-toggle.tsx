"use client";

import { GalleryVertical, Grid } from "lucide-react";

import React from "react";

import { Button, Tooltip } from "@heroui/react";

export function ViewToggle() {
  const [view, setView] = React.useState<"grid" | "list">("grid");

  function handleToggle() {
    setView((prevView) => (prevView === "grid" ? "list" : "grid"));
  }

  if (view === "list")
    return (
      <Tooltip closeDelay={0} content="Vista de cuadrícula">
        <Button variant="light" onPress={handleToggle} isIconOnly>
          <Grid size={18} />
        </Button>
      </Tooltip>
    );

  return (
    <Tooltip closeDelay={0} content="Vista de lista">
      <Button variant="light" onPress={handleToggle} isIconOnly>
        <GalleryVertical size={18} />
      </Button>
    </Tooltip>
  );
}
