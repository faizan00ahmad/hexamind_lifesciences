import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import CertCards from "@/components/CertCards";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import meta from "@/data/meta.json";

const JOURNEY: [string, string][] = [
  ["The Spark", "Hexamind Life Sciences was born in 2021 with a bold mandate: to redefine human and animal well-being through uncompromised quality, relentless innovation, and manufacturing excellence. We looked at the traditional healthcare landscape and saw an opportunity to bridge the gap between nature, science, and everyday vitality."],
  ["The Hub", "Rooted in the Vehari Industrial Estates in Punjab, Pakistan, we built a high-standard, forward-thinking manufacturing ecosystem. From this strategic hub, we engineer products that meet both local demands and international expectations."],
  ["The Ecosystem", "Health is connected. That’s why we’ve developed a diverse, cross-industry portfolio spanning Human Healthcare (advanced alternative medicine designed for proactive wellness), Animal Health (targeted solutions keeping poultry, livestock, and companion animals thriving) and Personal Care (clean, innovative cosmetic formulations that elevate daily routines)."],
  ["The Standard", "For us, quality isn’t a goal—it’s our baseline. Every formulation that leaves our facility is backed by strict GMP compliance, ISO standards, and an obsession with continuous improvement. We don't just follow industry benchmarks; we push them forward."],
];

const MILESTONES: [string, string, string[]][] = [
  ["2020", "Vision & Infrastructure Development", ["Facility Planning: developed the blueprint for an advanced manufacturing facility dedicated to human and veterinary alternative medicines, alongside cosmetic formulations.", "Construction Begins: started building our manufacturing facility in Vehari Industrial Estates, Punjab, Pakistan."]],
  ["2021", "Company Incorporation & Veterinary Market Entry", ["Company Incorporation: established Hexamind Life Sciences (Pvt.) Ltd. for our journey in human and animal healthcare.", "Veterinary Portfolio Launch: introduced specialized formulations for poultry, livestock, and companion animals."]],
  ["2024", "Portfolio Expansion", ["Human Healthcare: expanded into human alternative medicines with our own portfolio of brands.", "Personal Care: introduced innovative cosmetic formulations, extending our portfolio into personal care."]],
  ["2025", "GMP Certification & Manufacturing Advancement", ["GMP Certification: achieved Good Manufacturing Practices certification for human and veterinary alternative medicines.", "Production Capabilities: commissioned dedicated, high-capacity manufacturing lines to support growth and international markets.", "Strategic Partnerships: strengthened collaboration with key partners, including Schiwo Pakistan, to broaden market reach and distribution."]],
];

const U = (id: string, w: number) => `https://images.unsplash.com/${id}?w=${w}&q=85`;

const n = (c: number) => (c > 0 ? `${c} products` : "coming soon");

export default function Home() {
  return (
    <div className="page active" id="page-home">
      <HeroSlider />

      <section className="about-intro" id="about-anchor">
        <Reveal className="about-intro-inner">
          <h2>Your Trusted Partner in Human and Animal Healthcare</h2>
          <p>Established in 2021, Hexamind Life Sciences (Pvt.) Ltd. specializes in manufacturing high-quality alternative medicine and cosmetic formulations. Our diverse portfolio spans human healthcare, poultry, livestock, companion animal, and personal care.</p>
          <p>Based in Vehari Industrial Estates, Punjab, Pakistan, we are committed to manufacturing excellence, delivering products that meet international quality benchmarks through strict adherence to GMP and applicable ISO standards.</p>
          <Link href="/#facility-anchor"><button className="btn-primary">Read More →</button></Link>
        </Reveal>
      </section>

      <section className="certs" id="quality-anchor">
        <div className="certs-inner">
          <div className="certs-title">Accreditation &amp; Certifications</div>
          <CertCards />
        </div>
      </section>

      <section className="dual-sec">
        <div className="dual-sec-inner">
          <Reveal className="dc-card" href="/products">
            <div className="dc-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={U("photo-1587854692152-cbe660dbde88", 1200)} alt="Products" /></div>
            <div className="dc-content">
              <div className="dc-ico">℞</div>
              <h3>Products</h3>
              <p>Specializing in pharmaceutical and veterinary formulations across five integrated divisions.</p>
              <ul className="dc-list">
                <li>Poultry — {n(meta.poultry)}</li>
                <li>Large Animals — {n(meta.large)}</li>
                <li>Pets — {n(meta.pets)} · Human — {n(meta.human)}</li>
                <li>Cosmetics — {n(meta.cosmetics)}</li>
              </ul>
              <a className="dc-arr">Browse Portfolio →</a>
            </div>
          </Reveal>
          <Reveal className="dc-card" delay={1}>
            <div className="dc-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={U("photo-1576671081837-49000212a370", 1200)} alt="R&D" /></div>
            <div className="dc-content">
              <div className="dc-ico">⚗</div>
              <h3>R&amp;D</h3>
              <p>An R&amp;D driven company manufacturing pharmaceutical and veterinary formulations focused on quality and innovation. Our research team continuously develops new products for emerging market needs.</p>
              <a className="dc-arr">Explore R&amp;D →</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="journey-sec">
        <div className="timeline-inner">
          <div className="section-head">
            <div className="label">Company Journey</div>
            <h2>Formulating the Future of Well-Being</h2>
          </div>
          <div className="journey-grid">
            {JOURNEY.map(([t, p], i) => (
              <Reveal key={t} className="jr-card" delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="jr-n">{String(i + 1).padStart(2, "0")}</div>
                <h3>{t}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="timeline-sec">
        <div className="timeline-inner">
          <div className="section-head">
            <div className="label">Milestones</div>
            <h2>The Evolution of Hexamind</h2>
          </div>
          <div className="timeline">
            {MILESTONES.map(([y, t, items], i) => (
              <Reveal key={y} className="tl-item" delay={i as 0 | 1 | 2 | 3}>
                <div className="tl-marker">{i + 1}</div>
                <div className="tl-year">{y}</div>
                <div className="tl-head">{t}</div>
                <ul className="tl-list">
                  {items.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mfg-sec" id="facility-anchor">
        <div className="mfg-inner">
          <div className="section-head">
            <div className="label">Manufacturing</div>
            <h2>Inside Our Facility</h2>
            <p className="sub">A single GMP-certified manufacturing campus in Vehari Industrial Estates — from R&amp;D through to export-ready packaging.</p>
          </div>
          <div className="mfg-grid">
            {[
              ["s4 r2", "photo-1532187863486-abf9dbad1b69", 1200, "Main Facility", "Main Manufacturing Plant", "GMP Certified · Vehari", 0],
              ["s2", "photo-1576671081837-49000212a370", 600, "R&D", "R&D Lab", "Research & Development", 1],
              ["s2", "photo-1563213126-a4273aed2016", 600, "QC", "Quality Control", "ISO Certified Lab", 2],
              ["s2", "photo-1615461066841-6116e61058f4", 600, "Production", "Production Floor", "Automated Lines", 0],
              ["s2", "photo-1554734867-bf3c00a49371", 600, "Packaging", "Packaging", "Export Ready", 1],
            ].map(([cls, id, w, alt, t, s, d]) => (
              <Reveal key={alt as string} className={`mfg-item ${cls}`} delay={d as 0 | 1 | 2}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={U(id as string, w as number)} alt={alt as string} loading="lazy" />
                <div className="mfg-item-ov"></div>
                <div className="mfg-item-cap"><div className="mfg-item-t">{t}</div><div className="mfg-item-s">{s}</div></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="facility-sec">
        <div className="facility-inner">
          <Reveal className="facility-card">
            <div className="facility-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={U("photo-1559526324-4b87b5e36e44", 1200)} alt="Facility" loading="lazy" /></div>
            <div className="facility-content">
              <div className="facility-ico">🏭</div>
              <h3>Manufacturing Facility</h3>
              <p>Empowering the swift production of essential pharmaceutical and veterinary products with the latest technological innovations across our GMP-certified plant.</p>
              <Link className="dc-arr" href="/#facility-anchor">Read More →</Link>
            </div>
          </Reveal>
          <Reveal className="facility-card" delay={1}>
            <div className="facility-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={U("photo-1542601906990-b4d3fb778b09", 1200)} alt="Sustainability" loading="lazy" /></div>
            <div className="facility-content">
              <div className="facility-ico">🌿</div>
              <h3>Sustainability</h3>
              <p>Committed to eco-friendly practices, Hexamind Life Sciences integrates sustainable methods in every step of production to protect both health and the environment.</p>
              <Link className="dc-arr" href="/contact">Read More →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="collab-sec">
        <div className="collab-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={U("photo-1576091160399-112ba8d25d1d", 2400)} alt="Lab" loading="lazy" /></div>
        <Reveal className="collab-inner">
          <h2>Collaborate With Us</h2>
          <p>Collaborate with a trusted industry leader committed to consistent excellence, innovative solutions, and reliable support from conception to commercialization by selecting Hexamind Life Sciences.</p>
          <Link href="/contact"><button className="btn-light">Contact Us Today →</button></Link>
        </Reveal>
      </section>

      <section className="global-sec" id="global-anchor">
        <div className="global-inner">
          <Reveal className="global-l">
            <div className="global-label">Exports</div>
            <h2>Global Presence &amp; Impact</h2>
            <p>We have become the manufacturer of choice for veterinary and pharmaceutical products globally, serving customers from all segments. Our ever-expanding customer network reflects our ability to offer international-quality products at market-leading prices.</p>
            <Link href="/contact"><button className="btn-primary">Read More →</button></Link>
          </Reveal>
          <Reveal className="global-r" delay={1}>
            <div className="global-map">
              <svg className="global-map-img" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                <rect width="800" height="400" fill="#e8edf6" />
                <path d="M50,150 Q200,80 350,140 T700,160 L750,250 L600,300 L400,320 L200,290 L50,250 Z" fill="#cdd5e6" stroke="#003087" strokeWidth="1" opacity=".4" />
                <circle cx="200" cy="180" r="8" fill="#C8102E" />
                <circle cx="200" cy="180" r="14" fill="#C8102E" opacity=".3" />
                <circle cx="350" cy="160" r="6" fill="#C8102E" />
                <circle cx="450" cy="180" r="6" fill="#C8102E" />
                <circle cx="550" cy="200" r="6" fill="#C8102E" />
                <circle cx="650" cy="170" r="6" fill="#C8102E" />
                <circle cx="120" cy="220" r="6" fill="#C8102E" />
                <text x="220" y="175" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }} fontSize="11" fontWeight="700" fill="#003087">Pakistan (HQ)</text>
              </svg>
              <div className="country-grid">
                {["Pakistan", "UAE", "Saudi Arabia", "Afghanistan", "Bangladesh", "Sri Lanka"].map((c) => (
                  <div className="country" key={c}>{c}</div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer full />
    </div>
  );
}
