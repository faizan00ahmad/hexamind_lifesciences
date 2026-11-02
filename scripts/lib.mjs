// Helpers shared by scripts/ingest.mjs — name parsing, image processing.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export const IMG_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

export function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

// "500 gm", "1kg", "5 L", "10 litter", "100ml", "25 KG" …
const SIZE_RE = /(\d+(?:[.,]\d+)?)\s*(kg|kgs|gm|gms|g|grams?|liters?|litters?|litres?|ltr|l|ml)\b/i;

export function normalizeSize(m) {
  const n = m[1].replace(",", ".");
  const u = m[2].toLowerCase();
  if (u.startsWith("k")) return `${n} Kg`;
  if (u === "ml") return `${n} ml`;
  if (u === "g" || u.startsWith("gm") || u.startsWith("gram")) return `${n} gm`;
  return `${n} Ltr`;
}

export function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (c) => c.toUpperCase())
    .replace(/\bPlus\b/g, "Plus");
}

// Turns "HINTS/.../aglofine 10. 25kg/aglofine 10. 25kg.png" into { key, name, size }
export function parseLabel(raw) {
  let s = raw.replace(/\.(png|jpe?g|webp)$/gi, "").replace(/\.(png|jpe?g|webp)$/gi, "");
  s = s.replace(/[_]+/g, " ");
  let size = null;
  const m = s.match(SIZE_RE);
  if (m) {
    size = normalizeSize(m);
    s = s.replace(SIZE_RE, " ");
  }
  s = s.replace(/[^\p{L}\p{N}\s\-+&]/gu, " ").replace(/\s+/g, " ").trim();
  const key = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return { key, name: titleCase(s), size };
}

export const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Levenshtein similarity in [0,1] — used to match picture names to price-list rows.
export function similarity(a, b) {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - dp[a.length][b.length] / Math.max(a.length, b.length);
}

const THUMB = { w: 600, h: 800 };

// Writes <out>/<id>.webp (3:4 card thumbnail) and <out>/<id>-full.webp (modal image).
export async function processImage(src, outDir, id, { thumb: wantThumb = true } = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const base = sharp(src, { limitInputPixels: false, failOn: "none" }).rotate();
  const meta = await base.metadata();
  const W = meta.width;
  const H = meta.height;
  const bg = { r: 238, g: 242, b: 248, alpha: 1 };
  const flat = () => sharp(src, { limitInputPixels: false, failOn: "none" }).rotate().flatten({ background: bg });

  // Studio renders are huge square canvases with the pack in the middle: crop to the pack.
  const isRender = Math.abs(W / H - 1) < 0.08 && W >= 2000;
  let thumb;
  if (isRender) {
    const cw = Math.round(W * 0.72);
    const ch = Math.round(H * 0.96);
    thumb = flat().extract({ left: Math.round((W - cw) / 2), top: Math.round(H * 0.02), width: cw, height: ch });
  } else {
    thumb = flat();
  }
  const thumbBuf = wantThumb ? await thumb.resize(THUMB.w, THUMB.h, { fit: "cover", position: "attention" }).webp({ quality: 76 }).toBuffer() : Buffer.alloc(0);
  const fullBuf = await flat().resize(1000, 1000, { fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();

  if (wantThumb) fs.writeFileSync(path.join(outDir, `${id}.webp`), thumbBuf);
  fs.writeFileSync(path.join(outDir, `${id}-full.webp`), fullBuf);
  return { thumb: thumbBuf.length, full: fullBuf.length };
}
