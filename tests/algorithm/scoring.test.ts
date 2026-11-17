import { describe, expect, it } from "vitest";
import { scorePersonality, toDisplayScore } from "@/lib/algorithm/scoring";
import { applyReaction, buildUserModel, emptyUserModel, reactionWeight } from "@/lib/algorithm/userModel";
import { clip, reaction } from "./helpers";

describe("toDisplayScore", () => {
  it("maps [-1, 1] onto 0-100", () => {
    expect(toDisplayScore(-1)).toBe(0);
    expect(toDisplayScore(0)).toBe(50);
    expect(toDisplayScore(1)).toBe(100);
  });

  it("clamps out-of-range values", () => {
    expect(toDisplayScore(2)).toBe(100);
  });
});

describe("scorePersonality", () => {
  const sky = clip("sky", { intuition: 0.8 });
  const reactions = [reaction("sky", "like", 0)];
  const model = buildUserModel(reactions, new Map([["sky", sky]]));
  const result = scorePersonality(model, reactions);

  it("puts every score inside its likely range", () => {
    for (const [trait, score] of Object.entries(result.scores)) {
      const [low, high] = result.ranges[trait as keyof typeof result.ranges];
      expect(low).toBeLessThanOrEqual(score);
      expect(high).toBeGreaterThanOrEqual(score);
    }
  });

  it("narrows the range on traits that got evidence", () => {
    const width = (t: keyof typeof result.ranges) => result.ranges[t][1] - result.ranges[t][0];
    expect(width("intuition")).toBeLessThan(width("extraversion"));
  });

  it("counts likes", () => {
    expect(result.liked).toBe(1);
    expect(result.total).toBe(1);
  });
});

describe("applyReaction", () => {
  const adventurous = clip("sky", { intuition: 0.8, perceiving: -0.6 });

  it("liking a clip moves the mean toward the clip's traits", () => {
    const model = applyReaction(emptyUserModel(), adventurous, reaction("sky", "like"));
    expect(model.mean.intuition).toBeGreaterThan(0);
    expect(model.mean.perceiving).toBeLessThan(0);
  });

  it("disliking a clip moves the mean away from the clip's traits", () => {
    const model = applyReaction(emptyUserModel(), adventurous, reaction("sky", "dislike"));
    expect(model.mean.intuition).toBeLessThan(0);
    expect(model.mean.perceiving).toBeGreaterThan(0);
  });

  it("shrinks variance only on traits the clip loads on", () => {
    const before = emptyUserModel();
    const after = applyReaction(before, adventurous, reaction("sky", "like"));
    expect(after.variance.intuition).toBeLessThan(before.variance.intuition);
    expect(after.variance.extraversion).toBe(before.variance.extraversion);
  });

  it("does not touch traits the clip doesn't load on", () => {
    const model = applyReaction(emptyUserModel(), adventurous, reaction("sky", "like"));
    expect(model.mean.feeling).toBe(0);
  });

  it("marks the clip as seen without mutating the input model", () => {
    const before = emptyUserModel();
    const after = applyReaction(before, adventurous, reaction("sky", "like"));
    expect(after.seenClipIds.has("sky")).toBe(true);
    expect(before.seenClipIds.size).toBe(0);
  });

  it("fast decisions move the estimate more than slow ones", () => {
    const fast = applyReaction(emptyUserModel(), adventurous, reaction("sky", "like", 0, 200));
    const slow = applyReaction(emptyUserModel(), adventurous, reaction("sky", "like", 0, 4000));
    expect(fast.mean.intuition).toBeGreaterThan(slow.mean.intuition);
    expect(reactionWeight({ decision: "like", reactionMs: 200 })).toBeGreaterThan(
      reactionWeight({ decision: "like", reactionMs: 4000 }),
    );
  });

  it("a user who likes everything raises their bias, not just their traits", () => {
    const clips = [clip("a", { intuition: 0.8 }), clip("b", { intuition: -0.8 })];
    const model = buildUserModel(
      [reaction("a", "like", 0), reaction("b", "like", 1)],
      new Map(clips.map((c) => [c.id, c])),
    );
    expect(model.bias).toBeGreaterThan(0);
    expect(Math.abs(model.mean.intuition)).toBeLessThan(model.bias);
  });
});

describe("gender lean", () => {
  const beauty = { ...clip("beauty", {}), gender: 0.9 };
  const thrill = { ...clip("thrill", { perceiving: 0.5 }), gender: -0.4 };
  const byId = new Map([beauty, thrill].map((c) => [c.id, c]));

  it("starts in the middle", () => {
    expect(scorePersonality(emptyUserModel(), []).gender?.score).toBe(50);
  });

  it("moves toward girl after liking a girl-leaning clip and toward guy after liking a guy-leaning one", () => {
    const girl = buildUserModel([reaction("beauty", "like", 0), reaction("thrill", "dislike", 1)], byId);
    const guy = buildUserModel([reaction("beauty", "dislike", 0), reaction("thrill", "like", 1)], byId);
    expect(scorePersonality(girl, []).gender!.score).toBeGreaterThan(50);
    expect(scorePersonality(guy, []).gender!.score).toBeLessThan(50);
  });

  it("leaves the four letters alone when a clip only loads on gender", () => {
    const model = buildUserModel([reaction("beauty", "like", 0)], byId);
    expect(Object.values(model.mean).every((m) => m === 0)).toBe(true);
  });
});

describe("watch-time weight", () => {
  const w = (decision: "like" | "dislike", reactionMs: number, watchFraction?: number) =>
    reactionWeight({ decision, reactionMs, watchFraction });

  it("counts snap decisions strongly either way", () => {
    expect(w("like", 800, 0.1)).toBeCloseTo(1.2);
    expect(w("dislike", 800, 0.1)).toBeCloseTo(1.16);
  });

  it("makes likes U-shaped: snap and rewatch strong, a mid-clip like weakest", () => {
    const snap = w("like", 1000, 0.1);
    const midClip = w("like", 6000, 0.4);
    const finished = w("like", 20000, 1);
    const rewatched = w("like", 40000, 2);
    expect(midClip).toBeCloseTo(1);
    expect(snap).toBeGreaterThan(midClip);
    expect(finished).toBeCloseTo(1.3);
    expect(rewatched).toBeCloseTo(1.5);
  });

  it("levels off after two plays, since the clip keeps looping if someone walks away", () => {
    expect(w("like", 90000, 6)).toBeCloseTo(w("like", 40000, 2));
    expect(w("dislike", 90000, 6)).toBeCloseTo(w("dislike", 20000, 1));
  });

  it("makes dislikes weaker the longer they watched first", () => {
    expect(w("dislike", 800, 0)).toBeGreaterThan(w("dislike", 6000, 0.5));
    expect(w("dislike", 6000, 0.5)).toBeGreaterThan(w("dislike", 20000, 1));
    expect(w("dislike", 20000, 1)).toBeCloseTo(0.6);
  });

  it("falls back to the snap bonus alone when there's no watch data", () => {
    expect(w("like", 800)).toBeCloseTo(1.2);
    expect(w("dislike", 6000)).toBeCloseTo(1);
  });

  it("moves the estimate more for a rewatched like than a mid-clip like", () => {
    const sky = clip("sky", { intuition: 0.8 });
    const rewatched = applyReaction(emptyUserModel(), sky, { ...reaction("sky", "like", 0, 40000), watchFraction: 2 });
    const midClip = applyReaction(emptyUserModel(), sky, { ...reaction("sky", "like", 0, 6000), watchFraction: 0.4 });
    expect(rewatched.mean.intuition).toBeGreaterThan(midClip.mean.intuition);
  });
});
