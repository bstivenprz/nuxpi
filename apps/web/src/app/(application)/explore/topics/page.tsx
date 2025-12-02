import { TrendingUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@heroui/button";

function TrendingTopic() {
  return (
    <Link
      className="flex items-center gap-3 px-3 py-4 hover:bg-default-50"
      href="/topic?name="
    >
      <TrendingUp className="text-default-300" />
      <div>
        <div className="font-semibold">#trending</div>
        <div className="text-tiny text-default-600">32.3k publicaciones</div>
      </div>
    </Link>
  );
}

export default function Topics() {
  return (
    <div className="flex flex-col divide-y divide-divider">
      {Array.from({ length: 10 }).map((_, key) => (
        <TrendingTopic key={`trending_topic_${key}`} />
      ))}
      <Button className="font-medium" variant="light" size="sm">
        Ver más
      </Button>
    </div>
  );
}
