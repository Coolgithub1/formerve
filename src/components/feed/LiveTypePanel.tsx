"use client";

import { TRAITS, type Trait } from "@/lib/types";
import { AXES } from "@/lib/algorithm/traits";
import type { LiveEstimate } from "@/hooks/useFeedSession";

interface Props {
  live: LiveEstimate | null;
  /** Changes on every new reel, so the change tags replay their animation. */
  position: number;
  onHide: () => void;
}

/** Letter the axis moved toward and by how many points, e.g. { letter: "E", points: 8 }. */
function axisChange(live: LiveEstimate, trait: Trait) {
  if (!live.previous) return null;
  const delta = live.estimate.scores[trait] - live.previous.scores[trait];
  if (delta === 0) return null;
  return { letter: delta > 0 ? AXES[trait].high.letter : AXES[trait].low.letter, points: Math.abs(delta) };
}

// Sits beside the reel and updates after every like/dislike: the type so far,
// one bar per axis, and a tag showing which way the last reaction pushed each axis.
export function LiveTypePanel({ live, position, onHide }: Props) {
  // "?" until an axis has moved off the midpoint, so we don't claim letters we have no evidence for.
  const code = live
    ? TRAITS.map((t) => {
        const score = live.estimate.scores[t];
        return score === 50 ? "?" : score > 50 ? AXES[t].high.letter : AXES[t].low.letter;
      }).join("")
    : null;
  const started = Boolean(live?.previous);

  return (
    <aside className="w-72 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium tracking-widest uppercase opacity-60">Your type so far</h2>
        <button type="button" onClick={onHide} className="cursor-pointer text-xs opacity-50 hover:opacity-90">
          Hide
        </button>
      </div>

      <p className="mt-2 font-mono text-4xl font-bold tracking-[0.2em]">
        {started && code ? code : <span className="opacity-25">????</span>}
      </p>

      <ul className="mt-5 flex flex-col gap-4">
        {TRAITS.map((trait) => {
          const axis = AXES[trait];
          const score = live?.estimate.scores[trait] ?? 50;
          const change = live && axisChange(live, trait);
          return (
            <li key={trait}>
              <div className="mb-1.5 flex h-5 items-center justify-between text-xs">
                <span className="opacity-50">{axis.name}</span>
                {change && (
                  <span
                    key={`${trait}-${position}`}
                    className="live-change rounded-full bg-white/15 px-2 py-0.5 font-semibold tabular-nums"
                  >
                    {change.letter} +{change.points}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 text-center text-sm font-bold ${score < 50 ? "" : "opacity-30"}`}>
                  {axis.low.letter}
                </span>
                <div className="relative h-2 flex-1 rounded-full bg-white/10">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-white/25" />
                  <div
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-[left] duration-500 ease-out"
                    style={{ left: `${score}%` }}
                  />
                </div>
                <span className={`w-4 text-center text-sm font-bold ${score > 50 ? "" : "opacity-30"}`}>
                  {axis.high.letter}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 min-h-10 text-xs leading-relaxed opacity-60">
        {live?.lastReaction ? (
          <>
            {live.lastReaction.decision === "like" ? "Liked" : "Disliked"} &ldquo;{live.lastReaction.title}&rdquo;
          </>
        ) : (
          "Like or dislike reels to start building your type."
        )}
      </p>
    </aside>
  );
}
