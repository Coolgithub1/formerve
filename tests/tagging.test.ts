import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import clips from "../data/clips.json";

// data/TAGGING.md records the reasoning for every clip's weights. This keeps that
// table and clips.json identical, so the reasoning can't go stale.
const md = readFileSync(path.resolve(__dirname, "../data/TAGGING.md"), "utf8");
const num = (s: string) => Number(s.trim().replace("−", "-"));

const guideRows = new Map<string, number[]>();
for (const line of md.split("\n")) {
  const m = line.match(/^\| (p\d\d) \|[^|]*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/);
  if (m) guideRows.set(m[1], [m[2], m[3], m[4], m[5]].map(num));
}

describe("data/TAGGING.md", () => {
  it("has a reasoning row for every clip, and none extra", () => {
    expect([...guideRows.keys()].sort()).toEqual(clips.map((c) => c.id).sort());
  });

  it("lists the same weights as clips.json", () => {
    for (const clip of clips) {
      const t = clip.traits;
      expect(guideRows.get(clip.id), clip.id).toEqual([t.extraversion, t.intuition, t.feeling, t.perceiving]);
    }
  });

  it("never exceeds the strongest tier's cap of 0.9", () => {
    for (const clip of clips) {
      for (const w of Object.values(clip.traits)) expect(Math.abs(w)).toBeLessThanOrEqual(0.9);
    }
  });
});
