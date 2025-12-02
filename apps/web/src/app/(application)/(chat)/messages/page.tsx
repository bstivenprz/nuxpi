"use client";

import { MessagesSquareIcon, SearchIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";

import React from "react";

import { Header } from "@/components/header";
import { Alert, Button, Chip, Input, Tab, Tabs } from "@heroui/react";

import { Chats } from "./chats";

export default function Messages() {
  const [startSearch, setStartSearch] = React.useState(false);

  // React.useEffect(() => {
  //   websocket.connect();

  //   return () => {
  //     websocket.disconnect();
  //     websocket.close();
  //   };
  // }, []);

  return (
    <>
      <Header
        endContent={
          <div className="flex items-center gap-1">
            <Button
              variant="bordered"
              startContent={<MessagesSquareIcon size={18} />}
              as={Link}
              href="/messages/mass"
            >
              Mensaje masivo
            </Button>
            <Button
              variant="bordered"
              startContent={<SquarePenIcon size={18} />}
              onPress={() => open("new-message")}
            >
              Nuevo mensaje
            </Button>
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
        startContent={<SearchIcon size={16} />}
        isClearable
      />

      {startSearch ? (
        <div>Searhcn</div>
      ) : (
        // Hacer que los Tabs sean redireccionables a páginas con error handling usando error.js segun documentación [https://nextjs.org/docs/app/api-reference/file-conventions/error]
        <Tabs
          classNames={{
            tab: "font-semibold data-[hover-unselected=true]:opacity-hover relative",
            tabList: "gap-0",
          }}
          variant="underlined"
          fullWidth
        >
          <Tab key="chats" title="Todos">
            <Chats />
          </Tab>
          <Tab
            key="unreaded"
            title={
              <>
                No leídos
                <Chip className="ml-1" size="sm" color="primary">
                  3
                </Chip>
              </>
            }
          >
            <Chats filter="unreaded" />
          </Tab>
          <Tab
            key="featured"
            title={
              <>
                Destacados
                <Chip className="ml-1" size="sm" color="primary">
                  34
                </Chip>
              </>
            }
          >
            <Chats filter="featured" />
          </Tab>
        </Tabs>
      )}
    </>
  );
}
