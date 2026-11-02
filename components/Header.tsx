"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES, CATEGORY_IDS } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const isProducts = pathname === "/products" || CATEGORY_IDS.some((c) => pathname === "/" + c);
  const [dd, setDd] = useState(false);

  return (
    <>
      <div className="top-strip">
        <div className="top-strip-l">
          <a><span>📍</span> Plot 88/89, Vehari, Punjab</a>
          <a><span>✆</span> +92 61 6775815</a>
          <a><span>✉</span> info@hexamindlifesciences.com</a>
        </div>
        <div className="top-strip-r">
          <a><span className="lang-dot"></span> EN</a>
        </div>
      </div>

      <nav id="nav">
        <Link className="n-logo" href="/">
          <div className="n-logo-mark">
            <svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 3 L18 7 L18 15 L11 19 L4 15 L4 7 Z" fill="none" stroke="#fff" strokeWidth="1.6" />
              <circle cx="11" cy="10" r="2.5" fill="#fff" />
              <path d="M11 12.4 L11 16" stroke="#fff" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="n-logo-text">
            <div className="n-logo-name">Hexamind</div>
            <div className="n-logo-sub">Life Sciences</div>
          </div>
        </Link>
        <ul className="n-links">
          <li><Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>
          <li><Link href="/#about-anchor">About Us</Link></li>
          <li><Link href="/#facility-anchor">Manufacturing</Link></li>
          <li
            className="n-dd"
            onMouseEnter={() => setDd(true)}
            onMouseLeave={() => setDd(false)}
            onKeyDown={(e) => e.key === "Escape" && setDd(false)}
          >
            <Link href="/products" className={isProducts ? "active" : ""} aria-haspopup="true" aria-expanded={dd} onClick={() => setDd(false)}>
              Products <span className="n-caret">▾</span>
            </Link>
            <div className={`n-dd-menu${dd ? " on" : ""}`}>
              {CATEGORY_IDS.map((c) => (
                <Link key={c} href={"/" + c} onClick={() => setDd(false)} className={pathname === "/" + c ? "active" : ""}>
                  {CATEGORIES[c].menu}
                </Link>
              ))}
            </div>
          </li>
          <li><Link href="/#global-anchor">Exports</Link></li>
          <li><Link href="/#quality-anchor">Quality</Link></li>
        </ul>
        <Link href="/contact"><button className="n-cta">Contact Us</button></Link>
        <button className={`n-burger${open ? " on" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`n-mobile${open ? " on" : ""}`}>
        <Link href="/" onClick={close}>Home</Link>
        <Link href="/#about-anchor" onClick={close}>About Us</Link>
        <Link href="/#facility-anchor" onClick={close}>Manufacturing</Link>
        <Link href="/products" onClick={close}>All Products</Link>
        {CATEGORY_IDS.map((c) => (
          <Link key={c} href={"/" + c} onClick={close} style={{ paddingLeft: 18, fontSize: 15 }}>
            {CATEGORIES[c].menu}
          </Link>
        ))}
        <Link href="/contact" onClick={close}>Contact Us</Link>
      </div>
    </>
  );
}
