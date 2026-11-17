"use client";

import { useEffect, useState } from "react";
import type { PersonalityResult } from "@/lib/types";
import { renderStoryImage } from "@/lib/storyImage";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Status = "preparing" | "ready" | "saved" | "error";

// Websites can't post to Instagram directly. On phones this opens the share sheet with a
// ready-made 9:16 story image, where Instagram is one of the options; on desktop it
// downloads the image so it can be posted from a phone.
export function InstagramShareButton({ result }: { result: PersonalityResult }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("preparing");

  // Render ahead of time: phones only allow the share sheet right after a tap, so the
  // image must already exist when the button is pressed.
  useEffect(() => {
    let cancelled = false;
    const siteLabel = `${window.location.host}${BASE_PATH}`;
    renderStoryImage(result, siteLabel)
      .then((blob) => {
        if (cancelled) return;
        setFile(new File([blob], `scrollmi-${result.type.code}.png`, { type: "image/png" }));
        setStatus("ready");
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [result]);

  async function share() {
    if (!file) return;
    // Share the image alone: adding text or a link makes some apps (Instagram included) drop out.
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // they closed the share sheet
      }
    }
    download(file);
    setStatus("saved");
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={share}
        disabled={!file}
        className="cursor-pointer rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 px-5 py-2.5 font-semibold text-white transition hover:scale-105 disabled:cursor-wait disabled:opacity-60"
      >
        {status === "preparing" ? "Making your story…" : "Share to Instagram"}
      </button>
      {status === "saved" && (
        <p className="max-w-56 text-xs opacity-80">Story image saved. Open Instagram on your phone and add it to your story.</p>
      )}
      {status === "error" && <p className="text-xs opacity-80">Couldn&apos;t make the image on this browser.</p>}
    </div>
  );
}

function download(file: File) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
