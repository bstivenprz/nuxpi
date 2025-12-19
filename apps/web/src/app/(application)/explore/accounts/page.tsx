import { Suspense } from "react";
import { DiscoverCreators } from "./discover-creators";
import { DiscoverProfiles } from "./discover-profiles";

export default function Accounts() {
  return (
    <Suspense>
      <div className="space-y-4">
        <DiscoverCreators />
        <DiscoverProfiles />
      </div>
    </Suspense>
  );
}
