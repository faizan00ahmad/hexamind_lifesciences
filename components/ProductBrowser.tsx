"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadCatalog } from "@/lib/catalogCache";
import { CATEGORIES, WA, priceLabel, type CategoryId, type Product } from "@/lib/site";
import ProductModal from "./ProductModal";

const PAGE_SIZE = 12;

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

  const filtered = useMemo(() => {
    if (!products) return [];
    const needle = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (group === "All" || p.group === group) &&
        (!needle || p.name.toLowerCase().includes(needle) || p.tagline.toLowerCase().includes(needle)),
    );
  }, [products, group, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, pages);
  const slice = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);

  // warm the browser cache with the next page's thumbnails
  useEffect(() => {
    filtered.slice(cur * PAGE_SIZE, (cur + 1) * PAGE_SIZE).forEach((p) => {
      if (p.image) new Image().src = p.image;
    });
  }, [filtered, cur]);

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

      <div className="prod-grid">
        {error && <div className="empty">Could not load products. Please refresh the page.</div>}
        {!products && !error && Array.from({ length: 8 }, (_, i) => <div key={i} className="pi-skel" />)}
        {products && slice.length === 0 && <div className="empty">No products match your search.</div>}
        {slice.map((p, i) => (
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
