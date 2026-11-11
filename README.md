# formerve

Scroll 40 reels, like or dislike each one after 3 seconds, and get your
four-letter personality type at the end, with the bars updating live as you go.
See [PLAN.md](PLAN.md) for the design and decisions.

It's a plain static site: everything runs in the visitor's browser, nothing is
stored, and results are shared by putting the result in the link.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Publish it

```bash
npm run build
```

This writes the whole site to `out/`. Upload that folder to any static host
(Vercel, Netlify, GitHub Pages, Cloudflare Pages). No server or database needed.

## Adding real clips

1. Put vertical (9:16) videos in `public/clips/`.
2. In `data/clips.json`, set each clip's `src` (e.g. `"/clips/skydive.mp4"`), tags, and its four axis values.

Clips with `"src": null` show as colored placeholder cards.

## Checks

- `npm test`: unit tests
- `npm run simulate`: fake users with hidden types, to check how often the algorithm gets their letters right

## Where things live

- `src/lib/algorithm/`: user model, recommender, scoring, the 16 types (plain functions, no framework code)
- `src/lib/feed/`: runs a quiz session in the browser
- `src/lib/shareLink.ts`: puts a result into a link and reads it back
- `src/app/feed/`: the reel feed; `src/app/results/`: the results page
- `tests/`: unit tests + `algorithm/simulate.ts`
