import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { ANIMAL_IDS, CATEGORIES, MAIN_PAGES } from "@/lib/site";
import meta from "@/data/meta.json";

const page = MAIN_PAGES[0];

export const metadata = {
  title: "Animal Health | Hexamind Life Sciences",
  description: page.sub,
};

export default function AnimalHealthPage() {
  const counts = meta as Record<string, number>;
  const total = ANIMAL_IDS.reduce((n, c) => n + (counts[c] ?? 0), 0);
  return (
    <div className="page active">
      <div className="ph">
        <div className="ph-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={page.heroImg} alt="Animal Health" /></div>
        <div className="ph-inner">
          <div className="bc">
            <Link href="/"><span>Home</span></Link>
            <span><span className="bc-sep">/</span><Link href="/products"><span>Products</span></Link></span>
            <span><span className="bc-sep">/</span><span>Animal Health</span></span>
          </div>
          <h1>Animal <span className="accent">Health</span></h1>
          <p className="ph-sub">{page.sub}</p>
          <div className="ph-stats">
            <div><div className="ph-stat-n">{total}<span className="accent">.</span></div><div className="ph-stat-l">Products</div></div>
            <div><div className="ph-stat-n">GMP</div><div className="ph-stat-l">Certified</div></div>
          </div>
        </div>
      </div>
      <CategoryTabs active="animal-health" />
      <section className="sec">
        <div className="sec-inner">
          <div className="cat-grid">
            {ANIMAL_IDS.map((c, i) => {
              const m = CATEGORIES[c];
              return (
                <Reveal key={c} className="cat-card" delay={(i % 3) as 0 | 1 | 2} href={"/" + c}>
                  <div className="dc-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={m.heroImg.replace("w=2400", "w=900")} alt={m.label} loading="lazy" /></div>
                  <div className="dc-content">
                    <h3>{m.menu}</h3>
                    <p>{m.sub}</p>
                    <div className="cat-count">{counts[c] > 0 ? `${counts[c]} products` : "Coming soon"}</div>
                    <span className="dc-arr">Browse {m.title[0]} →</span>
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
