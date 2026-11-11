"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AxisEstimate, Clip, Decision } from "@/lib/types";
import { REELS_PER_SESSION } from "@/lib/config";
import { feedSource } from "@/lib/feed";
import { resultsUrl } from "@/lib/shareLink";

/**
 * Drives the feed:
 *   loading -> watching (3s lock) -> deciding -> submitting -> watching (next) ... -> done
 */
export type FeedPhase = "loading" | "watching" | "deciding" | "submitting" | "done" | "error";

/** Minimum time the exit animation gets before the next reel slides in. */
const EXIT_ANIMATION_MS = 280;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** What the live panel shows: the current estimate, the one before it, and the reaction that caused the change. */
export interface LiveEstimate {
  estimate: AxisEstimate;
  previous: AxisEstimate | null;
  lastReaction: { title: string; decision: Decision } | null;
}

export function useFeedSession() {
  const router = useRouter();
  const [phase, setPhaseState] = useState<FeedPhase>("loading");
  const [clip, setClip] = useState<Clip | null>(null);
  const [upcoming, setUpcoming] = useState<Clip[]>([]);
  const [position, setPosition] = useState(0);
  const [lastDecision, setLastDecision] = useState<Decision | null>(null);
  const [live, setLive] = useState<LiveEstimate | null>(null);

  // Refs mirror state for handlers that must not act on stale values (key spam, double submits).
  const phaseRef = useRef<FeedPhase>("loading");
  const sessionIdRef = useRef<string | null>(null);
  const unlockedAtRef = useRef(0);
  const startedRef = useRef(false);
  const pendingReactionRef = useRef<LiveEstimate["lastReaction"]>(null);

  const setPhase = useCallback((next: FeedPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const loadNext = useCallback(async () => {
    const sessionId = sessionIdRef.current!;
    const result = await feedSource.nextClip(sessionId);
    if (result.done) {
      setPhase("done");
      const final = await feedSource.getResult(sessionId);
      router.push(final ? resultsUrl(final) : "/");
      return;
    }
    const lastReaction = pendingReactionRef.current;
    pendingReactionRef.current = null;
    setLive((prev) => ({ estimate: result.estimate, previous: prev?.estimate ?? null, lastReaction }));
    setClip(result.clip);
    setUpcoming(result.upcoming);
    setPosition(result.position);
    setLastDecision(null);
    setPhase("watching");
  }, [router, setPhase]);

  const start = useCallback(async () => {
    setPhase("loading");
    setLive(null);
    try {
      sessionIdRef.current = await feedSource.startSession();
      await loadNext();
    } catch (err) {
      console.error(err);
      setPhase("error");
    }
  }, [loadNext, setPhase]);

  useEffect(() => {
    // Guard against React StrictMode running effects twice in dev.
    if (startedRef.current) return;
    startedRef.current = true;
    start();
  }, [start]);

  const unlock = useCallback(() => {
    if (phaseRef.current !== "watching") return;
    unlockedAtRef.current = performance.now();
    setPhase("deciding");
  }, [setPhase]);

  const decide = useCallback(
    async (decision: Decision) => {
      if (phaseRef.current !== "deciding" || !clip) return;
      setPhase("submitting");
      setLastDecision(decision);
      pendingReactionRef.current = { title: clip.title, decision };
      const reaction = {
        clipId: clip.id,
        decision,
        reactionMs: Math.round(performance.now() - unlockedAtRef.current),
        position,
      };
      try {
        await Promise.all([feedSource.sendReaction(sessionIdRef.current!, reaction), delay(EXIT_ANIMATION_MS)]);
        await loadNext();
      } catch (err) {
        console.error(err);
        setPhase("error");
      }
    },
    [clip, position, loadNext, setPhase],
  );

  return {
    phase,
    clip,
    upcoming,
    position,
    total: REELS_PER_SESSION,
    lastDecision,
    live,
    unlock,
    decide,
    retry: start,
  };
}
