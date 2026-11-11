import type { NextConfig } from "next";

// Set when the site is served from a subfolder, e.g. "/formerve" on GitHub Pages
// (the deploy workflow sets it). Empty locally, so `npm run dev` stays at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Plain static site: `npm run build` writes everything to out/, ready for any static host.
  output: "export",
  // /feed/ -> out/feed/index.html, which every static host (including GitHub Pages) serves correctly.
  trailingSlash: true,
  basePath,
};

export default nextConfig;
