// Tunable session + algorithm constants. See PLAN.md for the reasoning.

import clips from "../../data/clips.json";

/** 40 reels, or every clip when the catalog is smaller than that. */
export const REELS_PER_SESSION = Math.min(40, clips.length);

/** Share of picks that probe uncertain traits (the rest match current likes). */
export const PROBE_RATIO = 0.7;

/** How many upcoming clips the player preloads. */
export const PRELOAD_COUNT = 2;
