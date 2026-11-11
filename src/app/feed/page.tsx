"use client";

import { useCallback, useState } from "react";
import { useFeedSession } from "@/hooks/useFeedSession";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { usePreloadClips } from "@/hooks/usePreloadClips";
import { ReelPlayer } from "@/components/feed/ReelPlayer";
import { DecisionButton } from "@/components/feed/DecisionButton";
import { ProgressBar } from "@/components/feed/ProgressBar";
import { LiveTypePanel } from "@/components/feed/LiveTypePanel";

// Layouts:
// - Desktop (landscape): 9:16 reel in the middle, dislike left, like right, live panel beside it.
// - Phone: reel on top, the two buttons in a row underneath, no live panel.
// - Portrait screens from tablet size up (e.g. a gallery kiosk): bigger reel, live panel below.
export default function FeedPage() {
  const feed = useFeedSession();
  const [muted, setMuted] = useState(false);
  const [showLive, setShowLive] = useState(true);
  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  useKeyboardControls({ enabled: feed.phase === "deciding", onDecide: feed.decide, onToggleMute: toggleMute });
  usePreloadClips(feed.upcoming);

  const canDecide = feed.phase === "deciding";
  const exiting = feed.phase === "submitting" ? feed.lastDecision : null;

  const livePanel = (className?: string) =>
    showLive ? (
      <LiveTypePanel live={feed.live} position={feed.position} onHide={() => setShowLive(false)} className={className} />
    ) : (
      <button
        type="button"
        onClick={() => setShowLive(true)}
        className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-xs opacity-60 hover:opacity-100"
      >
        Show live type
      </button>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-6">
      <div className="w-[min(45vh,420px)]">
        <ProgressBar current={feed.position} total={feed.total} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
        <DecisionButton decision="dislike" enabled={canDecide} chosen={exiting === "dislike"} onDecide={feed.decide} />

        <div className="relative aspect-[9/16] h-[min(78vh,750px)] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl max-sm:order-first max-sm:h-[62svh] md:portrait:h-[min(58vh,1100px)]">
          {feed.clip && feed.phase !== "done" && (
            <div key={feed.clip.id + feed.position} className="reel-card absolute inset-0" data-exit={exiting ?? undefined}>
              <ReelPlayer clip={feed.clip} muted={muted} />
            </div>
          )}

          {feed.phase === "loading" && <Centered>Loading…</Centered>}
          {feed.phase === "done" && <Centered>Working out your type…</Centered>}
          {feed.phase === "error" && (
            <Centered>
              <p>Something went wrong.</p>
              <button onClick={feed.retry} className="mt-3 rounded-full bg-white px-5 py-2 font-semibold text-black">
                Start over
              </button>
            </Centered>
          )}

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="absolute right-3 bottom-3 rounded-full bg-black/50 px-3 py-1.5 text-xs backdrop-blur"
          >
            {muted ? "Sound off" : "Sound on"} <kbd className="ml-1 opacity-60">M</kbd>
          </button>
        </div>

        <DecisionButton decision="like" enabled={canDecide} chosen={exiting === "like"} onDecide={feed.decide} />

        <div className="hidden lg:landscape:block">{livePanel()}</div>
      </div>

      <div className="hidden md:portrait:block">{livePanel("w-[min(90vw,40rem)]")}</div>

      <p className="text-sm opacity-50">
        {canDecide ? "Like it or not?" : " "}
      </p>
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-80">{children}</div>;
}
