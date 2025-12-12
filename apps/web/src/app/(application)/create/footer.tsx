"use client";

import { CircleDollarSignIcon, GlobeIcon } from "lucide-react";

import { useFormContext } from "react-hook-form";

import { Accordion, AccordionItem, Button, RadioGroup } from "@heroui/react";

import { Heading } from "@/components/heading";
import { CardRadio } from "@/components/card-radio";
import { Form } from "./schema";

export function Footer({ isPending }: { isPending: boolean }) {
  const {
    register,
    formState: { isDirty },
  } = useFormContext<Form>();

  // TODO: get multimedia mutation state to disable button when uploading
  

  return (
    <div>
      <Heading level="h4">Opciones de publicación</Heading>

      <Accordion
        itemClasses={{
          title: "text-large font-medium",
          trigger: "py-2",
        }}
        showDivider={false}
        selectionMode="multiple"
      >
        <AccordionItem
          key="0"
          aria-label="Audiencia"
          title="Audiencia"
          subtitle="Decide quién puede ver tu publicación."
        >
          <RadioGroup defaultValue="everyone" {...register("audience")}>
            <CardRadio
              value="everyone"
              startContent={<GlobeIcon />}
              title="Acceso público"
              description="Permite a todos acceder a esta publicación y descubrir tu contenido."
            />
            <CardRadio
              value="paid-only"
              startContent={<CircleDollarSignIcon />}
              title="Acceso exclusivo"
              description="Limita el acceso a miembros y personas que compren esta publicación."
            />
          </RadioGroup>
        </AccordionItem>
      </Accordion>

      <Button
        className="mt-6"
        type="submit"
        color="primary"
        size="lg"
        isDisabled={!isDirty}
        isLoading={isPending}
        fullWidth
      >
        Publicar
      </Button>
    </div>
  );
}
