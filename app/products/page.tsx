import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { MAIN_PAGES } from "@/lib/site";
import meta from "@/data/meta.json";

export const metadata = {
  title: "Products | Hexamind Life Sciences",
  description: "Browse Hexamind's Animal Health, Human Health and Cosmetics products.",
};

export default function ProductsPage() {
  const counts = meta as Record<string, number>;
  return (
    <div className="page active">
      <div className="ph">
        <div className="ph-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=2400&q=85" alt="Products" /></div>
        <div className="ph-inner">
          <div className="bc"><Link href="/"><span>Home</span></Link><span className="bc-sep">/</span><span>Products</span></div>
          <h1>Our <span className="accent">Products</span></h1>
          <p className="ph-sub">Explore our diverse range of healthcare solutions across five specialized divisions.</p>
        </div>
      </div>
      <CategoryTabs />
      <section className="sec">
        <div className="sec-inner">
          <div className="cat-grid">
            {MAIN_PAGES.map((m, i) => {
              const total = m.members.reduce((n, c) => n + (counts[c] ?? 0), 0);
              return (
                <Reveal key={m.id} className="cat-card" delay={(i % 3) as 0 | 1 | 2} href={m.href}>
                  <div className="dc-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={m.heroImg.replace("w=2400", "w=900")} alt={m.label} loading="lazy" /></div>
                  <div className="dc-content">
                    <h3>{m.label}</h3>
                    <p>{m.sub}</p>
                    <div className="cat-count">{total > 0 ? `${total} products` : "Coming soon"}</div>
                    <span className="dc-arr">Browse {m.label} →</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
