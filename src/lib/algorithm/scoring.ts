import { TRAITS, type AxisEstimate, type PersonalityResult, type Reaction, type Trait, type UserModel } from "@/lib/types";
import { codeFromScores, typeByCode } from "./personalityTypes";

/** Maps a mean in [-1, 1] to a 0–100 display score. */
export function toDisplayScore(mean: number): number {
  return Math.round(((Math.max(-1, Math.min(1, mean)) + 1) / 2) * 100);
}

/** True when the likely range spans both letters, i.e. this letter could flip on a retake. */
export function isBorderline([low, high]: [number, number]): boolean {
  return low < 50 && high > 50;
}

/** Current per-axis scores and likely ranges; used live during the feed and in the final result. */
export function estimateAxes(model: UserModel): AxisEstimate {
  const scores = {} as Record<Trait, number>;
  const ranges = {} as Record<Trait, [number, number]>;
  for (const t of TRAITS) {
    const sd = Math.sqrt(model.variance[t]);
    scores[t] = toDisplayScore(model.mean[t]);
    ranges[t] = [toDisplayScore(model.mean[t] - sd), toDisplayScore(model.mean[t] + sd)];
  }
  return { scores, ranges };
}

export function scorePersonality(model: UserModel, reactions: Reaction[]): PersonalityResult {
  const estimate = estimateAxes(model);
  return {
    ...estimate,
    type: typeByCode(codeFromScores(estimate.scores))!,
    liked: reactions.filter((r) => r.decision === "like").length,
    total: reactions.length,
  };
}
