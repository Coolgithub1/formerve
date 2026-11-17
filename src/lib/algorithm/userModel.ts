import { TRAITS, type Clip, type Reaction, type UserModel } from "@/lib/types";
import { dot, fillVector } from "./traits";

/** Uncertainty per trait before any reactions. */
const PRIOR_VARIANCE = 0.3;

/** How sharply a trait match turns into a like. Tuned with `npm run simulate`. */
export const LIKE_SCALE = 2.5;

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export function emptyUserModel(): UserModel {
  return {
    mean: fillVector(0),
    variance: fillVector(PRIOR_VARIANCE),
    bias: 0,
    biasVariance: PRIOR_VARIANCE,
    genderMean: 0,
    genderVariance: PRIOR_VARIANCE,
    seenClipIds: new Set(),
  };
}

/** Predicted chance this user likes the clip, given the current estimate. */
export function likeProbability(clip: Clip, model: UserModel): number {
  return sigmoid(LIKE_SCALE * (dot(clip.traits, model.mean) + (clip.gender ?? 0) * model.genderMean + model.bias));
}

/** Decisions this fast (timed from when the reel appears) are snap gut reactions. */
const SNAP_MS = 1500;
/** By this point the snap bonus has faded out. */
const SNAP_FADE_MS = 3000;
/** Watching past this many plays adds nothing more (the clip loops; people walk away). */
const MAX_PLAYS = 2;

/**
 * How much one reaction counts, from when it happened. See data/TAGGING.md section 6.
 *
 * - Snap decisions (under 1.5s) count 1.2 either way: fast choices reveal strong preferences.
 * - Likes are U-shaped: weakest (1.0) when liked partway through the first play, rising to 1.3
 *   after one full play and 1.5 after two (finishing and rewatching signal enjoyment), then flat.
 * - Dislikes fall with watch time: 1.2 when instant, down to 0.6 after a full play (watching all
 *   of it and then disliking is a mixed signal), then flat.
 * - Without watch data (no video), only the snap bonus applies.
 */
export function reactionWeight({
  decision,
  reactionMs,
  watchFraction,
}: Pick<Reaction, "decision" | "reactionMs" | "watchFraction">): number {
  const snap = 0.2 * clamp((SNAP_FADE_MS - reactionMs) / (SNAP_FADE_MS - SNAP_MS), 0, 1);
  if (watchFraction === undefined) return 1 + snap;
  if (decision === "like") {
    const finished = 0.3 * clamp((watchFraction - 0.5) / 0.5, 0, 1);
    const rewatched = 0.2 * clamp(watchFraction - 1, 0, MAX_PLAYS - 1);
    return 1 + Math.max(snap, finished + rewatched);
  }
  return 1 + snap - 0.4 * clamp(watchFraction, 0, 1);
}

/**
 * Applies one reaction (returns a new model).
 *
 * The model is a Bayesian logistic regression:
 *   P(like) = sigmoid(LIKE_SCALE * (clip . traits + clip.gender * genderMean + bias)),
 * with an independent Gaussian belief per trait. Each reaction is one Newton step:
 * - variance shrinks on the traits this clip loads on (more so when the outcome was uncertain)
 * - mean moves by (surprise x loading x variance), so surprising reactions on uncertain
 *   traits move the estimate most, and expected ones barely move it.
 * Each reaction is scaled by reactionWeight (snap decisions and watch time).
 * Gender is a fifth term in the same regression, so a like on a girl-leaning cleaning clip
 * is shared between "girl" and "J" instead of all being read as J.
 */
export function applyReaction(model: UserModel, clip: Clip, reaction: Reaction): UserModel {
  const liked = reaction.decision === "like" ? 1 : 0;
  const weight = reactionWeight(reaction);
  const p = likeProbability(clip, model);
  const surprise = liked - p;
  const curvature = weight * p * (1 - p) * LIKE_SCALE ** 2;

  const mean = { ...model.mean };
  const variance = { ...model.variance };
  for (const t of TRAITS) {
    const x = clip.traits[t];
    variance[t] = 1 / (1 / model.variance[t] + curvature * x * x);
    mean[t] = clamp(model.mean[t] + weight * variance[t] * LIKE_SCALE * surprise * x, -1, 1);
  }
  const g = clip.gender ?? 0;
  const genderVariance = 1 / (1 / model.genderVariance + curvature * g * g);
  const genderMean = clamp(model.genderMean + weight * genderVariance * LIKE_SCALE * surprise * g, -1, 1);
  const biasVariance = 1 / (1 / model.biasVariance + curvature);
  const bias = clamp(model.bias + weight * biasVariance * LIKE_SCALE * surprise, -1, 1);

  return {
    mean,
    variance,
    bias,
    biasVariance,
    genderMean,
    genderVariance,
    seenClipIds: new Set(model.seenClipIds).add(clip.id),
  };
}

/** Rebuilds the model from a session's stored reactions, in position order. */
export function buildUserModel(reactions: Reaction[], clipsById: Map<string, Clip>): UserModel {
  return [...reactions]
    .sort((a, b) => a.position - b.position)
    .reduce((model, r) => {
      const clip = clipsById.get(r.clipId);
      return clip ? applyReaction(model, clip, r) : model;
    }, emptyUserModel());
}
