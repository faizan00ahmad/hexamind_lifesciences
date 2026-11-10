import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryTabs from "@/components/CategoryTabs";
import Footer from "@/components/Footer";
import ProductBrowser from "@/components/ProductBrowser";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/site";
import meta from "@/data/meta.json";
import versions from "@/data/versions.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_IDS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = CATEGORIES[category as CategoryId];
  return c ? { title: `${c.title.join(" ")} | Hexamind Life Sciences`, description: c.sub } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = category as CategoryId;
  const c = CATEGORIES[cat];
  if (!c) notFound();
  const count = (meta as Record<string, number>)[cat];
  const version = (versions as Record<string, string>)[cat];

  return (
    <div className="page active">
      <div className="ph">
        <div className="ph-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={c.heroImg} alt={c.label} /></div>
        <div className="ph-inner">
          <div className="bc">
            <Link href="/"><span>Home</span></Link>
            <span><span className="bc-sep">/</span><Link href="/products"><span>Products</span></Link></span>
            {c.crumb.map((x) => (
              <span key={x.label}>
                <span className="bc-sep">/</span>
                {x.href ? <Link href={x.href}><span>{x.label}</span></Link> : <span>{x.label}</span>}
              </span>
            ))}
          </div>
          <h1>{c.title[0]} <span className="accent">{c.title[1]}</span></h1>
          <p className="ph-sub">{c.sub}</p>
          <div className="ph-stats">
            {count > 0 ? (
              <div><div className="ph-stat-n">{count}<span className="accent">.</span></div><div className="ph-stat-l">Products</div></div>
            ) : (
              <div><div className="ph-stat-n">Soon<span className="accent">.</span></div><div className="ph-stat-l">Range in preparation</div></div>
            )}
            <div><div className="ph-stat-n">GMP</div><div className="ph-stat-l">Certified</div></div>
          </div>
        </div>
      </div>
      <CategoryTabs active={cat === "human" || cat === "cosmetics" ? cat : cat} />
      <section className="sec">
        <div className="sec-inner">
          <ProductBrowser cat={cat} version={version} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
