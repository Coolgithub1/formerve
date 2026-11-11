import { describe, expect, it } from "vitest";
import { codeFromScores, typeByCode, typeCode, TYPE_CODES } from "@/lib/algorithm/personalityTypes";
import { dominantPole } from "@/lib/algorithm/traits";
import { isBorderline } from "@/lib/algorithm/scoring";

describe("typeCode", () => {
  it("reads one letter per axis from the sign", () => {
    expect(typeCode({ extraversion: 0.5, intuition: -0.2, feeling: 0.1, perceiving: -0.9 })).toBe("ESFJ");
    expect(typeCode({ extraversion: -0.5, intuition: 0.2, feeling: -0.1, perceiving: 0.9 })).toBe("INTP");
  });

  it("covers all 16 types with a name", () => {
    expect(TYPE_CODES).toHaveLength(16);
    for (const code of TYPE_CODES) {
      const [e, n, f, p] = [...code];
      const mean = {
        extraversion: e === "E" ? 1 : -1,
        intuition: n === "N" ? 1 : -1,
        feeling: f === "F" ? 1 : -1,
        perceiving: p === "P" ? 1 : -1,
      };
      expect(typeByCode(typeCode(mean))).toMatchObject({ code, name: expect.any(String) });
    }
  });

  it("rejects codes that aren't one of the 16", () => {
    expect(typeByCode("XXXX")).toBeNull();
    expect(typeByCode("toString")).toBeNull();
  });
});

describe("dominantPole and codeFromScores", () => {
  it("reports the leaning letter and its strength", () => {
    expect(dominantPole("extraversion", 29)).toMatchObject({ letter: "I", percent: 71 });
    expect(dominantPole("extraversion", 80)).toMatchObject({ letter: "E", percent: 80 });
  });

  it("agree on an exact 50, so the type letter always matches the label", () => {
    const scores = { extraversion: 50, intuition: 44, feeling: 59, perceiving: 37 };
    expect(codeFromScores(scores)).toBe("ISFJ");
    expect(dominantPole("extraversion", 50).letter).toBe("I");
  });
});

describe("isBorderline", () => {
  it("flags ranges that cross the midpoint", () => {
    expect(isBorderline([42, 61])).toBe(true);
    expect(isBorderline([55, 80])).toBe(false);
  });
});
