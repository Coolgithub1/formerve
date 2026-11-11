const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Next adds the base path to links and its own files, but not to plain URLs like a
 * clip's "/clips/skydive.mp4". This adds it to root-relative paths; full URLs pass through.
 */
export function assetUrl(path: string): string {
  return path.startsWith("/") ? BASE_PATH + path : path;
}
