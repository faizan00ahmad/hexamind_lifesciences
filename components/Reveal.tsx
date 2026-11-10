"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Scroll-reveal wrapper — replicates the prototype's .reveal / IntersectionObserver behaviour.
// The wrapper div is the styled element itself (pass the card class via className).
export default function Reveal({
  children,
  className = "",
  delay = 0,
  href,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
  href?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} reveal${delay ? " d" + delay : ""}`.trim()}
      style={style}
      onClick={href ? () => router.push(href) : undefined}
    >
      {children}
    </div>
  );
}
