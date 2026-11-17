import type { Metadata } from "next";
import "./globals.css";
import { REELS_PER_SESSION } from "@/lib/config";

export const metadata: Metadata = {
  title: "ScrollMi",
  description: `Scroll ${REELS_PER_SESSION} reels. Find out your four-letter type.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
