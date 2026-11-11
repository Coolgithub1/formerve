import Link from "next/link";
import { REELS_PER_SESSION } from "@/lib/config";

// Landing page. TODO: real copy, visuals, explain the 3-second rule.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">formerve</h1>
      <p className="opacity-70">
        Scroll {REELS_PER_SESSION} reels. Like or dislike. Watch your four-letter type take shape.
      </p>
      <Link href="/feed" className="rounded-full bg-white px-6 py-3 font-semibold text-black">
        Start
      </Link>
    </main>
  );
}
