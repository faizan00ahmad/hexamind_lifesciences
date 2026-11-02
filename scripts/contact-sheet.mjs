// QC helper: builds contact sheets (label crops + file names) so printed pack labels can be read
// against the names derived from filenames.   node scripts/contact-sheet.mjs <srcDir> <outDir> [perSheet]
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { IMG_EXT, walk } from "./lib.mjs";

const [, , srcDir, outDir, per = "6"] = process.argv;
const PER = Number(per);
const COLS = 3;
const CELL = Number(process.env.CELL ?? 520);
const CAP = 54;
fs.mkdirSync(outDir, { recursive: true });

let files = [...walk(srcDir)].filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()));
if (process.env.LIST) {
  const keep = new Set(JSON.parse(fs.readFileSync(process.env.LIST, "utf8")));
  files = files.filter((f) => keep.has(path.relative(srcDir, f).split(path.sep).join("/").toLowerCase()));
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

for (let i = 0; i * PER < files.length; i++) {
  const batch = files.slice(i * PER, (i + 1) * PER);
  const rows = Math.ceil(batch.length / COLS);
  const comps = [];
  for (let j = 0; j < batch.length; j++) {
    const f = batch[j];
    const meta = await sharp(f, { limitInputPixels: false }).metadata();
    const W = meta.width;
    const H = meta.height;
    // keep the pack area (square renders) — label text stays readable at this size
    const buf = await sharp(f, { limitInputPixels: false })
      .extract({ left: Math.round(W * 0.14), top: Math.round(H * 0.04), width: Math.round(W * 0.72), height: Math.round(H * 0.9) })
      .flatten({ background: "#fff" })
      .resize(CELL, CELL, { fit: "contain", background: "#fff" })
      .jpeg({ quality: 82 })
      .toBuffer();
    const x = (j % COLS) * CELL;
    const y = Math.floor(j / COLS) * (CELL + CAP);
    const rel = path.relative(srcDir, f).replace(/\\/g, "/");
    comps.push({ input: buf, left: x, top: y });
    comps.push({
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CELL}" height="${CAP}"><rect width="100%" height="100%" fill="#001F5B"/><text x="8" y="22" font-size="17" fill="#fff" font-family="Arial">#${i * PER + j + 1}  ${esc(rel.slice(-60))}</text></svg>`),
      left: x,
      top: y + CELL,
    });
  }
  await sharp({ create: { width: COLS * CELL, height: rows * (CELL + CAP), channels: 3, background: "#fff" } })
    .composite(comps)
    .jpeg({ quality: 80 })
    .toFile(path.join(outDir, `sheet-${String(i + 1).padStart(2, "0")}.jpg`));
  console.log("sheet", i + 1, batch.length);
}
