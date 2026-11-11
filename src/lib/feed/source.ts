import type { AxisEstimate, Clip, PersonalityResult, Reaction } from "@/lib/types";

export type NextClipResult =
  | {
      done: false;
      clip: Clip;
      position: number;
      upcoming: Clip[];
      /** Estimate after all reactions so far; drives the live panel beside the feed. */
      estimate: AxisEstimate;
    }
  | { done: true };

/**
 * Where the feed gets its clips. Today the only implementation runs in the browser
 * (localSource); a server-backed one can be added later without touching the UI.
 */
export interface FeedSource {
  startSession(): Promise<string>;
  nextClip(sessionId: string): Promise<NextClipResult>;
  sendReaction(sessionId: string, reaction: Reaction): Promise<void>;
  /** null when the session doesn't exist or has no reactions. */
  getResult(sessionId: string): Promise<PersonalityResult | null>;
}
