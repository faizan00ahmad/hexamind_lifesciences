// Catalogue audit:  node scripts/qc.mjs
// Fails (exit 1) on any hard error; prints warnings for things to eyeball.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CATS = ["poultry", "large", "pets", "human", "cosmetics"];
const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

const meta = JSON.parse(fs.readFileSync("data/meta.json", "utf8"));
const vers = JSON.parse(fs.readFileSync("data/versions.json", "utf8"));
const allNames = new Map(); // normalised name → [cat…]
let total = 0;

for (const cat of CATS) {
  const f = path.join("public", "data", `${cat}.json`);
  if (!fs.existsSync(f)) {
    err(`[${cat}] missing ${f}`);
    continue;
  }
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  const ps = d.products;
  total += ps.length;
  console.log(`\n${cat.padEnd(10)} ${String(ps.length).padStart(3)} products  (v=${d.v})`);

  if (d.category !== cat) err(`[${cat}] file says category=${d.category}`);
  if (meta[cat] !== ps.length) err(`[${cat}] data/meta.json count ${meta[cat]} ≠ ${ps.length}`);
  if (vers[cat] !== d.v) err(`[${cat}] data/versions.json ${vers[cat]} ≠ ${d.v}`);
  if (!ps.length) warn(`[${cat}] has no products — site shows "Coming soon"`);

  const ids = new Set();
  const names = new Set();
  let priced = 0;
  for (const p of ps) {
    const tag = `[${cat}/${p.id}]`;
    if (ids.has(p.id)) err(`${tag} duplicate id`);
    ids.add(p.id);
    const nk = p.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (names.has(nk)) err(`${tag} duplicate name "${p.name}"`);
    names.add(nk);
    allNames.set(nk, [...(allNames.get(nk) ?? []), cat]);

    if (!p.name?.trim()) err(`${tag} empty name`);
    if (/^[a-z]/.test(p.name)) warn(`${tag} name starts lowercase: "${p.name}"`);
    if (/\.(png|jpe?g|webp)$/i.test(p.name)) err(`${tag} file extension in name`);
    if (!p.tagline) err(`${tag} no tagline`);
    if (cat === "poultry" && !p.company) err(`${tag} no company (poultry page is grouped by company)`);
    if (!p.packing?.length) warn(`${tag} no packing/size`);
    if (p.prices?.length) {
      priced++;
      const seen = new Set();
      for (const x of p.prices) {
        if (!(Number.isInteger(x.amount) && x.amount > 0)) err(`${tag} bad price ${JSON.stringify(x)}`);
        if (seen.has(x.size)) err(`${tag} duplicate price for ${x.size}`);
        seen.add(x.size);
        if (!p.sizes.includes(x.size)) err(`${tag} price for size "${x.size}" not in sizes [${p.sizes.join(", ")}]`);
      }
      // bigger pack should cost more in total but not more per unit than the smaller one by much
      const val = (s) => { const m = s.match(/^([\d.]+)\s*(Kg|gm|Ltr|ml)/i); if (!m) return null; const v = parseFloat(m[1]); return /kg|l/i.test(m[2]) && !/ml/i.test(m[2]) ? v * 1000 : v; };
      const pv = p.prices.map((x) => [val(x.size), x.amount]).filter((x) => x[0]).sort((a, b) => a[0] - b[0]);
      for (let i = 1; i < pv.length; i++) {
        if (pv[i][1] <= pv[i - 1][1]) warn(`${tag} larger pack is not dearer (${p.prices.map((x) => x.size + "=" + x.amount).join(", ")})`);
        const u0 = pv[i - 1][1] / pv[i - 1][0], u1 = pv[i][1] / pv[i][0];
        if (u1 > u0 * 1.15) warn(`${tag} larger pack costs more per unit than the smaller (${p.prices.map((x) => x.size + "=" + x.amount).join(", ")})`);
      }
    }
    if (!p.image) warn(`${tag} has no picture (price-list only)`);
    for (const k of ["image", "full"]) {
      const rel = p[k];
      if (!rel) continue;
      const file = path.join("public", rel);
      if (!fs.existsSync(file)) err(`${tag} ${k} missing on disk: ${rel}`);
      else {
        const kb = fs.statSync(file).size / 1024;
        if (kb > 250) warn(`${tag} ${k} is ${kb.toFixed(0)} KB`);
        if (kb < 3) err(`${tag} ${k} suspiciously small (${kb.toFixed(1)} KB)`);
      }
    }
    for (const a of p.gallery ?? []) if (!fs.existsSync(path.join("public", a.src))) err(`${tag} gallery image missing: ${a.src}`);
  }
  console.log(`  priced: ${priced}/${ps.length}`);
  if (priced && priced < ps.length) warn(`[${cat}] ${ps.length - priced} products without a price: ${ps.filter((p) => !p.prices?.length).map((p) => p.name).join(", ")}`);
  const groups = {};
  ps.forEach((p) => (groups[p.group ?? "(none)"] = (groups[p.group ?? "(none)"] ?? 0) + 1));
  console.log("  groups:", JSON.stringify(groups));

  // orphan files in public/products/<cat>
  const dir = path.join("public", "products", cat);
  if (fs.existsSync(dir)) {
    const used = new Set(ps.flatMap((p) => [p.image, p.full, ...(p.gallery ?? []).map((a) => a.src)]).filter(Boolean).map((r) => path.basename(r)));
    const orphans = fs.readdirSync(dir).filter((f) => !used.has(f));
    if (orphans.length) warn(`[${cat}] ${orphans.length} orphan image file(s): ${orphans.slice(0, 5).join(", ")}`);
    // decode a sample to make sure files aren't corrupt
    for (const f of fs.readdirSync(dir).slice(0, 400)) {
      try {
        const m = await sharp(path.join(dir, f)).metadata();
        if (!m.width) err(`[${cat}] undecodable ${f}`);
      } catch {
        err(`[${cat}] corrupt image ${f}`);
      }
    }
  }
}

for (const [k, cats] of allNames) if (cats.length > 1) warn(`same product name in several categories: ${k} → ${cats.join(", ")}`);

console.log(`\nTOTAL ${total} products`);
console.log(`${warns.length} warning(s)`);
warns.forEach((w) => console.log("  ⚠ " + w));
console.log(`${errors.length} error(s)`);
errors.forEach((e) => console.log("  ✖ " + e));
process.exit(errors.length ? 1 : 0);
