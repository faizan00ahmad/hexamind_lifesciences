// Reads the OCR text of every pack image and scores which category the cover says it belongs to.
//   node scripts/classify.mjs <ocrDir>[:<expectedCategory>] …     writes data/ocr-report.json (merged by source)
import fs from "node:fs";
import path from "node:path";

const RULES = {
  poultry: /\b(poultry|chick(s|en)?|broilers?|layers?|breeders?|birds?|hens?|pigeons?|turkeys?|ducks?|flock)\b/gi,
  large: /\b(cattle|cows?|buffalo(es)?|sheep|goats?|camels?|horses?|equines?|ruminants?|ruminal|lactation|udder|calves|calf|livestock|fattening)\b/gi,
  pets: /\b(dogs?|cats?|canines?|felines?|pets?|puppy|puppies|kittens?|companion animals?)\b/gi,
  human: /\b(tablets?|sachets?|capsules?|pregnancy|fertility|infants?|children|adults?|physician|nutraceutical product|enlistment rules)\b/gi,
  cosmetics: /\b(cream|lotion|shampoo|serum|moisturi[sz]er|sunscreen|face ?wash|skin ?care|skin|hair|facial|cleanser|gel|ointment|spf)\b/gi,
};
const VET = /veterinary|vet\.? use/gi;

const args = process.argv.slice(2);
const out = [];
for (const a of args) {
  const [dir, expected] = a.split("|");
  const man = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
  const ocr = JSON.parse(fs.readFileSync(path.join(dir, "ocr.json"), "utf8").replace(/^﻿/, ""));
  for (const r of ocr) {
    const rel = man.find((m) => m.id === r.id)?.rel;
    const t = r.text ?? "";
    const scores = Object.fromEntries(Object.entries(RULES).map(([k, re]) => [k, (t.match(re) ?? []).length]));
    const vet = (t.match(VET) ?? []).length;
    const ranked = Object.entries(scores).sort((x, y) => y[1] - x[1]);
    out.push({ src: path.basename(dir), expected, rel, vet, scores, top: ranked[0][1] ? ranked[0][0] : null, text: t.replace(/\n/g, " | ") });
  }
}
fs.writeFileSync("data/ocr-report.json", JSON.stringify(out, null, 1));
for (const o of out) {
  const s = Object.entries(o.scores).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(" ");
  console.log(`${o.src.padEnd(9)} ${o.vet ? "VET" : "   "} ${s.padEnd(34)} ${o.rel}`);
}
