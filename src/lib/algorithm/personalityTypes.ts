import { TRAITS, type PersonalityType, type Trait, type TraitVector } from "@/lib/types";
import { AXES } from "./traits";

// Our own names and copy. Don't reuse other tests' branded type names.
const TYPES: Record<string, Omit<PersonalityType, "code">> = {
  INTJ: {
    name: "The Strategist",
    description: "You like ideas with a plan attached. Your feed is where you go to think three moves ahead.",
    colors: ["#6366f1", "#1e1b4b"],
  },
  INTP: {
    name: "The Theorist",
    description: "You'd rather understand how something works than be told that it does. Rabbit holes are your natural habitat.",
    colors: ["#8b5cf6", "#312e81"],
  },
  ENTJ: {
    name: "The Captain",
    description: "Big goals, clear plans, and no patience for dithering. You watch people win and take notes.",
    colors: ["#7c3aed", "#be123c"],
  },
  ENTP: {
    name: "The Idea Machine",
    description: "You love a good argument, a weird idea, and poking holes in both. Boredom is your only real enemy.",
    colors: ["#a855f7", "#f97316"],
  },
  INFJ: {
    name: "The Oracle",
    description: "Quietly perceptive and drawn to meaning. You see where people and stories are heading before they do.",
    colors: ["#14b8a6", "#4338ca"],
  },
  INFP: {
    name: "The Dreamer",
    description: "Soft-hearted, imaginative, and loyal to your own values. Your feed is half art, half feelings.",
    colors: ["#ec4899", "#6366f1"],
  },
  ENFJ: {
    name: "The Mentor",
    description: "You light up around people and want them to win. Group projects secretly run through you.",
    colors: ["#10b981", "#db2777"],
  },
  ENFP: {
    name: "The Spark",
    description: "Curious about everything and everyone. You chase what's interesting and bring people along for it.",
    colors: ["#facc15", "#ec4899"],
  },
  ISTJ: {
    name: "The Steady Hand",
    description: "Reliable, precise, and quietly satisfied by things done right. Routines aren't boring; they're yours.",
    colors: ["#0ea5e9", "#1e293b"],
  },
  ISFJ: {
    name: "The Caretaker",
    description: "Warm, attentive, and the first to notice who needs help. You like your comforts and your people close.",
    colors: ["#38bdf8", "#be185d"],
  },
  ESTJ: {
    name: "The Organizer",
    description: "You like order, results, and clear rules. Left alone, you'd have the whole group's schedule color-coded.",
    colors: ["#2563eb", "#0f766e"],
  },
  ESFJ: {
    name: "The Host",
    description: "You make every room feel welcome. Traditions, gatherings, and good vibes are your love language.",
    colors: ["#f472b6", "#0ea5e9"],
  },
  ISTP: {
    name: "The Fixer",
    description: "Hands-on, cool-headed, and curious how things work. You'd rather try it than read the manual.",
    colors: ["#64748b", "#ea580c"],
  },
  ISFP: {
    name: "The Aesthete",
    description: "You live through your senses: colors, music, moments. Gentle on the outside, fiercely independent underneath.",
    colors: ["#f59e0b", "#a855f7"],
  },
  ESTP: {
    name: "The Daredevil",
    description: "Fast, bold, and happiest when something is actually happening. You'd rather jump than overthink it.",
    colors: ["#ef4444", "#f97316"],
  },
  ESFP: {
    name: "The Life of the Party",
    description: "Fun is the point and everyone's invited. You turn ordinary moments into a show.",
    colors: ["#fb923c", "#e11d48"],
  },
};

export const TYPE_CODES = Object.keys(TYPES);

/** Four-letter code from the signs of the axis estimates (exactly 0 counts as the first letter). */
export function typeCode(mean: TraitVector): string {
  return TRAITS.map((t) => (mean[t] > 0 ? AXES[t].high.letter : AXES[t].low.letter)).join("");
}

/**
 * Code from 0–100 display scores, using the same rule as dominantPole (exactly 50 = first letter).
 * Results use this so the letters always match the labels on screen, even when rounding lands on 50.
 */
export function codeFromScores(scores: Record<Trait, number>): string {
  return TRAITS.map((t) => (scores[t] > 50 ? AXES[t].high.letter : AXES[t].low.letter)).join("");
}

/** null for anything that isn't one of the 16 codes. */
export function typeByCode(code: string): PersonalityType | null {
  return Object.hasOwn(TYPES, code) ? { code, ...TYPES[code] } : null;
}
