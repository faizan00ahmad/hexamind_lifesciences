"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORY_IDS } from "@/lib/site";

// Products menu: Animal Health (with three sub-categories), Human Health, Cosmetics.
const ANIMAL: { href: string; label: string }[] = [
  { href: "/poultry", label: "Poultry Products" },
  { href: "/large", label: "Livestock Products" },
  { href: "/pets", label: "Pet Products" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const [sub, setSub] = useState(false); // desktop: Animal Health fly-out
  const [mProducts, setMProducts] = useState(false); // mobile accordions
  const [mAnimal, setMAnimal] = useState(false);

  // close every menu when the page changes
  useEffect(() => {
    setOpen(false);
    setDd(false);
    setSub(false);
  }, [pathname]);

  const close = () => setOpen(false);
  const closeDd = () => {
    setDd(false);
    setSub(false);
  };
  const isAnimal = ANIMAL.some((a) => pathname === a.href);
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
          {/* animated Hexamind logo (plays once, then holds the finished mark) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="n-logo-anim" src="/logo-animated.webp" alt="" width={55} height={62} decoding="async" />
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
            onMouseLeave={closeDd}
            onKeyDown={(e) => e.key === "Escape" && closeDd()}
          >
            <Link href="/products" className={isProducts ? "active" : ""} aria-haspopup="true" aria-expanded={dd} onClick={closeDd}>
              Products <span className="n-caret">▾</span>
            </Link>
            <div className={`n-dd-menu${dd ? " on" : ""}`}>
              <div className="n-sub-wrap" onMouseEnter={() => setSub(true)} onMouseLeave={() => setSub(false)}>
                <Link
                  href="/poultry"
                  className={`n-sub-btn${isAnimal ? " active" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={sub}
                  onClick={closeDd}
                >
                  Animal Health <span className="n-caret">▸</span>
                </Link>
                <div className={`n-sub${sub ? " on" : ""}`}>
                  {ANIMAL.map((a) => (
                    <Link key={a.href} href={a.href} onClick={closeDd} className={pathname === a.href ? "active" : ""}>
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/human" onClick={closeDd} className={pathname === "/human" ? "active" : ""}>Human Health</Link>
              <Link href="/cosmetics" onClick={closeDd} className={pathname === "/cosmetics" ? "active" : ""}>Cosmetics</Link>
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
        <button type="button" className="n-acc" aria-expanded={mProducts} onClick={() => setMProducts(!mProducts)}>
          Products <span className={`n-acc-ic${mProducts ? " on" : ""}`}>▾</span>
        </button>
        <div className={`n-acc-panel${mProducts ? " on" : ""}`}>
          <button type="button" className="n-acc n-acc-2" aria-expanded={mAnimal} onClick={() => setMAnimal(!mAnimal)}>
            Animal Health <span className={`n-acc-ic${mAnimal ? " on" : ""}`}>▾</span>
          </button>
          <div className={`n-acc-panel n-acc-3${mAnimal ? " on" : ""}`}>
            {ANIMAL.map((a) => (
              <Link key={a.href} href={a.href} onClick={close}>{a.label}</Link>
            ))}
          </div>
          <Link href="/human" onClick={close} className="n-acc-link">Human Health</Link>
          <Link href="/cosmetics" onClick={close} className="n-acc-link">Cosmetics</Link>
        </div>
        <Link href="/contact" onClick={close}>Contact Us</Link>
      </div>
    </>
  );
}
