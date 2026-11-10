# Hexamind Life Sciences — website

Next.js (App Router) static site built from the approved prototype. **No backend**: product data ships as JSON,
is kept in the visitor's browser (localStorage + service-worker cache) and inquiries are saved in the browser and sent to WhatsApp.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/   (deploy the folder anywhere)
node scripts/qc.mjs   # catalogue audit (counts, prices, images, duplicates)
```

## Pages
`/` home · `/products` category cards · `/poultry` `/large` `/pets` `/human` `/cosmetics` (12 products per page, search, form filter) · `/contact`.
The **Products** menu item is a dropdown of the five categories; each category page also has the category tab bar.

## Where the catalogue comes from
| Source (Google Drive) | Category | Price list |
|---|---|---|
| `HINTS LIFE SCIENCE.zip` | Poultry | `Updated-2.pdf` p.3 (HINT Life Sciences) |
| `Schiwo.zip` | Poultry | `Updated-2.pdf` p.1 (Schiwo Pakistan) |
| `USHNAZ PRODUCTS.zip` | Poultry | `Updated-2.pdf` p.4 (USHNAZ Pharmaceuticals) |
| `Live-Stock.zip` | Large Animals | `Updated-2.pdf` p.2 (Schiwo Livestock) |
| `Human Pharma.zip` | Human | `Human Pharma List.jpeg` |
| — | Pets, Cosmetics | no pictures or prices supplied → "Coming soon" |

Product **names are the ones printed on the pack covers** (checked by eye and by OCR), not the folder names.
Prices are per pack size, transcribed from the price lists into `data/prices/*.json`.
Cover facts (composition / usage) are in `data/facts/*.json` — only text legible on the packs.

## Rebuilding the catalogue (after new pictures / prices)
1. Unzip the Drive files into `D:\all apps\hexamind-src\<name>\` (see `scripts/sources.mjs`).
2. Edit `data/prices/*.json` (rows are `[name, packing, price]`).
3. `node scripts/ingest.mjs [category]` — crops/optimises every render to WebP, writes `public/data/<category>.json`,
   `data/meta.json` (page totals) and `data/ingest-report.json` (what matched, what is price-only, size mismatches).
4. `node scripts/qc.mjs`.

Helper scripts: `ocr-prep.mjs` + `ocr.ps1` (Windows OCR of every pack), `classify.mjs` (category cues from OCR),
`contact-sheet.mjs` (visual review sheets), `pick-fronts.mjs`.

## Certificates
`public/certs/gmp.png` (GMP logo, first card) and `iso-9001|14001|45001.jpg` (+ thumbs) are shown on the home page; details in `lib/certs.ts`.

## Poultry page
Grouped by company (Schiwo, Hint Life, Ushnaz — order set in `COMPANIES`, `lib/site.ts`). Each page holds one company; the company comes from the price-list file (`company` in `data/prices/*.json`).

## Product pages
Three main pages: Animal Health (`/animal-health`, with sub-pages Poultry `/poultry`, Livestock `/large`, Pet `/pets`), Human Health (`/human`), Cosmetics (`/cosmetics`). Hierarchy defined in `MAIN_PAGES` / `ANIMAL_IDS` (`lib/site.ts`); the tab bar shows the three main pages, or the three Animal Health sub-pages when you are on one of them.

## Products menu
Animal Health (Poultry / Livestock / Pet) · Human Health · Cosmetics — fly-out on desktop, nested accordions on mobile (`components/Header.tsx`).

## Contact form
Inquiries are emailed to info@hexamindlifesciences.com through FormSubmit (`components/ContactForm.tsx`, `INQUIRY_EMAIL`). The first message ever sent makes FormSubmit email a one-time activation link to that inbox — click it once, then every inquiry arrives as a table email with the visitor's address as reply-to. A copy is also kept in the visitor's browser.
