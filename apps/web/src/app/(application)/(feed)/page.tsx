import { AccountSuggestions } from "@/components/account-suggestions";
import { CreateTrigger } from "@/components/create-trigger";

import { Announcements } from "./announcements";
import { FeedEmpty } from "./feed-empty";

export default function Feed() {
  return (
    <main className="flex flex-col gap-3">
      <CreateTrigger />
      <Announcements />
      <AccountSuggestions />
      <FeedEmpty />
    </main>
  );
}
