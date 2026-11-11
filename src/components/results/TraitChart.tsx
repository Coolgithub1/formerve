"use client";

import { useEffect, useState } from "react";
import { TRAITS, type PersonalityResult } from "@/lib/types";
import { AXES, dominantPole } from "@/lib/algorithm/traits";
import { isBorderline } from "@/lib/algorithm/scoring";

// One scale per letter pair: letters at the ends, a shaded band for the likely range,
// and a marker that slides from the middle to the score. Borderline letters are flagged.
export function TraitChart({ result }: { result: PersonalityResult }) {
  const accent = result.type.colors[0];
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <ul className="flex flex-col gap-6">
      {TRAITS.map((trait, i) => {
        const axis = AXES[trait];
        const score = result.scores[trait];
        const [low, high] = result.ranges[trait];
        const pole = dominantPole(trait, score);
        return (
          <li key={trait}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="font-medium">
                {pole.label} <span className="tabular-nums opacity-60">{pole.percent}%</span>
              </span>
              {isBorderline(result.ranges[trait]) && (
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs opacity-70">
                  Borderline: could flip
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-5 text-center text-lg font-bold ${score <= 50 ? "" : "opacity-30"}`}>{axis.low.letter}</span>
              <div className="relative h-3 flex-1 rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 rounded-full bg-white/20"
                  style={{ left: `${low}%`, width: `${high - low}%` }}
                />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
                <div
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg transition-[left] duration-700 ease-out"
                  style={{ left: `${revealed ? score : 50}%`, background: accent, transitionDelay: `${i * 90}ms` }}
                />
              </div>
              <span className={`w-5 text-center text-lg font-bold ${score > 50 ? "" : "opacity-30"}`}>{axis.high.letter}</span>
            </div>
            <div className="mt-1.5 flex justify-between px-8 text-xs opacity-50">
              <span>{axis.low.label}</span>
              <span>{axis.high.label}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
