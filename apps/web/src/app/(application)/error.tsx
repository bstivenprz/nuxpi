'use client'

import { ErrorComponent } from "@/components/error-component";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorComponent onReset={reset} />
}