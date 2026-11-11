"use client";

import { useState } from "react";
import Link from "next/link";
import type { PersonalityResult } from "@/lib/types";

// The big reveal: four-letter code, type name, description, share + retake.
// TODO: optional image export of this card for sharing to stories.
export function PersonalityCard({ result }: { result: PersonalityResult }) {
  const { type } = result;
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", window.location.href);
    }
  }

  return (
    <section
      className="result-reveal relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl p-8 shadow-2xl lg:min-h-[34rem]"
      style={{ background: `linear-gradient(160deg, ${type.colors[0]}, ${type.colors[1]})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="relative flex flex-col gap-3">
        <p className="text-sm font-medium tracking-widest uppercase opacity-80">Your type</p>
        <p className="font-mono text-7xl font-bold tracking-[0.15em]">{type.code}</p>
        <h1 className="text-3xl font-semibold">{type.name}</h1>
        <p className="text-lg leading-relaxed opacity-90">{type.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyLink}
            className="cursor-pointer rounded-full bg-white px-5 py-2.5 font-semibold text-black transition hover:scale-105"
          >
            {copied ? "Link copied!" : "Share result"}
          </button>
          <Link
            href="/feed"
            className="rounded-full border border-white/40 px-5 py-2.5 font-semibold transition hover:bg-white/10"
          >
            Take it again
          </Link>
        </div>
      </div>
    </section>
  );
}
