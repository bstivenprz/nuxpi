"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";

import { useState } from "react";

import { Header } from "@/components/header";
import { Alert, Button, Input, Tab, Tabs } from "@heroui/react";

import { Chats } from "./chats";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { InboxCountersObject } from "@/api/types/chat.types";
import { SearchResults } from "./search-results";
import { useDebounceInput } from "@/hooks/use-debounce";
import { Contacts } from "./contacts";

export default function Messages() {
  const [startSearch, setStartSearch] = useState(false);

  const { debouncedValue, onChange, setValue } = useDebounceInput();

  const { data: counters } = useQuery({
    queryKey: ["inbox-counters"],
    queryFn: () => api<InboxCountersObject>("inbox/counters"),
    select: (response) => response.data,
  });

  function handleSearchInputOnChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.value.trim().length === 0) {
      setStartSearch(false);
    } else {
      setStartSearch(true)
      onChange(event);
    }
  }

  return (
    <>
      <Header
        endContent={
          <div className="flex items-center gap-1">
            <Button
              variant="bordered"
              as={Link}
              href="/messages/mass"
            >
              Mensaje masivo
            </Button>
            <Contacts>
              <Button variant="bordered">
                Nuevo mensaje
              </Button>
            </Contacts>
          </div>
        }
      >
        Mensajes
      </Header>

      <Alert
        color="success"
        title="Mensaje enviado a 150 personas hace 2 minutos."
        description="Enviado"
        isClosable
        endContent={<Button variant="light">Anular</Button>}
      />

      <Input
        className="mb-4 w-full"
        placeholder="Buscar en mensajes"
        variant="bordered"
        startContent={<SearchIcon size={16} />}
        onChange={handleSearchInputOnChange}
        onClear={() => {
          setStartSearch(false)
          setValue('')
        }}
        isClearable
      />

      {startSearch && <SearchResults query={debouncedValue} />}

      {!startSearch && (
        <Tabs
          classNames={{
            tab: "font-semibold data-[hover-unselected=true]:opacity-hover relative",
            tabList: "gap-0",
          }}
          variant="underlined"
          fullWidth
        >
          <Tab key="chats" title="Todos">
            <Chats filter="all" />
          </Tab>
          <Tab
            key="unread"
            title={
              <div>
                No leídos
                {counters && counters.unreaded_count > 0 && (
                  <span className="font-bold text-primary">
                    {counters.unreaded_count}
                  </span>
                )}
              </div>
            }
          >
            <Chats filter="unread" />
          </Tab>
          <Tab
            key="featured"
            title={
              <div>
                Destacados
                {counters && counters.featured_count > 0 && (
                  <span className="font-bold text-primary">
                    {counters.featured_count}
                  </span>
                )}
              </div>
            }
          >
            <Chats filter="featured" />
          </Tab>
        </Tabs>
      )}
    </>
  );
}
