import { Suspense } from "react";
import { ResultsView } from "@/components/results/ResultsView";

// Share page: /results/?t=INFP&s=...  The result is in the link itself (see lib/shareLink.ts).
// Suspense is required around useSearchParams in a statically exported page.
export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsView />
    </Suspense>
  );
}
