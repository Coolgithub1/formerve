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
    expect(reactionWeight(200)).toBeGreaterThan(reactionWeight(4000));
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
