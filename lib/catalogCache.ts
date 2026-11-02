import type { CatalogFile, CategoryId } from "./site";

// Browser-side cache for the product data. There is no backend: each category's JSON ships with the site
// (public/data/<category>.json) and is kept in localStorage, keyed by the content hash `v` so it refreshes
// itself whenever the catalogue is rebuilt. An in-memory map avoids re-parsing within a session.

const mem = new Map<CategoryId, CatalogFile>();
const KEY = (c: CategoryId) => `hx:catalog:${c}`;

function readLocal(c: CategoryId): CatalogFile | null {
  try {
    const raw = localStorage.getItem(KEY(c));
    return raw ? (JSON.parse(raw) as CatalogFile) : null;
  } catch {
    return null;
  }
}

function writeLocal(c: CategoryId, data: CatalogFile) {
  try {
    localStorage.setItem(KEY(c), JSON.stringify(data));
  } catch {
    /* storage full or blocked — the service worker still caches the file */
  }
}

export async function loadCatalog(c: CategoryId, version: string): Promise<CatalogFile> {
  const hit = mem.get(c);
  if (hit && hit.v === version) return hit;

  const stored = readLocal(c);
  if (stored && stored.v === version) {
    mem.set(c, stored);
    return stored;
  }

  const res = await fetch(`/data/${c}.json?v=${version}`);
  if (!res.ok) throw new Error(`Failed to load ${c} catalogue`);
  const data = (await res.json()) as CatalogFile;
  mem.set(c, data);
  writeLocal(c, data);
  return data;
}

// ── Inquiries are saved in the browser too (no backend) ──
const INQ_KEY = "hx:inquiries";

export interface Inquiry {
  at: string;
  [field: string]: string;
}

export function saveInquiry(entry: Omit<Inquiry, "at">) {
  try {
    const list: Inquiry[] = JSON.parse(localStorage.getItem(INQ_KEY) || "[]");
    list.push({ at: new Date().toISOString(), ...entry });
    localStorage.setItem(INQ_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}
