import { describe, expect, it } from "vitest";
import { decodeResult, resultsUrl } from "@/lib/shareLink";
import { typeByCode } from "@/lib/algorithm/personalityTypes";
import type { PersonalityResult } from "@/lib/types";

const result: PersonalityResult = {
  type: typeByCode("INFP")!,
  scores: { extraversion: 4, intuition: 98, feeling: 67, perceiving: 66 },
  ranges: { extraversion: [0, 12], intuition: [88, 100], feeling: [54, 80], perceiving: [52, 79] },
  liked: 14,
  total: 40,
};

const paramsOf = (url: string) => new URLSearchParams(url.split("?")[1]);

describe("share links", () => {
  it("round-trips a result through the URL", () => {
    const url = resultsUrl(result);
    expect(url.startsWith("/results/?")).toBe(true);
    expect(decodeResult(paramsOf(url))).toEqual(result);
  });

  it("rejects links with missing or mangled parts", () => {
    const good = paramsOf(resultsUrl(result));
    const broken = (key: string, value: string | null) => {
      const p = new URLSearchParams(good);
      if (value === null) p.delete(key);
      else p.set(key, value);
      return decodeResult(p);
    };
    expect(decodeResult(new URLSearchParams())).toBeNull();
    expect(broken("t", "XXXX")).toBeNull();
    expect(broken("t", "ENFP")).toBeNull(); // letters don't match the scores
    expect(broken("s", "4-98-67")).toBeNull();
    expect(broken("s", "4-98-67-166")).toBeNull();
    expect(broken("r", "0.12-88.100-54.80")).toBeNull();
    expect(broken("r", "10.12-88.100-54.80-52.79")).toBeNull(); // score outside its range
    expect(broken("n", "41-40")).toBeNull();
    expect(broken("n", null)).toBeNull();
  });
});
