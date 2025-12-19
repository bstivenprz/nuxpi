"use client";

import { GalleryVertical, Grid } from "lucide-react";

import { Button, Tooltip } from "@heroui/react";

export function ViewToggle({
  view,
  onChangeView,
}: {
  view: "grid" | "list";
  onChangeView: () => void;
}) {
  if (view === "list")
    return (
      <Tooltip closeDelay={0} content="Vista de cuadrícula">
        <Button variant="light" onPress={onChangeView} isIconOnly>
          <Grid size={18} />
        </Button>
      </Tooltip>
    );

  return (
    <Tooltip closeDelay={0} content="Vista de lista">
      <Button variant="light" onPress={onChangeView} isIconOnly>
        <GalleryVertical size={18} />
      </Button>
    </Tooltip>
  );
}
