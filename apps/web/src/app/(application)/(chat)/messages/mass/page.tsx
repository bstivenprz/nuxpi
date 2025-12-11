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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { ChannelObject } from "@/api/types/chat.types";

export default function MassMessage() {
  const [radioValue, setRadioValue] = React.useState<string>("personalized");
  const [selected, setSelected] = React.useState<{
    count: number;
    avatars: string[];
  }>();

  const { data: channels } = useQuery({
    queryKey: ["channels"],
    queryFn: () => api<ChannelObject[]>("/broadcast/channels"),
    select: response => response.data
  })

  function channelName(key: ChannelObject['key']) {
    switch (key) {
      case "followers":
        return "Seguidores"
      case "following":
        return "Seguidos"
      default:
        break;
    }
  }

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
          {channels && (
            <RadioGroup
              orientation="horizontal"
              value={radioValue}
              defaultValue="personalized"
              onValueChange={handleChipRadioChange}
            >
              {channels.map((channel) => (
                <ChipRadio
                  endContent={<RadioAvatarGroup items={channel.pictures} />}
                  value={channel.key}
                  key={channel.key}
                >
                  {channelName(channel.key)} {numberFormat(channel.count)}
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
