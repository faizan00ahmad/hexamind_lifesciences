"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, WA, type CategoryId, type Product } from "@/lib/site";

export default function ProductModal({
  cat,
  product,
  onClose,
}: {
  cat: CategoryId;
  product: Product;
  onClose: () => void;
}) {
  const [size, setSize] = useState(product.sizes[0] ?? product.packing[0] ?? "");
  const [view, setView] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Every render of the product (other sizes, front/back) — show the ones that belong to the selected size.
  const main = product.full || product.image || "";
  const gallery = product.gallery ?? (main ? [{ size: null, src: main }] : []);
  const forSize = gallery.filter((g) => !size || g.size === size || g.size == null);
  const list = forSize.length ? forSize : gallery;
  const img = list.length ? (view && list.some((l) => l.src === view) ? view : list[0].src) : "";

  const msg = encodeURIComponent(
    `Hi, I'm interested in ordering *${product.name}*${size ? " (" + size + ")" : ""} from Hexamind Life Sciences. Please provide pricing and availability.`,
  );

  return (
    <div className="modal-bg open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal">
        <button className="m-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="m-grid">
          <div className="m-img">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={product.name} style={{ objectFit: "contain" }} />
            ) : (
              <div className="m-noimg"><span>{product.name}</span></div>
            )}
            <div className="m-cat">{CATEGORIES[cat].label}</div>
            {list.length > 1 && (
              <div className="m-thumbs">
                {list.map((l) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={l.src} src={l.src} alt="" className={l.src === img ? "on" : ""} onClick={() => setView(l.src)} />
                ))}
              </div>
            )}
          </div>
          <div className="m-body">
            <div>
              <div className="m-label">Product Details</div>
              <div className="m-title">{product.name}</div>
              <div className="m-tagline">{product.tagline}</div>
            </div>
            <div className="m-row">
              <div className="m-row-ico">📦</div>
              <div><div className="m-row-lbl">Packing</div><div className="m-row-val">{product.packing.join(" · ")}</div></div>
            </div>
            {product.comp.length > 0 && (
              <div className="m-row">
                <div className="m-row-ico">🧪</div>
                <div>
                  <div className="m-row-lbl">Composition</div>
                  <div className="comp-pills">{product.comp.map((c) => <span key={c} className="comp-pill">{c}</span>)}</div>
                </div>
              </div>
            )}
            {product.dosage && (
              <div className="m-row">
                <div className="m-row-ico">💉</div>
                <div><div className="m-row-lbl">Dosage</div><div className="m-row-txt">{product.dosage}</div></div>
              </div>
            )}
            {product.chars.length > 0 && (
              <div className="m-row">
                <div className="m-row-ico">✓</div>
                <div>
                  <div className="m-row-lbl">Characteristics</div>
                  <div className="chars">
                    {product.chars.map((c) => (
                      <div className="char" key={c}><div className="char-dot"></div><span>{c}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {product.sizes.length > 1 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10 }}>Available Sizes</div>
                <div className="m-sizes">
                  {product.sizes.map((s) => (
                    <button key={s} className={`m-size${s === size ? " on" : ""}`} onClick={() => { setSize(s); setView(null); }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <button className="m-wa" onClick={() => window.open(`https://wa.me/${WA}?text=${msg}`, "_blank")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
              <span>Order on WhatsApp{size ? ` — ${size}` : ""}</span>
            </button>
            <p className="m-mfg">Manufactured by <strong>Hexamind Life Sciences (Pvt) Ltd.</strong> · GMP Certified · Vehari, Punjab, Pakistan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
