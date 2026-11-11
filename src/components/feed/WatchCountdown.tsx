"use client";

import { WATCH_LOCK_MS } from "@/lib/config";

// Bar across the top of the reel that fills over WATCH_LOCK_MS so users know when they can decide.
export function WatchCountdown({ running }: { running: boolean }) {
  return (
    <div className="absolute inset-x-0 top-0 h-1 bg-white/15">
      <div
        className="watch-countdown-fill h-full bg-white"
        style={{
          animationDuration: `${WATCH_LOCK_MS}ms`,
          animationPlayState: running ? "running" : "paused",
        }}
      />
    </div>
  );
}
