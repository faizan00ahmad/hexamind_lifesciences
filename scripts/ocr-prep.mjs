// Prepares OCR input: crops each pack render and writes a 2600px JPEG per image + manifest.json.
//   node scripts/ocr-prep.mjs <srcDir> <outDir>
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { IMG_EXT, walk } from "./lib.mjs";

const [, , srcDir, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
let n = 0;
for (const f of walk(srcDir)) {
  if (!IMG_EXT.has(path.extname(f).toLowerCase())) continue;
  const m = await sharp(f, { limitInputPixels: false, failOn: "none" }).metadata();
  const sq = Math.abs(m.width / m.height - 1) < 0.08 && m.width >= 2000;
  let img = sharp(f, { limitInputPixels: false, failOn: "none" }).flatten({ background: "#fff" });
  if (sq) img = img.extract({ left: Math.round(m.width * 0.12), top: Math.round(m.height * 0.03), width: Math.round(m.width * 0.76), height: Math.round(m.height * 0.94) });
  const id = String(++n).padStart(3, "0");
  await img.resize(2600, 2600, { fit: "inside", withoutEnlargement: true }).sharpen().jpeg({ quality: 92 }).toFile(path.join(outDir, `${id}.jpg`));
  manifest.push({ id, rel: path.relative(srcDir, f).split(path.sep).join("/") });
}
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`prepared ${n} images in ${outDir}`);
