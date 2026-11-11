// Tunable session + algorithm constants. See PLAN.md for the reasoning.

export const REELS_PER_SESSION = 40;

/** Share of picks that probe uncertain traits (the rest match current likes). */
export const PROBE_RATIO = 0.7;

/** How many upcoming clips the player preloads. */
export const PRELOAD_COUNT = 2;
