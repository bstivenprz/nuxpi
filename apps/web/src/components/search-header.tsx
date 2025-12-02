"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import React from "react";

import {
  Autocomplete,
  AutocompleteItem,
  MenuTriggerAction,
} from "@heroui/react";
import { useFilter } from "@react-aria/i18n";

import { Header, HeaderProps } from "./header";

const suggestions = [
  {
    label: "Mujeres",
    key: "womans",
  },
];

export type Suggestion = {
  label: string;
  key: string;
};

export type FieldState = {
  selectedKey: React.Key | null;
  inputValue: string;
  items: Suggestion[];
};

export function SearchHeader(props: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [fieldState, setFieldState] = React.useState<FieldState>({
    selectedKey: "",
    inputValue: "",
    items: suggestions,
  });

  const { startsWith } = useFilter({ sensitivity: "base" });

  React.useEffect(() => {
    if (query) {
      setFieldState(() => ({
        inputValue: query,
        selectedKey: null,
        items: suggestions,
      }));
    }
  }, [query]);

  function onSubmit(): void {
    router.push(`/search?q=${encodeURIComponent(fieldState.inputValue)}`);
  }

  function onSelectionChange(key: React.Key | null): void {
    setFieldState((prevState) => {
      const selectedItem = prevState.items.find((option) => option.key === key);

      return {
        inputValue: selectedItem?.label || "",
        selectedKey: key,
        items: suggestions.filter((item) =>
          startsWith(item.label, selectedItem?.label || "")
        ),
      };
    });
  }

  function onInputChange(value: string): void {
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === "" ? null : prevState.selectedKey,
      items: suggestions.filter((item) => startsWith(item.label, value)),
    }));
  }

  function onOpenChange(isOpen: boolean, menuTrigger: MenuTriggerAction): void {
    if (menuTrigger === "manual" && isOpen) {
      setFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: suggestions,
      }));
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <Header {...props} placement="center" hideBackButton>
      <div className="flex flex-col items-center">
        <Autocomplete
          listboxProps={{
            emptyContent: "No hay búsquedas recientes.",
            variant: "light",
          }}
          selectorButtonProps={{
            className: "hidden",
          }}
          variant="bordered"
          aria-label="Search"
          inputValue={fieldState.inputValue}
          items={fieldState.items}
          placeholder="Buscar"
          selectedKey={fieldState.selectedKey as string}
          startContent={<SearchIcon />}
          onInputChange={onInputChange}
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyDown}
          onOpenChange={onOpenChange}
          onSelectionChange={onSelectionChange}
        >
          {(item) => {
            const { key, label } = item as Suggestion;
            return (
              <AutocompleteItem key={key} startContent={<SearchIcon />}>
                {label}
              </AutocompleteItem>
            );
          }}
        </Autocomplete>
      </div>
    </Header>
  );
}
