import { TRAITS, type Trait, type TraitVector } from "@/lib/types";

interface Pole {
  letter: string;
  label: string;
}

/** Display info per axis. `low` is the negative end, `high` the positive end. */
export const AXES: Record<Trait, { name: string; low: Pole; high: Pole }> = {
  extraversion: {
    name: "Energy",
    low: { letter: "I", label: "Introverted" },
    high: { letter: "E", label: "Extraverted" },
  },
  intuition: {
    name: "Information",
    low: { letter: "S", label: "Sensing" },
    high: { letter: "N", label: "Intuitive" },
  },
  feeling: {
    name: "Decisions",
    low: { letter: "T", label: "Thinking" },
    high: { letter: "F", label: "Feeling" },
  },
  perceiving: {
    name: "Structure",
    low: { letter: "J", label: "Judging" },
    high: { letter: "P", label: "Perceiving" },
  },
};

/** Which end of the axis a 0–100 score leans toward, and how strongly (50–100%). Exactly 50 counts as the first letter. */
export function dominantPole(trait: Trait, score: number): Pole & { percent: number } {
  const pole = score > 50 ? AXES[trait].high : AXES[trait].low;
  return { ...pole, percent: Math.max(score, 100 - score) };
}

export function fillVector(value: number): TraitVector {
  return Object.fromEntries(TRAITS.map((t) => [t, value])) as TraitVector;
}

export function dot(a: TraitVector, b: TraitVector): number {
  return TRAITS.reduce((sum, t) => sum + a[t] * b[t], 0);
}
