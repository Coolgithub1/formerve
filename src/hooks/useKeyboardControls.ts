"use client";

import { useEffect } from "react";
import type { Decision } from "@/lib/types";

const KEYMAP: Record<string, Decision> = {
  ArrowLeft: "dislike",
  a: "dislike",
  ArrowRight: "like",
  d: "like",
};

/** Arrow keys / A-D decide (only while `enabled`); M toggles sound at any time. */
export function useKeyboardControls({
  enabled,
  onDecide,
  onToggleMute,
}: {
  enabled: boolean;
  onDecide: (decision: Decision) => void;
  onToggleMute: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === "m") {
        onToggleMute();
        return;
      }
      const decision = KEYMAP[key];
      if (decision && enabled) {
        e.preventDefault();
        onDecide(decision);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, onDecide, onToggleMute]);
}
