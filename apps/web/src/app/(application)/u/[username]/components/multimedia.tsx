import { ChipRadio } from "@/components/ui/chip-radio";
import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/empty-state";
import { ViewToggle } from "@/components/view-toggle";
import { Button } from "@heroui/button";
import { RadioGroup } from "@heroui/radio";

export function Multimedia() {
  return (
    <section>
      <div className="flex items-center">
        <RadioGroup
          classNames={{ base: "grow" }}
          orientation="horizontal"
          defaultValue="all"
        >
          <ChipRadio value="all">Todas 12</ChipRadio>
          <ChipRadio value="pics">Fotos 23</ChipRadio>
          <ChipRadio value="vids">Videos 2</ChipRadio>
        </RadioGroup>
        <ViewToggle />
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
