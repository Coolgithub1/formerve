import { describe, expect, it } from "vitest";
import { pickNextClip, rankClips } from "@/lib/algorithm/recommender";
import { applyReaction, emptyUserModel } from "@/lib/algorithm/userModel";
import { clip, reaction } from "./helpers";

const intuitionClip = clip("open", { intuition: 0.9 });
const extraversionClip = clip("extra", { extraversion: 0.9 });
const weakClip = clip("weak", { feeling: 0.1 });
const catalog = [intuitionClip, extraversionClip, weakClip];

describe("pickNextClip", () => {
  it("never returns a clip the user has already seen", () => {
    let model = emptyUserModel();
    const picked = new Set<string>();
    for (let i = 0; i < catalog.length; i++) {
      const next = pickNextClip(catalog, model)!;
      expect(picked.has(next.id)).toBe(false);
      picked.add(next.id);
      model = applyReaction(model, next, reaction(next.id, "like", i));
    }
  });

  it("returns null when every clip has been seen", () => {
    const model = { ...emptyUserModel(), seenClipIds: new Set(catalog.map((c) => c.id)) };
    expect(pickNextClip(catalog, model)).toBeNull();
  });
});

describe("rankClips", () => {
  it("in probe mode, prefers clips loading on high-variance traits", () => {
    // After a reaction on intuition, extraversion is now the less certain trait.
    const model = applyReaction(emptyUserModel(), clip("o2", { intuition: 0.9 }), reaction("o2", "like"));
    const ranked = rankClips(catalog, model, "probe");
    expect(ranked[0].id).toBe("extra");
    expect(ranked.at(-1)!.id).toBe("weak");
  });

  it("in engage mode, prefers clips matching the current mean", () => {
    const model = applyReaction(emptyUserModel(), clip("o2", { intuition: 0.9 }), reaction("o2", "like"));
    expect(rankClips(catalog, model, "engage")[0].id).toBe("open");
  });
});
