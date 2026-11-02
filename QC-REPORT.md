# Catalogue QC report

Method: every picture was opened and its **printed pack cover read twice** (by eye on contact sheets, and by Windows OCR — `data/ocr-report.json`);
names are the ones printed on the packs. Prices were transcribed per pack size from `Updated-2.pdf` (4 price lists) and `Human Pharma List.jpeg`,
then sanity-checked (larger packs are never dearer per unit — `scripts/qc.mjs` flags any that are). Audit result: **0 errors**.

## Products per file
| Drive file | Pictures | Distinct products | Category | Price list |
|---|---:|---:|---|---|
| HINTS LIFE SCIENCE.zip | 41 (2 blank bag templates ignored) | **24** | Poultry | HINT Life Sciences (p.3) – 24/24 priced |
| Schiwo.zip | 129 (3 identical to Live-Stock Roxin 100 ml ignored) | **35** with pictures (+3 price-list-only) | Poultry | Schiwo Pakistan (p.1) – 38 rows |
| USHNAZ PRODUCTS.zip | 39 (2 blank bag templates ignored) | **22** | Poultry | USHNAZ (p.4) – 22/22 priced |
| Live-Stock.zip | 52 | **23** | Large animals | Schiwo Livestock (p.2) – 23/23 priced |
| Human Pharma.zip | 16 | **15** | Human | Human Pharma List.jpeg – 15/15 priced |
| Updated-2.pdf / Human Pharma List.jpeg | – | price lists | – | – |

Website totals: **Poultry 84 · Large animals 23 · Human 15 · Pets 0 · Cosmetics 0 = 122 products** (277 pictures).
Pets and cosmetics: nothing in any of the files → pages show "Coming soon" (no invented numbers).

## Corrections made by reading the covers (folder/file name → printed name)
aglofine → Aglofin-10 · cenrox → Cerox · diccorex → Dicorex · javit/jolvit → Jolvit · KIMCHINZYME → Kimchizyme · Vital boots → Vital Boost ·
lactolvil → Lactovil · salbon → Sablon · nutristan → Nutrisan · hINFOX → Hindox · Breed rout → Breed Route · MINTOVIT → Minrovit ·
IMMUNON SHILED → Immuno Shield · Phytongain → Phytogain · Respierx → Respirex · butyricad/butyricid → Butyricid Plus · electralcal → Electral ·
lushbom → Lushbon · woxin → Woxin-10 · kimshileld → Kimshield · "UD plua / up plus" → UD Plus.
Prototype taglines for Sablon, Pershing, Nutricrypt, Calphomin were **contradicted by the packs** and were not reused.

## Price list vs pictures — please confirm
* **Price-list products with no picture** (shown with a placeholder, priced): Cytozyme, Prolivit, Narmix.
* **Pack size pictured but not on the price list** (no price shown for that size): Allium Plus 5 Ltr, Kimshield 5 Ltr, Metalax 12 Kg, Nutricrypt 12 Kg, Sablon 12 Kg (HINT).
* **Price listed but no picture of that size** (price shown, main picture used): Allium Plus 10 Ltr, Hyflex 5 Kg, Kimchizyme 5 Ltr, Metalax 1 Kg, Nutricrypt 1 Kg, Rexido 5 Kg, Roxin 5 Ltr, Zorex 10 Ltr.
* **Spelling differences** (pack name used, price list name matched): CHOLI FORTE (list: Choli Fort), KIMSHIELD (list: Kim Shield), Vita Glow / VITA GLOW.
* Same name in two categories, separate packs and prices (intentional): Nutrisan, Roxin, Sablon (poultry and large animals).
* `Updated-2.pdf` is a phone scan — figures were read at 3× zoom; a second pair of eyes on page 1 (38 rows) is worthwhile.

## Not available in the supplied files
Composition/dosage for most poultry products (printed in very small type) — only legible cover text is shown; add on request.
