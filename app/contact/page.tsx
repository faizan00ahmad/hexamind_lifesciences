import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export const metadata = { title: "Contact Us | Hexamind Life Sciences" };

export default function Contact() {
  return (
    <div className="page active">
      <div className="ph">
        <div className="ph-bg">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2400&q=85" alt="Contact" /></div>
        <div className="ph-inner">
          <div className="bc"><Link href="/"><span>Home</span></Link><span className="bc-sep">/</span><span>Contact</span></div>
          <h1>Contact <span className="accent">Us</span></h1>
          <p className="ph-sub">Speak to our team for product enquiries and distribution.</p>
        </div>
      </div>
      <section className="sec">
        <div className="sec-inner">
          <div className="ct-grid">
            <div>
              <div className="ic reveal vis"><div className="ic-ico">⊕</div><div><div className="ic-lbl">Address</div><div className="ic-val">Head Office</div><div className="ic-sub">Plot No. 88/89, Vehari Industrial Estates, Vehari, Punjab, Pakistan</div></div></div>
              <div className="ic reveal vis"><div className="ic-ico">℡</div><div><div className="ic-lbl">Phone</div><div className="ic-val">+92 61 6775815</div><div className="ic-sub">Mobile: +92 314 6151 383<br />Muhammad Tariq Sharif (CEO)</div></div></div>
              <div className="ic reveal vis"><div className="ic-ico">@</div><div><div className="ic-lbl">Email</div><div className="ic-val">info@hexamindlifesciences.com</div><div className="ic-sub">Response within 24 business hours</div></div></div>
              <div className="map reveal vis">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6904.735255293913!2d72.282837!3d30.083656!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393cbf1e7dc20153%3A0x93db1aabc5eda061!2sHexamind%20Life%20Sciences!5e0!3m2!1sen!2sus!4v1770579899288!5m2!1sen!2sus" allowFullScreen loading="lazy" />
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
