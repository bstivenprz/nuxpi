'use client'

import { api } from "@/api/axios";
import { PublicProfileObject } from "@/api/types/public-profile.object";
import { AccountBox } from "@/components/account-box";
import { Heading } from "@/components/heading";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export function Contacts({ children }: PropsWithChildren) {
  const { data: contacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => api<PublicProfileObject[]>("/inbox/contacts"),
    select: (response) => response.data,
  });

  return (
    <Popover classNames={{
      content: 'w-[380px] h-[300px] py-3 items-start'
    }} placement="bottom-end">
      <PopoverTrigger>

        {children}
      </PopoverTrigger>
      <PopoverContent>
        <Heading className="px-2" level="h5">Nuevo mensaje</Heading>
        <div className="flex flex-col w-full overflow-auto">
          {contacts?.map((contact) => (
            <AccountBox
              key={`contact-user-${contact.username}`}
              name={contact.name}
              username={contact.username}
              picture={contact.picture}
              href={`/c/${contact.username}`}
              hideButton
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
