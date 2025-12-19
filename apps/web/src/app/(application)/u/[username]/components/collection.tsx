import { ChipRadio } from "@/components/ui/chip-radio";
import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/empty-state";
import { ViewToggle } from "@/components/view-toggle";
import { Button } from "@heroui/button";
import { RadioGroup } from "@heroui/radio";
import { useState } from "react";

export function Collection() {
  const [view, setView] = useState<"grid" | "list">("grid");

  function toggleView() {
    setView((prev) => (prev === "grid" ? "list" : "grid"));
  }

  return (
    <section>
      <div className="flex items-center">
        <RadioGroup
          classNames={{ base: "grow" }}
          orientation="horizontal"
          defaultValue="all"
        >
          <ChipRadio value="all">Todas 12</ChipRadio>
          <ChipRadio value="active">Activos 2</ChipRadio>
          <ChipRadio value="expired">Expirados 2</ChipRadio>
          <ChipRadio value="expiring">Próximo a expirar 2</ChipRadio>
        </RadioGroup>
        <ViewToggle view={view} onChangeView={toggleView} />
      </div>

      <div>
        <EmptyState>Aún no hay contenido aquí.</EmptyState>

        <Divider>
          <Button className="font-medium" variant="light" size="sm">
            Mostrar más
          </Button>
        </Divider>
      </div>
    </section>
  );
}
