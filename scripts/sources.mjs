// Which extracted Drive folder feeds which category. Paths are relative to D:\all apps\hexamind-src\.
// category: poultry | large | pets | human | cosmetics
//   skipFront : ignore files named "front.png" (blank pack template in the HINTS folders)
//   useFolder : the folder name is the product reference (file names are f.png / 1.png / back.png …)
import fs from "node:fs";

const fronts = (name) => new Set(JSON.parse(fs.readFileSync(`data/fronts-${name}.json`, "utf8")));

export const SOURCES = [
  { dir: "hints/HINTS LIFE SCIENCE", category: "poultry", brand: "Hint Life Sciences", skipFront: true },
  { dir: "schiwo/Schiwo", category: "poultry", brand: "Schiwo Pakistan", useFolder: true, fronts: fronts("schiwo"), skipDirs: [/^roxin 100ml\//i] /* identical to Live-Stock Roxin 100ml */ },
  { dir: "ushnaz/USHNAZ PRODUCTS", category: "poultry", brand: "USHNAZ Pharmaceuticals", useFolder: true, skipFront: true },
  { dir: "humanpharma/Human Pharma", category: "human", brand: "Schiwo Pakistan" },
  { dir: "livestock/Live-Stock", category: "large", brand: "Schiwo Pakistan", useFolder: true, fronts: null },
];

// QC: names as PRINTED on the pack covers, where the file/folder name differs from the cover.
// key = parseLabel() key of the folder (or file) name; size is only used when the name carries none.
export const LABEL_FIX = {
  // poultry (HINTS)
  aglofine10: { name: "Aglofin-10" },
  cenrox: { name: "Cerox" },
  diccorex: { name: "Dicorex" },
  dicorex: { name: "Dicorex" },
  javit: { name: "Jolvit" },
  jolvit: { name: "Jolvit" },
  kimchinzyme: { name: "Kimchizyme" },
  vitalboots: { name: "Vital Boost" },
  // large animals (Live-Stock)
  breedrout: { name: "Breed Route", size: "300 gm" },
  clotex: { name: "Clotex", size: "240 ml" },
  hinfox100mg: { name: "Hindox", size: "100 gm" },
  hmcalcocare: { name: "HM Calco Care" },
  lactolvil: { name: "Lactovil" },
  lactovil: { name: "Lactovil" },
  nutristan: { name: "Nutrisan" },
  salbon: { name: "Sablon" },
  parturon300mg: { name: "Parturon", size: "300 gm" },
  spicora300mg: { name: "Spicora", size: "300 gm" },
  saniplex: { name: "Saniplex", size: "25 Kg" },
  // poultry (Schiwo) — folder spellings vs the printed pack names
  mintovit: { name: "Minrovit" },
  immunonshiled: { name: "Immuno Shield" },
  electralcal: { name: "Electral" },
  lushbon5li: { name: "Lushbon", size: "5 Ltr" },
  woxin: { name: "Woxin-10" },
  respierx: { name: "Respirex" },
  butyricid: { name: "Butyricid Plus" },
  butyricadplus: { name: "Butyricid Plus" },
  butyricidpluse: { name: "Butyricid Plus" },
  // poultry (USHNAZ) — printed names
  choliforte: { name: "Choli Forte" },
  kimshield: { name: "Kimshield" },
  kimshileld: { name: "Kimshield" },
  udplus: { name: "UD Plus" },
  udplua: { name: "UD Plus" },
  upplus: { name: "UD Plus" },
  stimax10: { name: "Stimax-10" },
  carbofur1x12: { name: "Carbofur", size: "1 Kg" },
};

// Preferred front image per folder (lower-case path below the source dir). Everything else becomes an extra view.
// Needed because file names lie: e.g. "saniplex/back.png" carries the label, "Lactolvil 5kg/2.png" is the label, "f.png" is blank.
const LIVESTOCK_FRONTS = new Set([
  "clotex/c1.png",
  "folinex 1kg/folinex 1kg .png",
  "hinfox 100mg/hindox 100mg.png",
  "hm calco care120ml/untitled.png",
  "lactolvil 25kg/f.png",
  "lactolvil 5kg/2.png",
  "lactovil 1kg/1.png",
  "lactozen 1kg/lactozen 1kg .png",
  "neurantic 1kg/1.png",
  "nutrilon 1kg/nutrilon 1kg .png",
  "nutrisan 100gm/ch.png",
  "nutristan 500gm/fnt.png",
  "opolo 100gm/untitled.png",
  "parturon 300mg/parturon 300mg.png",
  "roxin 100ml/untitled.png",
  "sablon 100gm/1.png",
  "salbon 500gm/front.png",
  "saniplex/back.png",
  "saniplex 25kg/1.png",
  "spicora 300mg/spicora.front  300mg.png",
  "zinax 100ml/f.png",
  "zinax 1l/2.png",
]);

// livestock picks are curated by hand (see above); attach them to the source
SOURCES.find((x) => x.dir.startsWith("livestock")).fronts = LIVESTOCK_FRONTS;
