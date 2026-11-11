import type { Clip, Reaction } from "@/lib/types";
import { REELS_PER_SESSION, PRELOAD_COUNT } from "@/lib/config";
import { buildUserModel } from "@/lib/algorithm/userModel";
import { pickNextClip, rankClips } from "@/lib/algorithm/recommender";
import { estimateAxes, scorePersonality } from "@/lib/algorithm/scoring";
import clipsData from "../../../data/clips.json";
import type { FeedSource, NextClipResult } from "./source";

const clips = clipsData as Clip[];
const clipsById = new Map(clips.map((c) => [c.id, c]));

// Reactions only live in memory for the length of a session; nothing is stored.
// The finished result travels in the results link instead (see shareLink.ts).
const sessions = new Map<string, Reaction[]>();

function reactionsFor(sessionId: string): Reaction[] {
  const reactions = sessions.get(sessionId);
  if (!reactions) throw new Error(`Unknown session ${sessionId}`);
  return reactions;
}

/** Runs the whole quiz in the browser. Logs each pick to the console for debugging. */
export const localSource: FeedSource = {
  async startSession() {
    const id = Math.random().toString(36).slice(2, 10);
    sessions.set(id, []);
    return id;
  },

  async nextClip(sessionId): Promise<NextClipResult> {
    const reactions = reactionsFor(sessionId);
    const position = reactions.length;
    const model = buildUserModel(reactions, clipsById);
    const clip = position < REELS_PER_SESSION ? pickNextClip(clips, model) : null;
    if (!clip) return { done: true };

    console.debug(`[feed] reel ${position + 1}: ${clip.title}`, { mean: model.mean, bias: model.bias });
    const upcoming = rankClips(clips, model, "probe")
      .filter((c) => c.id !== clip.id)
      .slice(0, PRELOAD_COUNT);
    return { done: false, clip, position, upcoming, estimate: estimateAxes(model) };
  },

  async sendReaction(sessionId, reaction) {
    reactionsFor(sessionId).push(reaction);
  },

  async getResult(sessionId) {
    const reactions = sessions.get(sessionId);
    if (!reactions || reactions.length === 0) return null;
    return scorePersonality(buildUserModel(reactions, clipsById), reactions);
  },
};
