"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadCatalog } from "@/lib/catalogCache";
import { CATEGORIES, COMPANIES, WA, priceLabel, type CategoryId, type Product } from "@/lib/site";
import ProductModal from "./ProductModal";

const PAGE_SIZE = 12;
const COMPANY_PAGE_MAX = 16; // company view: up to 4 full rows of 4 per page

function pageList(cur: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const lo = Math.max(2, cur - 1);
  const hi = Math.min(total - 1, cur + 1);
  if (lo > 2) out.push("…");
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < total - 1) out.push("…");
  out.push(total);
  return out;
}

export default function ProductBrowser({ cat, version }: { cat: CategoryId; version: string }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const [group, setGroup] = useState("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Product | null>(null);

  useEffect(() => {
    let alive = true;
    loadCatalog(cat, version)
      .then((d) => {
        if (!alive) return;
        setProducts(d.products);
        const p = Number(new URLSearchParams(location.search).get("page"));
        if (p > 0) setPage(p);
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [cat, version]);

  const groups = useMemo(() => {
    const set = new Set<string>();
    products?.forEach((p) => p.group && set.add(p.group));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  // Companies present in this category (poultry: Schiwo, Hint Life, Ushnaz) — drives the company sections.
  const companies = useMemo(() => {
    const present = new Set(products?.map((p) => p.company).filter(Boolean));
    return present.size > 1 ? COMPANIES.filter((c) => present.has(c.key)) : [];
  }, [products]);
  const rank = (p: Product) => {
    const i = COMPANIES.findIndex((c) => c.key === p.company);
    return i < 0 ? 99 : i;
  };

  const filtered = useMemo(() => {
    if (!products) return [];
    const needle = q.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (group === "All" || p.group === group) &&
        (!needle || p.name.toLowerCase().includes(needle) || p.tagline.toLowerCase().includes(needle)),
    );
    // grouped by company (client order), alphabetical inside each company
    return companies.length ? [...list].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name)) : list;
  }, [products, group, q, companies]);

  // Pages: with company sections every page holds ONE company; its products are split evenly across its pages
  // (e.g. 38 -> 13 + 13 + 12; 22 -> 11 + 11) so no page is left with a stray one or two cards.
  const pageGroups = useMemo(() => {
    if (!companies.length) {
      const out: Product[][] = [];
      for (let i = 0; i < filtered.length; i += PAGE_SIZE) out.push(filtered.slice(i, i + PAGE_SIZE));
      return out;
    }
    const out: Product[][] = [];
    for (const c of COMPANIES) {
      const list = filtered.filter((p) => p.company === c.key);
      if (!list.length) continue;
      const n = Math.ceil(list.length / COMPANY_PAGE_MAX);
      const base = Math.floor(list.length / n);
      const extra = list.length % n;
      let at = 0;
      for (let i = 0; i < n; i++) {
        const size = base + (i < extra ? 1 : 0);
        out.push(list.slice(at, at + size));
        at += size;
      }
    }
    return out;
  }, [filtered, companies]);

  const pages = Math.max(1, pageGroups.length);
  const cur = Math.min(page, pages);
  const slice = pageGroups[cur - 1] ?? [];

  const sections = useMemo(() => {
    if (!slice.length) return [];
    if (!companies.length) return [{ key: "all", title: "", total: 0, part: "", items: slice }];
    const key = slice[0].company;
    const c = COMPANIES.find((x) => x.key === key);
    const mine = pageGroups.filter((pg) => pg[0]?.company === key);
    const idx = mine.indexOf(slice);
    return [{ key: key ?? "other", title: c?.full ?? "Other", total: mine.flat().length, part: mine.length > 1 ? `Page ${idx + 1} of ${mine.length}` : "", items: slice }];
  }, [slice, pageGroups, companies]);

  // warm the browser cache with the next page's thumbnails
  useEffect(() => {
    (pageGroups[cur] ?? []).forEach((p) => {
      if (p.image) new Image().src = p.image;
    });
  }, [pageGroups, cur]);

  const go = useCallback((n: number) => {
    setPage(n);
    const url = new URL(location.href);
    if (n > 1) url.searchParams.set("page", String(n));
    else url.searchParams.delete("page");
    history.replaceState(null, "", url);
    document.getElementById("prod-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const meta = CATEGORIES[cat];

  if (products && products.length === 0) {
    return (
      <div className="soon">
        <div className="soon-ico">⏳</div>
        <h3>{meta.label} — coming soon</h3>
        <p>We are preparing this range for the website. For availability, pricing or a distribution enquiry, talk to our team directly.</p>
        <button
          className="btn-accent"
          onClick={() =>
            window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hi, I'd like to know about your ${meta.label} range.`)}`, "_blank")
          }
        >
          Enquire on WhatsApp →
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="prod-toolbar" id="prod-top">
        <div className="prod-toolbar-l">
          {products ? (
            <>Showing <b>{filtered.length}</b> products · {meta.toolbar}</>
          ) : (
            meta.toolbar
          )}
        </div>
        <div className="prod-toolbar-r">
          <input
            className="prod-search"
            placeholder="Search products…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          {groups.map((g) => (
            <button
              key={g}
              className={`pt-filter${g === group ? " on" : ""}`}
              onClick={() => {
                setGroup(g);
                setPage(1);
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="prod-grid"><div className="empty">Could not load products. Please refresh the page.</div></div>}
      {!products && !error && <div className="prod-grid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="pi-skel" />)}</div>}
      {products && slice.length === 0 && <div className="prod-grid"><div className="empty">No products match your search.</div></div>}
      {sections.map((sec) => (
        <section key={sec.key} className="co-sec">
          {sec.title && (
            <div className="co-head">
              <h3>{sec.title}</h3>
              <span>{sec.total} products{sec.part ? ` · ${sec.part}` : ""}</span>
            </div>
          )}
          <div className="prod-grid">
            {sec.items.map((p, i) => (
              <button className="pi" key={p.id} onClick={() => setOpen(p)}>
                <div className="pi-imgw">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="pi-img" src={p.image} alt={p.name} loading={i < 4 ? "eager" : "lazy"} decoding="async" />
                  ) : (
                    <div className="pi-img noimg" />
                  )}
                </div>
                <div className="pi-ov"></div>
                <div className="pi-b">
                  <div className="pi-n">{p.name}</div>
                  <div className="pi-t">{p.tagline}</div>
                  <div className="pi-meta">
                    <span className="pi-pack">{priceLabel(p) ?? p.packing[0]}</span>
                    <span className="pi-link">View →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {pages > 1 && (
        <div className="pager" role="navigation" aria-label="Pagination">
          <button className="pg-btn" disabled={cur === 1} onClick={() => go(cur - 1)}>← Prev</button>
          {pageList(cur, pages).map((n, i) =>
            n === "…" ? (
              <span key={"g" + i} className="pg-gap">…</span>
            ) : (
              <button key={n} className={`pg-btn${n === cur ? " on" : ""}`} onClick={() => go(n)}>{n}</button>
            ),
          )}
          <button className="pg-btn" disabled={cur === pages} onClick={() => go(cur + 1)}>Next →</button>
        </div>
      )}

      {open && <ProductModal cat={cat} product={open} onClose={() => setOpen(null)} />}
    </>
  );
}
