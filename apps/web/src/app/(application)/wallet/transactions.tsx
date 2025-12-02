"use client";

import { ArrowUpDownIcon, FilterIcon } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Heading } from "@/components/heading";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

export function Transactions() {
  return (
    <div className="my-6">
      <div className="flex items-center">
        <Heading className="grow" level="h4">
          Transacciones
        </Heading>
        <div className="flex items-center gap-1">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <ArrowUpDownIcon size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="light"
              disallowEmptySelection
              // selectedKeys={query.order ? [query.order] : []}
              // onSelectionChange={selectOrder}
              selectionMode="single"
            >
              <DropdownItem key="DESC">Recientes primero</DropdownItem>
              <DropdownItem key="ASC">Antiguos primero</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <FilterIcon size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="light"
              disallowEmptySelection
              // selectedKeys={query.type ? [query.type] : []}
              // onSelectionChange={selectFilter}
              selectionMode="single"
              items={[
                { key: "ALL", label: "Todos" },
                { key: "INCOME", label: "Ingreso" },
                { key: "WITHDRAWAL", label: "Retiro" },
                { key: "TRANSFER", label: "Transferencia" },
                { key: "REFUND", label: "Reembolso" },
                { key: "FEE", label: "Comisión" },
                { key: "REWARD", label: "Recompensa" },
                { key: "RECHARGE", label: "Recarga" },
              ]}
            >
              {(item) => (
                <DropdownItem key={item.key}>{item.label}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div>
        <EmptyState>Aún no tienes transacciones.</EmptyState>
      </div>
    </div>
  );
}
