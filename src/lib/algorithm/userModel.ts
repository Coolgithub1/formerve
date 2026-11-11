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
    seenClipIds: new Set(),
  };
}

/** Predicted chance this user likes the clip, given the current estimate. */
export function likeProbability(clip: Clip, model: UserModel): number {
  return sigmoid(LIKE_SCALE * (dot(clip.traits, model.mean) + model.bias));
}

/** Decisions this fast (timed from when the reel appears) count as gut reactions. */
const GUT_REACTION_MS = 1500;

/** Confidence weight from reaction time: up to 1.5s = 1.2, 2.5s = 1.0, 5s+ = 0.5. */
export function reactionWeight(reactionMs: number): number {
  return clamp(1.2 - Math.max(0, reactionMs - GUT_REACTION_MS) / 5000, 0.5, 1.2);
}

/**
 * Applies one reaction (returns a new model).
 *
 * The model is a Bayesian logistic regression: P(like) = sigmoid(LIKE_SCALE * (clip . traits + bias)),
 * with an independent Gaussian belief per trait. Each reaction is one Newton step:
 * - variance shrinks on the traits this clip loads on (more so when the outcome was uncertain)
 * - mean moves by (surprise x loading x variance), so surprising reactions on uncertain
 *   traits move the estimate most, and expected ones barely move it.
 */
export function applyReaction(model: UserModel, clip: Clip, reaction: Reaction): UserModel {
  const liked = reaction.decision === "like" ? 1 : 0;
  const weight = reactionWeight(reaction.reactionMs);
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
  const biasVariance = 1 / (1 / model.biasVariance + curvature);
  const bias = clamp(model.bias + weight * biasVariance * LIKE_SCALE * surprise, -1, 1);

  return { mean, variance, bias, biasVariance, seenClipIds: new Set(model.seenClipIds).add(clip.id) };
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
