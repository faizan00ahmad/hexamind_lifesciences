"use client";

import { useEffect, useState } from "react";
import { CERT_COMMON as C, CERTS, type Cert } from "@/lib/certs";
import Reveal from "./Reveal";

// Certificate pictures shown directly. Hover (or keyboard focus) pops the key details out of the picture;
// click opens the full-size certificate with every detail and the scope of registration.
export default function CertCards() {
  const [open, setOpen] = useState<Cert | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="gmp-strip">
        <span className="cert-ico">GMP</span>
        <div>
          <b>GMP Certified</b>
          <span>Good Manufacturing Practices certification for human and veterinary alternative medicines · 2025</span>
        </div>
      </div>

      <div className="cert-pics">
        {CERTS.map((c, i) => (
          <Reveal key={c.id} className="cert-pic" delay={(i % 4) as 0 | 1 | 2 | 3}>
            <button type="button" className="cert-pic-btn" onClick={() => setOpen(c)} aria-label={`${c.standard} certificate — view details`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/certs/${c.id}-thumb.jpg`} alt={`${c.standard} Certificate of Registration`} loading="lazy" />
              <span className="cert-pop">
                <b>{c.standard}</b>
                <em>{c.title}</em>
                <span>Certificate # {c.number}</span>
                <span>Registered by {C.registrar}</span>
                <span>Valid until {C.expiry}</span>
                <i>Click to enlarge ⤢</i>
              </span>
            </button>
            <div className="cert-cap">
              <b>{c.standard}</b>
              <span>Cert. # {c.number} · valid to {C.expiry}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="scope-box">
        <div className="scope-t">Scope of registration</div>
        <div className="scope-h">{C.scopeTitle}</div>
        <div className="scope-chips">
          {C.scope.map((s) => <span key={s} className="comp-pill">{s}</span>)}
        </div>
      </div>

      {open && (
        <div className="modal-bg open" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="modal-backdrop" onClick={() => setOpen(null)}></div>
          <div className="modal cert-modal">
            <button className="m-close" onClick={() => setOpen(null)} aria-label="Close">✕</button>
            <div className="cert-m-grid">
              <a className="cert-m-img" href={`/certs/${open.id}.jpg`} target="_blank" rel="noreferrer" title="Open full size">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/certs/${open.id}.jpg`} alt={`${open.standard} Certificate of Registration`} />
              </a>
              <div className="cert-m-body">
                <div className="m-label">Certificate of Registration</div>
                <div className="m-title">{open.standard}</div>
                <div className="m-tagline">{open.title}</div>
                <div className="cert-grid">
                  <div><span>Registered company</span><b>{C.holder}</b></div>
                  <div><span>Address</span><b>{C.address}</b></div>
                  <div><span>Certificate no.</span><b>{open.number}</b></div>
                  <div><span>Registered by</span><b>{C.registrar}</b></div>
                  <div><span>Accreditation</span><b>{C.accreditation} · {open.pnac}</b></div>
                  <div><span>Initial assessment</span><b>{C.assessed}</b></div>
                  <div><span>Registration date</span><b>{C.registered}</b></div>
                  <div><span>Re-issue date</span><b>{C.reissued}</b></div>
                  <div><span>Expiry date</span><b>{C.expiry}</b></div>
                </div>
                <div className="m-row-lbl" style={{ marginTop: 18 }}>Scope</div>
                <p className="m-row-txt" style={{ marginBottom: 8 }}><b>{C.scopeTitle}</b></p>
                <div className="comp-pills">{C.scope.map((s) => <span key={s} className="comp-pill">{s}</span>)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
