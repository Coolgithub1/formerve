"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import type { Clip } from "@/lib/types";
import { assetUrl } from "@/lib/assetUrl";

/** Seconds of the clip actually watched (loops included, hidden-tab time excluded) and its length. */
export interface WatchStats {
  watchedSec: number;
  durationSec: number;
}

interface Props {
  clip: Clip;
  muted: boolean;
  /** Filled in while the clip plays; reset when a new clip mounts. */
  watchRef?: MutableRefObject<WatchStats>;
}

/** timeupdate fires about every 250ms; a bigger jump is a seek or a stall, not watching. */
const MAX_TICK_SEC = 1.5;

const PLACEHOLDER_GRADIENTS = [
  "from-indigo-600 to-fuchsia-700",
  "from-emerald-500 to-cyan-700",
  "from-orange-500 to-rose-700",
  "from-sky-500 to-indigo-800",
  "from-amber-400 to-orange-700",
  "from-pink-500 to-violet-800",
];

function gradientFor(id: string): string {
  const hash = [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
}

// Fills its 9:16 container and loops until the user decides.
// Placeholder clips (src === null) render as a colored card.
export function ReelPlayer({ clip, muted, watchRef }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (watchRef) watchRef.current = { watchedSec: 0, durationSec: 0 };
    lastTimeRef.current = 0;
  }, [clip.id, watchRef]);

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !watchRef) return;
    const now = video.currentTime;
    // When the clip loops, currentTime jumps back to ~0; count from the start of the new play.
    const tick = now >= lastTimeRef.current ? now - lastTimeRef.current : now;
    lastTimeRef.current = now;
    if (tick <= MAX_TICK_SEC && document.visibilityState === "visible") watchRef.current.watchedSec += tick;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    // Unmuted autoplay can be blocked by the browser; fall back to muted.
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [clip.id, muted]);

  return (
    <div className="relative h-full w-full">
      {clip.src ? (
        <video
          ref={videoRef}
          src={assetUrl(clip.src)}
          poster={clip.poster && assetUrl(clip.poster)}
          className={`h-full w-full bg-black ${clip.fit === "contain" ? "object-contain" : "object-cover"}`}
          loop
          playsInline
          onLoadedMetadata={(e) => {
            if (watchRef) watchRef.current.durationSec = e.currentTarget.duration || 0;
          }}
          onTimeUpdate={onTimeUpdate}
          muted={muted}
        />
      ) : (
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b p-8 text-center ${gradientFor(clip.id)}`}
        >
          <span className="text-xs uppercase tracking-widest opacity-60">Placeholder reel</span>
          <span className="text-3xl font-semibold">{clip.title}</span>
          <span className="text-sm opacity-70">{clip.tags.map((t) => `#${t}`).join(" ")}</span>
        </div>
      )}
    </div>
  );
}
