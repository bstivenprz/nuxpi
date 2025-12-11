"use client";

import { SearchIcon } from "lucide-react";

import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  FreeSoloPopover,
  Input,
  Listbox,
  ListboxItem,
  Popover,
  User,
} from "@heroui/react";
import { api } from "@/api/axios";
import { PublicProfileObject } from "@/api/types/public-profile.object";
import { useAsyncList } from "@react-stately/data";
import { AnimatePresence } from "framer-motion";
import { useDebounceInput } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AccountCheckbox } from "@/components/account-checkbox";

export function SearchAccountsInput() {
  const { debouncedValue, value, onChange } = useDebounceInput();

  const { data } = useQuery({
    queryKey: ["profile-search"],
    queryFn: () =>
      api<PublicProfileObject[]>("/inbox/contacts/search", { params: { q: debouncedValue } }),
    select: (response) => response.data,
    enabled: debouncedValue.length > 0,
  });

  return (
    <div>
      <Input
        placeholder="Buscar usuarios"
        startContent={<SearchIcon size={16} />}
        variant="bordered"
        value={value}
        onChange={onChange}
        isClearable
      />

      {!!data && (
        <AnimatePresence>
          <Listbox>
            {data.map((profile) => (
              <ListboxItem key={`list-box-item-${profile.username}`}>
                <User
                  classNames={{
                    name: "tablet:max-w-[260px] line-clamp-1 leading-tight font-semibold text-ellipsis",
                  }}
                  avatarProps={{
                    size: "sm",
                    src: profile.picture
                  }}
                  description={profile.username}
                  name={profile.name}
                />
              </ListboxItem>

            ))}
          </Listbox>
        </AnimatePresence>
      )}
    </div>
  );
}
