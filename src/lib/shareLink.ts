import { TRAITS, type PersonalityResult, type Trait } from "@/lib/types";
import { codeFromScores, typeByCode } from "@/lib/algorithm/personalityTypes";

// There's no server, so a results link carries the result itself:
//   /results/?t=INFP&s=4-98-67-66&r=0.12-88.100-54.80-52.79&n=14-40
//   t = type code, s = score per axis, r = likely range per axis (low.high), n = liked-total
// Anyone can open it and see the same page. Someone could hand-edit it to fake a
// result, which doesn't matter for a fun quiz.

export function resultsUrl(result: PersonalityResult): string {
  const params = new URLSearchParams({
    t: result.type.code,
    s: TRAITS.map((t) => result.scores[t]).join("-"),
    r: TRAITS.map((t) => result.ranges[t].join(".")).join("-"),
    n: `${result.liked}-${result.total}`,
  });
  return `/results/?${params}`;
}

const isScore = (x: number) => Number.isInteger(x) && x >= 0 && x <= 100;

/** null when the link is missing parts or has been mangled. */
export function decodeResult(params: URLSearchParams): PersonalityResult | null {
  const type = typeByCode(params.get("t") ?? "");
  const scores = (params.get("s") ?? "").split("-").map(Number);
  const ranges = (params.get("r") ?? "").split("-").map((pair) => pair.split(".").map(Number));
  const [liked, total] = (params.get("n") ?? "").split("-").map(Number);

  if (!type || scores.length !== TRAITS.length || ranges.length !== TRAITS.length) return null;
  if (!scores.every(isScore)) return null;
  if (!ranges.every((r, i) => r.length === 2 && r.every(isScore) && r[0] <= scores[i] && scores[i] <= r[1])) return null;
  if (!Number.isInteger(liked) || !Number.isInteger(total) || liked < 0 || liked > total) return null;

  const scoreMap = Object.fromEntries(TRAITS.map((t, i) => [t, scores[i]])) as Record<Trait, number>;
  if (codeFromScores(scoreMap) !== type.code) return null; // letters must match the bars

  return {
    type,
    scores: scoreMap,
    ranges: Object.fromEntries(TRAITS.map((t, i) => [t, ranges[i] as [number, number]])) as Record<Trait, [number, number]>,
    liked,
    total,
  };
}
