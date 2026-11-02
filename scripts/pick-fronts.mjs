// Chooses the best "front" render per folder from the OCR text of every image:
// the front label carries the product name + "ORAL LIQUID/POWDER" + "VETERINARY USE ONLY" + pack size,
// back/side views carry the composition table, plant address and Urdu text.
//   node scripts/pick-fronts.mjs <ocrDir> <outName>      → data/fronts-<outName>.json (lower-case rel paths)
import fs from "node:fs";
import path from "node:path";

const [, , dir, outName] = process.argv;
const man = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
const ocr = JSON.parse(fs.readFileSync(path.join(dir, "ocr.json"), "utf8").replace(/^﻿/, ""));

const byFolder = new Map();
for (const r of ocr) {
  const rel = man.find((m) => m.id === r.id).rel;
  const folder = path.posix.dirname(rel);
  const t = r.text ?? "";
  let s = 0;
  if (/veterinary\s+use\s+only/i.test(t)) s += 4;
  if (/oral\s+(liquid|powder)/i.test(t)) s += 3;
  if (/\b\d+\s*(liter|litre|kg|ml|gm)\b/i.test(t)) s += 2;
  if (/supplement for good health|maintenance for good health|homeopathic remedy/i.test(t)) s += 2;
  if (/composition/i.test(t)) s -= 2;
  if (/manufacturing plant|head office/i.test(t)) s -= 2;
  if (t.length < 260) s += 1;
  const list = byFolder.get(folder) ?? [];
  list.push({ rel, s });
  byFolder.set(folder, list);
}
const fronts = [];
for (const [folder, list] of byFolder) {
  list.sort((a, b) => b.s - a.s);
  fronts.push(list[0].rel.toLowerCase());
  console.log(`${folder.padEnd(32)} → ${path.posix.basename(list[0].rel)}  (score ${list[0].s} of ${list.map((x) => x.s).join(",")})`);
}
fs.writeFileSync(`data/fronts-${outName}.json`, JSON.stringify(fronts, null, 1));
