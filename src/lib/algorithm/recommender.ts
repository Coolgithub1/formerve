import { TRAITS, type Clip, type UserModel } from "@/lib/types";
import { PROBE_RATIO } from "@/lib/config";
import { likeProbability } from "./userModel";

export type PickMode = "probe" | "engage";

/**
 * Expected information from showing this clip: how uncertain we are about the
 * traits it loads on, times how unsure we are whether they'll like it.
 */
export function probeScore(clip: Clip, model: UserModel): number {
  const p = likeProbability(clip, model);
  const uncertainty = TRAITS.reduce((sum, t) => sum + clip.traits[t] ** 2 * model.variance[t], model.biasVariance);
  return p * (1 - p) * uncertainty;
}

/** Predicted like-ness under the current estimate. */
export function engageScore(clip: Clip, model: UserModel): number {
  return likeProbability(clip, model);
}

/** Unseen clips, best first, for the given mode. */
export function rankClips(clips: Clip[], model: UserModel, mode: PickMode): Clip[] {
  const score = mode === "probe" ? probeScore : engageScore;
  return clips
    .filter((c) => !model.seenClipIds.has(c.id))
    .map((clip) => ({ clip, score: score(clip, model) }))
    .sort((a, b) => b.score - a.score)
    .map(({ clip }) => clip);
}

export interface PickOptions {
  probeRatio?: number;
  /** Sample uniformly from this many top-ranked clips so sessions don't all look identical. */
  topN?: number;
  random?: () => number;
}

/** Picks the next clip from those not yet seen, or null when none are left. */
export function pickNextClip(
  clips: Clip[],
  model: UserModel,
  { probeRatio = PROBE_RATIO, topN = 3, random = Math.random }: PickOptions = {},
): Clip | null {
  const mode: PickMode = random() < probeRatio ? "probe" : "engage";
  const ranked = rankClips(clips, model, mode);
  if (ranked.length === 0) return null;
  return ranked[Math.floor(random() * Math.min(topN, ranked.length))];
}
