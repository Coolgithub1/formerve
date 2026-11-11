"use client";

import type { Decision } from "@/lib/types";

interface Props {
  decision: Decision;
  enabled: boolean;
  /** Briefly highlights the button after it was chosen (by click or key). */
  chosen: boolean;
  onDecide: (decision: Decision) => void;
}

const VARIANTS: Record<Decision, { label: string; key: string; icon: string; color: string }> = {
  dislike: { label: "Dislike", key: "←", icon: "✕", color: "hover:bg-rose-500/90 data-[chosen=true]:bg-rose-500" },
  like: { label: "Like", key: "→", icon: "♥", color: "hover:bg-emerald-500/90 data-[chosen=true]:bg-emerald-500" },
};

// Sits beside the reel (dislike on the left, like on the right, matching the arrow keys).
// Dimmed only while the next reel is loading.
export function DecisionButton({ decision, enabled, chosen, onDecide }: Props) {
  const v = VARIANTS[decision];
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        aria-label={v.label}
        disabled={!enabled}
        data-chosen={chosen}
        onClick={() => onDecide(decision)}
        className={`flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl transition-all duration-200 enabled:cursor-pointer enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-25 data-[chosen=true]:scale-110 data-[chosen=true]:opacity-100 ${v.color}`}
      >
        {v.icon}
      </button>
      <span className="text-sm opacity-60">
        {v.label} <kbd className="ml-1 rounded border border-white/20 px-1.5 py-0.5 text-xs">{v.key}</kbd>
      </span>
    </div>
  );
}
