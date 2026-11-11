# formerve — Plan

Scroll through short-form reels, like or dislike each one, and get a personality
read at the end, produced by our own algorithm.

## Decisions (locked in)

| Topic | Decision |
|---|---|
| Session length | **40 reels**, fixed. No timer. |
| Deciding | Like/dislike work **as soon as a reel appears** (the earlier 3-second lock was removed). Clip keeps looping until the user decides. |
| Personality model | **Four letter axes** (E/I, S/N, T/F, J/P) → a **4-letter type** with our own 16 names. Never call it "MBTI" or "Myers-Briggs" (trademarks), and don't reuse other tests' type names. |
| Live feedback | A panel beside the feed shows the type so far and moves the four bars after every reaction, with a tag like "E +8" on each axis that moved. Can be hidden. |
| Accuracy check | Results page asks "Already know your type?" and shows a letter-by-letter comparison. Not stored yet; saving these answers is the main reason to add a backend later. |
| Device | **Desktop-first** site, but content is **vertical 9:16 reels** in a centered phone-style player. |
| Controls | Buttons + keyboard (← / A = dislike, → / D = like). Swipe/scroll transition to the next reel. |
| Clips | **Placeholders for now**; real reels supplied later (drop into `public/clips/`, tag in `data/clips.json`). |
| Recommender goal | **Mostly measure**: ~70% of picks probe the traits we're least sure about, ~30% match what they like. |
| Storage | **None for now.** No accounts, no database, no API. Results are shared by encoding them in the link: `/results/?t=INFP&s=4-98-67-66&r=…&n=14-40`. |
| Stack | Next.js (App Router, static export) + TypeScript, Tailwind, Vitest. `npm run build` → `out/`, hostable anywhere for free. |

## How a session works

Everything runs in the browser (`src/lib/feed/localSource.ts`):

1. A session starts in memory.
2. The algorithm picks the next clip and sends the current estimate to the live panel.
3. Reel plays. The user can like or dislike right away.
4. The reaction `{ clipId, decision, reactionMs, position }` is added to the session.
5. After 40 reactions the result is computed and the browser goes to a results link that
   contains it (`src/lib/shareLink.ts`).

The user model is rebuilt from the session's reactions every time (40 items, cheap),
so the algorithm stays a set of pure functions that are easy to test and simulate.
The feed only talks to the `FeedSource` interface, so a server-backed version can be
added later without changing the UI.

## The algorithm (`src/lib/algorithm/`)

**Clip tagging.** Every clip has one number in `[-1, 1]` per axis, saying how strongly
liking it signals that letter. Negative = I / S / T / J, positive = E / N / F / P.
- **E/I**: crowds and parties ↔ solitude and quiet
- **S/N**: practical and concrete (how-tos, cleaning, routines) ↔ abstract and imaginative (philosophy, surreal art)
- **T/F**: logic, debate, efficiency ↔ emotion, kindness, wholesome moments
- **J/P**: plans and order ↔ spontaneity and chaos

Example — festival crowd: `{ extraversion: 0.9, intuition: 0, feeling: 0.1, perceiving: 0.6 }`.

**User model** (`userModel.ts`). Per trait: a `mean` estimate (starts at 0) and a
`variance` (starts high = unsure). Each reaction nudges the mean toward the clip's
vector (like) or away from it (dislike), weighted by how strongly the clip loads
on that trait. Variance shrinks for traits that got evidence.
Reaction time (from the reel appearing) is a confidence weight: decisions within 1.5s
count fully as gut reactions, slower ones gradually less (down to half weight at 5s+).

**Recommender** (`recommender.ts`). From unseen clips:
- 70% of the time → **probe**: pick the clip whose trait vector points most at the
  user's highest-variance traits (most information).
- 30% of the time → **engage**: pick the clip that best matches the current mean
  (what they'll probably like), so it still feels like a feed.
- Small randomness to avoid every user seeing identical sequences.

**Scoring** (`scoring.ts`). `mean` per axis → 0–100 (0 = first letter, 100 = second), plus a
likely range. A letter is flagged **borderline** when its range crosses 50 (it could flip on a
retake). The same estimate is sent with every reel to drive the live panel.

**Types** (`personalityTypes.ts`). The code is read from the sign of each axis; each of the
16 codes has our own name, description, and colors.

## Build phases

1. **Clip catalog** — placeholder clips + trait tags in `data/clips.json`. Needs
   enough coverage: aim for 150+ real clips so 40 picks still leaves room to choose.
   The simulation confirms this: with 48 clips the picking strategy makes no
   difference (nearly every clip gets shown); with 200, smart picking clearly
   beats random. Each trait also needs clips at both ends (e.g. Sensing clips,
   not only Intuitive ones).
2. **Feed UI** — player, decision buttons, keyboard controls, preloading,
   transitions, live type panel.
3. **Storage (later, optional)** — a backend to save sessions and "Already know your
   type?" answers (to measure real accuracy), plus short share links. Not needed to launch.
4. **Algorithm** — user model + recommender, validated with simulated users
   (`tests/algorithm/simulate.ts`): give a fake user a hidden personality, let them
   react, check we recover it.
5. **Results** — 4-letter type, axis chart with borderline flags, share link, self-report check.
6. **Tuning** — real playtests; adjust clip tags and update weights.

## Still open

- Final type names, descriptions, and art (the current 16 are a first draft).
- How clips get tagged at scale: by hand, a tagging admin page, or AI-assisted.
- Which static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages are all free) and
  where video files live once there are real reels (in `public/clips/` is fine for a
  small set; a CDN or object storage for hundreds of videos).
