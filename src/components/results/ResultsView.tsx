"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeResult } from "@/lib/shareLink";
import { PersonalityCard } from "./PersonalityCard";
import { TraitChart } from "./TraitChart";
import { SelfReportCheck } from "./SelfReportCheck";

// Reads the result straight from the link, so a shared link shows the same page to anyone.
export function ResultsView() {
  const searchParams = useSearchParams();
  const result = useMemo(() => decodeResult(new URLSearchParams(searchParams.toString())), [searchParams]);

  if (!result) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">This result link doesn&apos;t work</h1>
        <p className="max-w-md opacity-60">It may be incomplete or have been changed. Take the quiz to get your own.</p>
        <Link href="/feed" className="mt-2 rounded-full bg-white px-6 py-3 font-semibold text-black">
          Take the quiz
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_1.1fr]">
      <PersonalityCard result={result} />
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold">Your four letters</h2>
          <p className="mt-1 text-sm opacity-60">
            Based on {result.total} reels ({result.liked} liked). The shaded band is the likely range; narrower means
            we&apos;re more sure.
          </p>
        </div>
        <TraitChart result={result} />
        <SelfReportCheck ourCode={result.type.code} />
        <p className="text-xs opacity-40">Just for fun. Not a psychological or clinical assessment.</p>
      </section>
    </main>
  );
}
