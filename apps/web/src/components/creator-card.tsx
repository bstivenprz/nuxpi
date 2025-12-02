import Image from "next/image";
import Link from "next/link";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

import { numberFormat } from "../utils/number-format";

type CreatorCardProps = {
  displayName: string;
  username: string;
  header?: string;
  picture?: string;
  followers: number;
};

export function CreatorCard({
  displayName = "{displayName}",
  username = "{username}",
  followers = 0,
  header,
  picture,
}: Readonly<Partial<CreatorCardProps>>) {
  return (
    <Link className="block w-full" target="_blank" href={`/u/username`}>
      <div className="relative w-full h-32 overflow-hidden bg-default-100">
        {header && (
          <Image
            className="object-cover object-center"
            src={header!}
            alt=""
            fill
          />
        )}
        {header && (
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        )}
        <div className="absolute inset-0 flex items-end m-2">
          <Avatar className="mobile:size-16 desktop:size-20" src={picture} />
        </div>
      </div>

      <div className="flex flex-col mobile:gap-2 desktop:gap-4 py-2">
        <div>
          <div className="line-clamp-1 text-small font-semibold">
            {displayName}
          </div>
          <div className="text-tiny text-default-600">{username}</div>
        </div>

        <div className="text-tiny text-default-600">{`${numberFormat(
          followers
        )} seguidores`}</div>

        <Button
          color="primary"
          size="sm"
          variant="bordered"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          fullWidth
        >
          Seguir
        </Button>
      </div>
    </Link>
  );
}
