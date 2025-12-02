import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@heroui/button";

export function Favorites() {
  return (
    <section>
      <EmptyState>
        Aún no hay contenido aquí.
        <Button href="/explore" variant="bordered">
          Explorar
        </Button>
      </EmptyState>

      <Divider>
        <Button className="font-medium" variant="light" size="sm">
          Mostrar más
        </Button>
      </Divider>
    </section>
  );
}
