"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { AccountCheckbox } from "@/components/account-checkbox";
import { EmptyState } from "@/components/empty-state";
import { useDebounceInput } from "@/hooks/use-debounce";
import { CheckboxGroup } from "@heroui/react";

export function SearchAccountsInput() {
  const {
    debouncedValue: searchInputDebouncedValue,
    value: searchInputValue,
    onChange: onChangeSearchInput,
    setValue: setSearchInputValue,
  } = useDebounceInput();

  // const { data: users } = useFindInboxQuery(searchInputDebouncedValue, {
  //   skip: searchInputDebouncedValue.length === 0,
  // });
  const users = [];

  return (
    <div className="my-3 flex flex-col gap-2">
      <Input
        placeholder="Buscar usuarios"
        fullWidth
        startContent={<SearchIcon size={16} />}
        value={searchInputValue}
        onChange={onChangeSearchInput}
        onClear={() => setSearchInputValue("")}
        isClearable
      />
      {users && users.length > 0 && (
        <CheckboxGroup
          classNames={{
            wrapper: "h-[250px] overflow-auto flex-nowrap gap-0",
          }}
          name="users"
        >
          {users?.map((user) => (
            <AccountCheckbox
              value={user.username}
              key={user.username}
              user={{
                id: user.id,
                name: user.display_name,
                description: user.username,
                avatarProps: { src: user.picture || undefined },
              }}
            />
          ))}
        </CheckboxGroup>
      )}

      {users && users.length === 0 && searchInputDebouncedValue.length > 0 && (
        <EmptyState>No se encontraron usuarios</EmptyState>
      )}
    </div>
  );
}
