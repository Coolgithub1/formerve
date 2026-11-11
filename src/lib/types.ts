/**
 * The four letter axes, in type-code order. Each value is in [-1, 1]:
 * negative = the first letter of the pair (I, S, T, J), positive = the second (E, N, F, P).
 */
export const TRAITS = ["extraversion", "intuition", "feeling", "perceiving"] as const;

export type Trait = (typeof TRAITS)[number];

/** One value per axis, each in [-1, 1]. */
export type TraitVector = Record<Trait, number>;

export interface Clip {
  id: string;
  /** Path under /public or a CDN URL. null = placeholder (rendered as a colored card). */
  src: string | null;
  poster?: string;
  title: string;
  tags: string[];
  /** How strongly liking this clip signals each axis. */
  traits: TraitVector;
}

export type Decision = "like" | "dislike";

export interface Reaction {
  clipId: string;
  decision: Decision;
  /** Time from the reel appearing to the decision. */
  reactionMs: number;
  /** 0-based index within the session. */
  position: number;
}

export interface UserModel {
  mean: TraitVector;
  /** Uncertainty per axis; high = we know little. */
  variance: TraitVector;
  /** General tendency to like things, so "likes everything" users don't skew their axes. */
  bias: number;
  biasVariance: number;
  seenClipIds: Set<string>;
}

export interface PersonalityType {
  /** Four-letter code, e.g. "INFP". */
  code: string;
  name: string;
  description: string;
  /** Gradient used on the results page. */
  colors: [string, string];
}

export interface AxisEstimate {
  /** 0–100 per axis: 0 = fully the first letter (I/S/T/J), 100 = fully the second (E/N/F/P). */
  scores: Record<Trait, number>;
  /** Likely range per axis (0–100), from how unsure the model still is. */
  ranges: Record<Trait, [number, number]>;
}

export interface PersonalityResult extends AxisEstimate {
  type: PersonalityType;
  liked: number;
  total: number;
}
