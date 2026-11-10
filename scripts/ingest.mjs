// Builds the static catalogue from the extracted Drive folders + the price lists.
//   node scripts/ingest.mjs            → every category that has a source or a price list
//   node scripts/ingest.mjs human      → only the named category
//
// Rules (agreed with the client):
//   • a product is identified by the name PRINTED on its pack cover (see LABEL_FIX in sources.mjs)
//   • pictures with no price-list row are still added (no price)
//   • price-list rows with no picture are still added (placeholder image)
//   • prices are per pack size
// Output: public/products/<cat>/*.webp, public/data/<cat>.json, data/meta.json, data/versions.json, data/ingest-report.json
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { IMG_EXT, normalizeSize, parseLabel, processImage, similarity, slug, titleCase, walk } from "./lib.mjs";
import { LABEL_FIX, SOURCES } from "./sources.mjs";

const ROOT = process.cwd();
const only = process.argv[2];
const ONLY_PRODUCTS = process.env.ONLY ? process.env.ONLY.split(",").map((x) => x.trim()) : null; // re-process just these products (pictures only)
const SIZE_RE = /(\d+(?:[.,]\d+)?)\s*(kg|kgs|gm|gms|g|grams?|liters?|litters?|litres?|ltr|l|ml)\b/i;
const letters = (s) => s.toLowerCase().replace(/tablets?|tabs?/g, "t").replace(/syrup/g, "s").replace(/sachets?/g, "x").replace(/drops?/g, "d").replace(/[^a-z]/g, "");
const alnum = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// price-list style: "1 Ltr", "500 gm", "25 Kg"; "12 Sachet" stays as written
function packSize(p) {
  const m = p.match(SIZE_RE);
  return m ? normalizeSize(m) : p.trim();
}
// order: grams/ml ascending within the same unit family
function sizeKey(s) {
  const m = s.match(/^([\d.]+)\s*(Kg|gm|Ltr|ml)$/);
  if (!m) return [9, parseFloat(s) || 0];
  const v = parseFloat(m[1]);
  return m[2] === "Kg" ? [0, v * 1000] : m[2] === "gm" ? [0, v] : m[2] === "Ltr" ? [1, v * 1000] : [1, v];
}
const bySize = (a, b) => {
  const [fa, va] = sizeKey(a);
  const [fb, vb] = sizeKey(b);
  return fa - fb || va - vb;
};

function loadFacts(cat) {
  const f = path.join("data", "facts", `${cat}.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
}

// every data/prices/*.json whose category matches → rows grouped by product name
function loadPrices(cat) {
  const byName = new Map(); // alnum name → { name, sizes: Map(size → amount), sources:Set }
  const dir = path.join("data", "prices");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    if (d.category !== cat) continue;
    for (const r of d.rows) {
      const [name, packing, price] = Array.isArray(r) ? r : [r.name, r.packing, r.price];
      const k = alnum(name);
      const e = byName.get(k) ?? { name, sizes: new Map(), sources: new Set(), company: d.company };
      e.sizes.set(packSize(packing), price);
      e.sources.add(d.source);
      byName.set(k, e);
    }
  }
  return byName;
}

function formGroup(name, sizes) {
  const m = name.match(/(syrup|drops?|sachet|tablets?|capsules?|cream|gel|lotion|shampoo|ointment|injection|powder)/i);
  if (m) {
    const w = m[1].toLowerCase();
    return w.startsWith("tab") ? "Tablets" : w.startsWith("drop") ? "Drops" : w.startsWith("cap") ? "Capsules" : titleCase(w) + (w.endsWith("s") ? "" : "s");
  }
  const u = sizes.find((s) => /^[\d.]+ (Kg|gm|Ltr|ml)$/.test(s)) ?? "";
  return /Kg|gm$/.test(u) ? "Powders" : /Ltr|ml/.test(u) ? "Liquids" : undefined;
}

function formWord(name) {
  const m = name.match(/(syrup|drops?|sachet|tablets?|capsules?|cream|gel|lotion|shampoo|ointment|injection|powder)/i);
  if (!m) return null;
  const w = titleCase(m[1]);
  return w === "Drop" ? "Drops" : w === "Tablets" ? "Tablet" : w;
}

function tagline(cat, name, sizes) {
  const fw = formWord(name);
  if (fw) return `${fw} · ${sizes[0] ?? ""}`.replace(/ · $/, "");
  if (cat === "human") return "Human healthcare formulation";
  if (cat === "cosmetics") return "Personal care formulation";
  const first = sizes.find((s) => /^[\d.]+ (Kg|gm|Ltr|ml)$/.test(s)) ?? "";
  const form = /Kg|gm$/.test(first) ? "Oral Powder" : "Oral Liquid";
  return `${form} · Veterinary Use`;
}

const GENERIC_FILE = /^(front|back|image|img[\d_ -]*|untitled.*|\d+)$/i;

async function buildCategory(cat, report) {
  const srcs = SOURCES.filter((s) => s.category === cat);
  const prices = loadPrices(cat);
  const facts = loadFacts(cat);
  const outDir = path.join("public", "products", cat);
  const groups = new Map(); // alnum name → { name, sizes[], images[] }

  for (const s of srcs) {
    const base = path.join(ROOT, "..", "hexamind-src", s.dir);
    if (!fs.existsSync(base)) {
      report.warnings.push(`[${cat}] source folder missing: ${s.dir}`);
      continue;
    }
    for (const file of walk(base)) {
      if (!IMG_EXT.has(path.extname(file).toLowerCase())) continue;
      const fileBase = path.basename(file);
      const parent = path.basename(path.dirname(file));
      if (s.skipFront && /^front\.(png|jpe?g|webp)$/i.test(fileBase)) continue; // blank pack template, not a product
      const relPath = path.relative(base, file).split(path.sep).join("/");
      if (s.skipDirs?.some((re) => re.test(relPath))) continue;
      const fileLabel = GENERIC_FILE.test(fileBase.replace(/\.[^.]+$/, "")) ? parent : fileBase;
      const { name, size, key } = parseLabel(s.useFolder ? parent : fileLabel);
      const folder = parseLabel(parent);
      let useKey = key || folder.key;
      let useName = name || folder.name;
      const fix = LABEL_FIX[useKey] ?? LABEL_FIX[folder.key];
      if (fix) useName = fix.name;

      // tie the picture to a price-list product by its reference name (cover / file / folder)
      let matched = prices.get(alnum(useName));
      if (!matched) {
        let best = { score: 0, e: null };
        for (const e of prices.values())
          for (const l of s.useFolder ? [useName, parent] : [useName, parent, fileBase.replace(/\.[^.]+$/, "")]) {
            const sc = similarity(letters(e.name), letters(l));
            if (sc > best.score) best = { score: sc, e };
          }
        if (best.score >= 0.84) {
          matched = best.e;
          report.fuzzy.push(`[${cat}] "${useName}" (${fileBase}) → price list "${best.e.name}" (${best.score.toFixed(2)})`);
        }
      }
      // the PRINTED pack name wins for display; the price list only supplies the prices
      const display = fix?.name ?? matched?.name ?? useName;
      const gk = matched ? alnum(matched.name) : alnum(display);

      const g = groups.get(gk) ?? { name: display, sizes: [], images: [], group: s.group, priced: matched ?? null };
      if (matched) g.priced = matched;
      const sz = size ?? folder.size ?? fix?.size ?? null; // the file name may omit the size its folder carries
      const rel = path.relative(base, file).split(path.sep).join("/").toLowerCase();
      if (sz && !g.sizes.includes(sz)) g.sizes.push(sz);
      g.images.push({ file, size: sz, rawName: fileBase, front: !!s.fronts?.has(rel), brand: s.brand });
      groups.set(gk, g);
    }
  }

  // price-list products that have no picture are still catalogue products
  for (const [k, e] of prices) {
    if (!groups.has(k)) {
      groups.set(k, { name: e.name, sizes: [], images: [], noPicture: true, priced: e });
      report.priceOnly.push(`[${cat}] ${e.name}`);
    }
  }

  const products = [];
  const seenIds = new Set();
  const nameFix = (n) => titleCase(n).replace(/\bUd\b/, "UD").replace(/\bFs-/, "FS-").replace(/\bHm\b/, "HM");

  for (const g of [...groups.values()].sort((a, b) => a.name.localeCompare(b.name))) {
    let id = slug(g.name);
    for (let n = 2; seenIds.has(id); n++) id = `${slug(g.name)}-${n}`;
    seenIds.add(id);
    const priced = g.priced ?? null;

    const sizes = [...new Set([...g.sizes, ...(priced ? priced.sizes.keys() : [])])].sort(bySize);

    let image, full, gallery, refName;
    if (g.images.length) {
      // Card image = front of the smallest picture size. Every image (sizes / views) goes into the modal gallery.
      const picSizes = [...g.sizes].sort(bySize);
      g.images.sort((a, b) => Number(b.front) - Number(a.front)); // fronts first (stable)
      const primary =
        g.images.find((i) => i.size === picSizes[0] && i.front) ??
        g.images.find((i) => i.size === picSizes[0]) ??
        g.images.find((i) => i.front) ??
        g.images[0];
      const redo = !ONLY_PRODUCTS || ONLY_PRODUCTS.includes(g.name);
      if (redo) await processImage(primary.file, outDir, id);
      image = `/products/${cat}/${id}.webp`;
      full = `/products/${cat}/${id}-full.webp`;
      gallery = [{ size: primary.size, src: full }];
      let k = 1;
      for (const im of g.images) {
        if (im === primary) continue;
        const aid = `${id}-${k++}`;
        if (redo) await processImage(im.file, outDir, aid, { thumb: false });
        gallery.push({ size: im.size, src: `/products/${cat}/${aid}-full.webp` });
      }
      if (gallery.length === 1) gallery = undefined;
      refName = primary.rawName;
    }

    // cross-checks between pictures and price list (sizes)
    if (priced && g.images.length) {
      for (const s of g.sizes) if (!priced.sizes.has(s)) report.sizeNoPrice.push(`[${cat}] ${g.name}: picture for ${s} but no price`);
      for (const s of priced.sizes.keys()) if (!g.sizes.includes(s) && g.sizes.length) report.sizeNoPicture.push(`[${cat}] ${g.name}: price for ${s} but no picture of that size`);
    }
    if (!priced && prices.size) report.noPrice.push(`[${cat}] ${g.name}`);

    const fx = facts[g.name] ?? {};
    const sizeLabels = sizes;
    const label = (s) => s;
    products.push({
      id,
      name: g.name === g.name.toLowerCase() || g.name === g.name.toUpperCase() ? nameFix(g.name) : g.name,
      tagline: fx.tagline ?? tagline(cat, g.name, sizeLabels),
      packing: sizeLabels,
      sizes: sizeLabels,
      comp: fx.comp ?? [],
      dosage: fx.dosage ?? "",
      chars: fx.chars ?? [],
      company: priced?.company ?? g.images[0]?.brand,
      group: g.group ?? formGroup(g.name, sizes),
      // prices are intentionally NOT published (client request); they stay in data/prices/*.json
      image,
      full,
      gallery: gallery?.map((x) => ({ size: x.size ? label(x.size) : null, src: x.src })),
      ref: refName,
    });
    console.log(`  ${cat}/${id}  ← ${g.images.length} img  ${sizeLabels.join(", ") || "-"}  ${priced ? "₨" + [...priced.sizes.values()].join("/") : "no price"}`);
  }

  products.sort((a, b) => a.name.localeCompare(b.name));
  const v = crypto.createHash("sha1").update(JSON.stringify(products)).digest("hex").slice(0, 10);
  fs.mkdirSync("public/data", { recursive: true });
  fs.writeFileSync(path.join("public", "data", `${cat}.json`), JSON.stringify({ v, category: cat, products }));
  return { count: products.length, v };
}

const metaPath = "data/meta.json";
const verPath = "data/versions.json";
const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
const vers = JSON.parse(fs.readFileSync(verPath, "utf8"));
const reportPath = "data/ingest-report.json";
const report = fs.existsSync(reportPath) && only ? JSON.parse(fs.readFileSync(reportPath, "utf8")) : {};
const cats = only ? [only] : [...new Set([...SOURCES.map((s) => s.category), ...fs.readdirSync("data/prices").map((f) => JSON.parse(fs.readFileSync(path.join("data/prices", f), "utf8")).category)])];
for (const cat of cats) {
  console.log(`== ${cat}`);
  const rep = { fuzzy: [], priceOnly: [], noPrice: [], sizeNoPrice: [], sizeNoPicture: [], warnings: [] };
  const r = await buildCategory(cat, rep);
  meta[cat] = r.count;
  vers[cat] = r.v;
  report[cat] = rep;
}
// categories with no pictures and no price list stay in the menu as "Coming soon" — never an invented count
for (const cat of ["poultry", "large", "pets", "human", "cosmetics"]) {
  if (!cats.includes(cat) && !fs.existsSync(path.join("public", "data", `${cat}.json`))) {
    const v = "empty";
    fs.mkdirSync("public/data", { recursive: true });
    fs.writeFileSync(path.join("public", "data", `${cat}.json`), JSON.stringify({ v, category: cat, products: [] }));
    meta[cat] = 0;
    vers[cat] = v;
  }
}
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 1));
fs.writeFileSync(verPath, JSON.stringify(vers, null, 1));
fs.writeFileSync(reportPath, JSON.stringify(report, null, 1));
console.log("done", meta);
