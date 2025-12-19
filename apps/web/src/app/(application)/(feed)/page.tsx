import { AccountSuggestions } from "@/components/account-suggestions";
import { CreateTrigger } from "@/components/create-trigger";

import { Announcements } from "./announcements";
import { FeedContent } from "./feed-content";

export default function Feed() {
  return (
    <main className="flex flex-col gap-3">
      <CreateTrigger />
      <Announcements />
      <AccountSuggestions />
      <FeedContent />
    </main>
  );
}
