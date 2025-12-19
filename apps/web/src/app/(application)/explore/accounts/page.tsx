import { EmptyState } from "@/components/empty-state";
import { DiscoverCreators } from "./discover-creators";
import { DiscoverProfiles } from "./discover-profiles";

export default function Accounts() {
  return (
    <div className="space-y-4">
      {(
        <>
          <DiscoverCreators />
          <DiscoverProfiles />
        </>
      ) || <EmptyState>No hay creadores o perfiles para ti.</EmptyState>}
    </div>
  );
}
