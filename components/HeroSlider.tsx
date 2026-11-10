"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Headlines and descriptions from the client's "HEXAMIND WEBSITE.docx".
const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=2400&q=85",
    head: (
      <>
        A GMP-Certified <strong>Manufacturer</strong>
      </>
    ),
    sub: "A GMP-certified pharmaceutical manufacturer based in Pakistan, delivering high-quality formulations for human and animal health.",
  },
  {
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=2400&q=85",
    head: (
      <>
        Innovating at the Intersection of <strong>Human and Veterinary Medicine</strong>
      </>
    ),
    sub: "We apply cutting-edge biotechnology to address the world’s most significant medical challenges, supporting health, safety, and vitality for people and the animals they depend on.",
  },
];

export default function HeroSlider() {
  const [si, setSi] = useState(0);
  const [bg, setBg] = useState(SLIDES[0].img);
  const [fade, setFade] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const go = (i: number) => {
    setSi(i);
    setFade(0);
    setTimeout(() => {
      setBg(SLIDES[i].img);
      setFade(1);
    }, 400);
  };

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => go((si + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [si, paused, reduced]);

  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="hero-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="Manufacturing" style={{ opacity: fade }} fetchPriority="high" decoding="async" />
      </div>
      <div className="hero-inner">
        <div className="h-l">
          <div className="h-badge"><span className="h-badge-dot"></span>GMP Certified · ISO 9001 · 14001 · 45001</div>
          <div className="h-slider">
            {SLIDES.map((s, i) => (
              <div key={i} className={`h-slide${si === i ? " on" : ""}`} aria-hidden={si !== i}>
                <h1 className="h-headline">{s.head}</h1>
                <p className="h-sub" style={{ marginTop: 20 }}>{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="h-actions">
            <Link href="/poultry"><button className="btn-accent">Our Products →</button></Link>
            <Link href="/contact"><button className="btn-outline">Submit Inquiry</button></Link>
          </div>
          <div className="h-dots">
            {SLIDES.map((_, i) => (
              <button key={i} className={`h-dot${si === i ? " on" : ""}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
        <div className="h-r">
          <div className="h-side-stack">
            <div className="h-side-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=85" alt="Lab" />
            </div>
            <div className="h-side-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1563213126-a4273aed2016?w=600&q=85" alt="QC" />
            </div>
          </div>
        </div>
      </div>
      <button
        className="h-arrow"
        onClick={() => document.getElementById("about-anchor")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll down"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
    </section>
  );
}
