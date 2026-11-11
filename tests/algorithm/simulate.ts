// Simulated users: the main way to check the algorithm actually works.
// Run with: npm run simulate
//
// Each fake user has a hidden personality. They watch a 40-reel session, liking clips
// with a probability that depends on how well the clip matches them (plus noise), and
// at the end we compare the algorithm's estimate with the hidden truth.
//
// Caveat: fake users follow a model close to the one the algorithm assumes, so these
// numbers are an upper bound. Real people are noisier; playtests are the real check.

import { TRAITS, type Clip, type Trait, type TraitVector } from "@/lib/types";
import { REELS_PER_SESSION } from "@/lib/config";
import { applyReaction, emptyUserModel } from "@/lib/algorithm/userModel";
import { pickNextClip } from "@/lib/algorithm/recommender";
import { typeCode } from "@/lib/algorithm/personalityTypes";
import { toDisplayScore } from "@/lib/algorithm/scoring";
import { dot } from "@/lib/algorithm/traits";
import placeholderClips from "../../data/clips.json";

const USERS = 400;
const SEED = 42;

// Fake users are deliberately a bit different from the algorithm's assumptions.
const TRUE_LIKE_SCALE = 2.5;
const LIKE_NOISE = 0.25;

// --- seeded randomness, so runs are comparable ---
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number): number {
  return Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
}

const clamp = (x: number) => Math.max(-1, Math.min(1, x));
const vector = (f: (t: Trait) => number) => Object.fromEntries(TRAITS.map((t) => [t, f(t)])) as TraitVector;

// --- fake data ---
function syntheticCatalog(size: number, random: () => number): Clip[] {
  return Array.from({ length: size }, (_, i) => {
    const pickTrait = () => TRAITS[Math.floor(random() * TRAITS.length)];
    const main = new Set([pickTrait(), pickTrait()]);
    const traits = vector((t) =>
      main.has(t) ? (random() < 0.5 ? -1 : 1) * (0.4 + 0.6 * random()) : (random() - 0.5) * 0.3,
    );
    return { id: `s${i}`, src: null, title: `Synthetic ${i}`, tags: [], traits };
  });
}

interface FakeUser {
  personality: TraitVector;
  bias: number;
}

function fakeUser(random: () => number): FakeUser {
  return { personality: vector(() => clamp(gaussian(random) * 0.5)), bias: gaussian(random) * 0.3 };
}

function fakeReact(user: FakeUser, clip: Clip, random: () => number) {
  const z = TRUE_LIKE_SCALE * (dot(clip.traits, user.personality) + user.bias) + gaussian(random) * LIKE_NOISE * 4;
  const p = 1 / (1 + Math.exp(-z));
  const liked = random() < p;
  // Confident users decide fast; torn users hesitate.
  const reactionMs = Math.max(150, 400 + 2500 * (1 - Math.abs(2 * p - 1)) + gaussian(random) * 300);
  return { decision: liked ? ("like" as const) : ("dislike" as const), reactionMs };
}

// --- one strategy over many users ---
type Strategy = { name: string; probeRatio: number | "random" };

function evaluate(catalog: Clip[], strategy: Strategy) {
  const random = mulberry32(SEED);
  let absErrorPoints = 0;
  let letterHits = 0;
  let typeHits = 0;
  let likes = 0;
  let shown = 0;
  const pairs: [number, number][] = [];

  for (let u = 0; u < USERS; u++) {
    const user = fakeUser(random);
    let model = emptyUserModel();

    for (let position = 0; position < REELS_PER_SESSION; position++) {
      const clip =
        strategy.probeRatio === "random"
          ? pickNextClip(catalog, model, { probeRatio: 1, topN: catalog.length, random })
          : pickNextClip(catalog, model, { probeRatio: strategy.probeRatio, random });
      if (!clip) break;
      const reaction = fakeReact(user, clip, random);
      shown++;
      if (reaction.decision === "like") likes++;
      model = applyReaction(model, clip, { clipId: clip.id, position, ...reaction });
    }

    for (const t of TRAITS) {
      absErrorPoints += Math.abs(toDisplayScore(model.mean[t]) - toDisplayScore(user.personality[t]));
      pairs.push([model.mean[t], user.personality[t]]);
    }
    const ours = typeCode(model.mean);
    const truth = typeCode(user.personality);
    letterHits += [...ours].filter((letter, i) => letter === truth[i]).length;
    if (ours === truth) typeHits++;
  }

  return {
    strategy: strategy.name,
    "avg error (0-100 pts)": +(absErrorPoints / (USERS * TRAITS.length)).toFixed(1),
    correlation: +correlation(pairs).toFixed(2),
    "letters right": `${Math.round((letterHits / (USERS * TRAITS.length)) * 100)}%`,
    "all 4 right": `${Math.round((typeHits / USERS) * 100)}%`,
    "like rate": `${Math.round((likes / shown) * 100)}%`,
  };
}

function correlation(pairs: [number, number][]): number {
  const n = pairs.length;
  const mx = pairs.reduce((s, [x]) => s + x, 0) / n;
  const my = pairs.reduce((s, [, y]) => s + y, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (const [x, y] of pairs) {
    sxy += (x - mx) * (y - my);
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}

const STRATEGIES: Strategy[] = [
  { name: "random clips", probeRatio: "random" },
  { name: "100% engage", probeRatio: 0 },
  { name: "70% probe (current)", probeRatio: 0.7 },
  { name: "100% probe", probeRatio: 1 },
];

const catalogs: [string, Clip[]][] = [
  ["Synthetic catalog (200 clips)", syntheticCatalog(200, mulberry32(SEED + 1))],
  [`Placeholder catalog (${placeholderClips.length} clips)`, placeholderClips as Clip[]],
];

console.log(`${USERS} simulated users, ${REELS_PER_SESSION} reels each\n`);
for (const [name, catalog] of catalogs) {
  console.log(name);
  console.table(STRATEGIES.map((s) => evaluate(catalog, s)));
}
