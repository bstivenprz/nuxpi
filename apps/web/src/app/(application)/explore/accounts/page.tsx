import { AccountBox } from "@/components/account-box";
import { Heading } from "@/components/heading";
import { Button } from "@heroui/button";

import { ToFollowSwiper } from "./to-follow-swiper";

export default function Accounts() {
  return (
    <div className="space-y-4">
      <div>
        <Heading level="caption">Creadores para ti</Heading>
        <ToFollowSwiper />
      </div>

      <div>
        <Heading level="caption">Sugerencias para ti</Heading>
        <div className="flex flex-col gap-2 divide-y divide-divider">
          <AccountBox username="example" name="John Deo" />
          <AccountBox username="example" name="John Deo" />
          <AccountBox username="example" name="John Deo" />
          <AccountBox username="example" name="John Deo" />
          <AccountBox username="example" name="John Deo" />
          <AccountBox username="example" name="John Deo" />
          <AccountBox username="example" name="John Deo" />
          <AccountBox username="example" name="John Deo" />
          <Button className="font-medium" variant="light" size="sm">
            Ver más
          </Button>
        </div>
      </div>
    </div>
  );
}
