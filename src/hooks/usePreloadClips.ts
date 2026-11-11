"use client";

import { useEffect } from "react";
import type { Clip } from "@/lib/types";
import { assetUrl } from "@/lib/assetUrl";

// Warms the browser cache for upcoming reels so the next one starts instantly.
// Clips are picked adaptively, so the feed source returns its most likely next
// clips as `upcoming`; those are what get preloaded.
export function usePreloadClips(upcoming: Clip[]) {
  useEffect(() => {
    const videos = upcoming
      .filter((clip) => clip.src)
      .map((clip) => {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.src = assetUrl(clip.src!);
        return video;
      });
    return () => videos.forEach((video) => video.removeAttribute("src"));
  }, [upcoming]);
}
