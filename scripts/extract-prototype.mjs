// One-off: pulls the PRODUCTS array out of the approved prototype so approved copy (taglines, dosage,
// characteristics) can be reused for products whose pictures match by name.
import fs from "node:fs";
import vm from "node:vm";

const src = process.argv[2];
const html = fs.readFileSync(src, "utf8");
const m = html.match(/const PRODUCTS = (\{[\s\S]*?\n\});\n\nconst CATS/);
if (!m) throw new Error("PRODUCTS block not found");
const PRODUCTS = vm.runInNewContext(`(${m[1]})`);
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/prototype-products.json", JSON.stringify(PRODUCTS, null, 1));
for (const [k, v] of Object.entries(PRODUCTS)) console.log(k, v.length);
