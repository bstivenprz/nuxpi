"use client";

import React from "react";

import { ChipRadio } from "@/components/chip-radio";
import { Header } from "@/components/header";
import { MessageTextarea } from "@/components/message-textarea/message-textarea";
import { RadioAvatarGroup } from "@/components/radio-avatar-group";
import { numberFormat } from "@/utils/number-format";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { RadioGroup } from "@heroui/radio";

import { SearchAccountsInput } from "./search-accounts-input";
import { SelectedAccountsAlert } from "./selected-accounts-alert";

export default function MassMessage() {
  const [radioValue, setRadioValue] = React.useState<string>("personalized");
  const [selected, setSelected] = React.useState<{
    count: number;
    avatars: string[];
  }>();

  // const { data: massCounter } = useMassCounterQuery();
  const massCounter = [];

  function handleChipRadioChange(value: string) {
    if (value === "personalized") {
      setSelected(undefined);
      setRadioValue(value);
      return;
    }

    // setSelected(massCounter?.find((item) => item.key === value));
    setRadioValue(value);
  }

  function resetSelectedUsers() {
    setSelected(undefined);
    setRadioValue("personalized");
  }

  function handleSendMessage() {}

  return (
    <>
      <Header>Enviar mensaje</Header>

      <SelectedAccountsAlert
        count={selected?.count}
        startContent={<RadioAvatarGroup items={selected?.avatars} />}
        onRemoveAll={resetSelectedUsers}
      />

      <Accordion
        itemClasses={{
          title: "uppercase text-tiny font-bold",
        }}
        selectionMode="multiple"
        defaultExpandedKeys={["0", "2"]}
        showDivider={false}
      >
        <AccordionItem
          key="0"
          aria-label="Enviar a"
          title="Enviar a"
          subtitle="Haz una selección de los usuarios a los que deseas enviar el mensaje."
        >
          {massCounter && (
            <RadioGroup
              orientation="horizontal"
              value={radioValue}
              defaultValue="personalized"
              onValueChange={handleChipRadioChange}
            >
              {massCounter.map((item) => (
                <ChipRadio
                  endContent={<RadioAvatarGroup items={item.avatars} />}
                  value={item.key}
                  key={item.key}
                >
                  {item.name} {numberFormat(item.count)}
                </ChipRadio>
              ))}
              <ChipRadio value="personalized">Personalizado...</ChipRadio>
            </RadioGroup>
          )}

          {radioValue === "personalized" && <SearchAccountsInput />}
        </AccordionItem>
        <AccordionItem
          key="1"
          aria-label="Excluir a"
          title="Excluir a"
          subtitle="Haz una selección de los usuarios a los que deseas excluir del mensaje."
        >
          <SearchAccountsInput />
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Mensaje"
          title="Mensaje"
          subtitle="Crea el mensaje que deseas enviar."
        >
          <MessageTextarea onSend={handleSendMessage} />
        </AccordionItem>
      </Accordion>
    </>
  );
}
