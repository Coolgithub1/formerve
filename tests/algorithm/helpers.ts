import { TRAITS, type Clip, type Reaction, type Trait } from "@/lib/types";

/** A clip loading only on the given traits (everything else 0). */
export function clip(id: string, loadings: Partial<Record<Trait, number>>): Clip {
  const traits = Object.fromEntries(TRAITS.map((t) => [t, loadings[t] ?? 0])) as Clip["traits"];
  return { id, src: null, title: id, tags: [], traits };
}

export function reaction(clipId: string, decision: Reaction["decision"], position = 0, reactionMs = 1000): Reaction {
  return { clipId, decision, reactionMs, position };
}
