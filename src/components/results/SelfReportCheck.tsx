"use client";

import { useState } from "react";
import { TYPE_CODES } from "@/lib/algorithm/personalityTypes";

// "Already know your type?" A letter-by-letter comparison with our result.
// Nothing is stored; once there's a backend, saving these answers is how we'd measure accuracy.
export function SelfReportCheck({ ourCode }: { ourCode: string }) {
  const [choice, setChoice] = useState("");
  const [compared, setCompared] = useState<string | null>(null);

  if (compared) {
    const matches = [...compared].filter((letter, i) => letter === ourCode[i]).length;
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-medium">{matches === 4 ? "Perfect match!" : `We matched ${matches} of 4 letters.`}</p>
        <div className="mt-3 flex gap-2 font-mono text-2xl font-bold">
          {[...compared].map((letter, i) => (
            <span
              key={i}
              className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                letter === ourCode[i] ? "bg-emerald-500/80" : "bg-white/10 opacity-60"
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCompared(null)}
          className="mt-3 cursor-pointer text-xs opacity-50 hover:opacity-90"
        >
          Try another type
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="font-medium">Already know your type?</p>
      <p className="mt-1 text-sm opacity-60">See how close your reels got.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          aria-label="Your type"
          className="rounded-full border border-white/20 bg-neutral-900 px-4 py-2 font-mono"
        >
          <option value="">Pick…</option>
          {TYPE_CODES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!choice}
          onClick={() => setCompared(choice)}
          className="cursor-pointer rounded-full bg-white px-5 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-30"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
