import { TRAITS, type PersonalityResult } from "@/lib/types";
import { AXES, dominantPole } from "@/lib/algorithm/traits";

// Draws a result as a 1080x1920 (9:16) image for an Instagram story.
// Instagram covers roughly the top 250px (profile bar) and bottom 340px (reply box),
// so everything important sits between those.

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;

const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
const SIDE = 96;

/** Renders the story image. `siteLabel` is the address printed at the bottom, e.g. "coolgithub1.github.io/formerve". */
export async function renderStoryImage(result: PersonalityResult, siteLabel: string): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");
  await document.fonts?.ready;

  drawBackground(ctx, result.type.colors);

  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";

  ctx.globalAlpha = 0.8;
  ctx.font = `600 38px ${SANS}`;
  spacedText(ctx, "MY SCROLLMI TYPE", SIDE, 300, 8);
  ctx.globalAlpha = 1;

  ctx.font = `700 250px ${MONO}`;
  spacedText(ctx, result.type.code, SIDE - 8, 545, 28);

  ctx.font = `700 92px ${SANS}`;
  ctx.fillText(result.type.name, SIDE, 675);

  ctx.globalAlpha = 0.9;
  ctx.font = `400 46px ${SANS}`;
  wrapText(ctx, result.type.description, SIDE, 758, STORY_WIDTH - SIDE * 2, 64, 3);
  ctx.globalAlpha = 1;

  drawAxes(ctx, result, 965);
  drawFooter(ctx, siteLabel, 1540);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create the image"))), "image/png"),
  );
}

function drawBackground(ctx: CanvasRenderingContext2D, [from, to]: [string, string]) {
  // Same 160° gradient as the results card.
  const bg = ctx.createLinearGradient(STORY_WIDTH * 0.2, 0, STORY_WIDTH * 0.8, STORY_HEIGHT);
  bg.addColorStop(0, from);
  bg.addColorStop(1, to);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  // Soft glows for depth.
  for (const [x, y, r, alpha] of [
    [900, 260, 520, 0.18],
    [120, 1500, 640, 0.12],
  ] as const) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, `rgba(255,255,255,${alpha})`);
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
  }

  // Darken toward the bottom so the white text and bars stay readable on any palette.
  const shade = ctx.createLinearGradient(0, STORY_HEIGHT * 0.35, 0, STORY_HEIGHT);
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
}

function drawAxes(ctx: CanvasRenderingContext2D, result: PersonalityResult, top: number) {
  const panelHeight = 500;
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  roundRect(ctx, SIDE - 36, top, STORY_WIDTH - (SIDE - 36) * 2, panelHeight, 44);
  ctx.fill();

  const rowGap = 108;
  TRAITS.forEach((trait, i) => {
    const axis = AXES[trait];
    const score = result.scores[trait];
    const pole = dominantPole(trait, score);
    const y = top + 88 + i * rowGap;

    ctx.fillStyle = "#fff";
    ctx.font = `600 36px ${SANS}`;
    ctx.fillText(pole.label, SIDE, y);
    ctx.globalAlpha = 0.65;
    ctx.textAlign = "right";
    ctx.fillText(`${pole.percent}%`, STORY_WIDTH - SIDE, y);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;

    const barY = y + 34;
    const barLeft = SIDE + 54;
    const barRight = STORY_WIDTH - SIDE - 54;
    ctx.font = `700 34px ${SANS}`;
    ctx.globalAlpha = score <= 50 ? 1 : 0.35;
    ctx.fillText(axis.low.letter, SIDE, barY + 12);
    ctx.globalAlpha = score > 50 ? 1 : 0.35;
    ctx.textAlign = "right";
    ctx.fillText(axis.high.letter, STORY_WIDTH - SIDE, barY + 12);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255,255,255,0.22)";
    roundRect(ctx, barLeft, barY - 8, barRight - barLeft, 16, 8);
    ctx.fill();
    const markerX = barLeft + ((barRight - barLeft) * score) / 100;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(markerX, barY, 19, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFooter(ctx: CanvasRenderingContext2D, siteLabel: string, y: number) {
  ctx.font = `600 40px ${SANS}`;
  const text = `What's yours? ${siteLabel}`;
  const width = Math.min(ctx.measureText(text).width, STORY_WIDTH - SIDE * 2 - 80);
  const pillWidth = width + 80;
  const x = (STORY_WIDTH - pillWidth) / 2;
  ctx.fillStyle = "#fff";
  roundRect(ctx, x, y - 58, pillWidth, 92, 46);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.fillText(text, STORY_WIDTH / 2, y + 2, STORY_WIDTH - SIDE * 2 - 80);
  ctx.textAlign = "left";
}

/** Draws text with extra space between characters (canvas letterSpacing isn't supported everywhere). */
function spacedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
}

/** Word-wraps text into at most `maxLines` lines, ending with "…" if it doesn't fit. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "…");
  }
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
