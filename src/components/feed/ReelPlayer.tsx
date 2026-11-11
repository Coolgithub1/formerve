"use client";

import { useEffect, useRef } from "react";
import type { Clip } from "@/lib/types";
import { assetUrl } from "@/lib/assetUrl";

interface Props {
  clip: Clip;
  muted: boolean;
}

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
export function ReelPlayer({ clip, muted }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
          className="h-full w-full object-cover"
          loop
          playsInline
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
