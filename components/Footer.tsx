import Link from "next/link";

export default function Footer({ full = false }: { full?: boolean }) {
  return (
    <footer>
      <div className="ft-top">
        <div>
          <div className="fb-logo">Hexamind</div>
          <div className="fb-tag">Life Sciences (Pvt) Ltd.</div>
          <div className="fb-addr">
            <strong>Address</strong>
            Plot No. 88/89, Vehari Industrial Estates,<br />Vehari, Punjab, Pakistan
          </div>
          <div className="fb-contact">+92 61 6775815</div>
          <div className="fb-contact">info@hexamindlifesciences.com</div>
        </div>
        <div className="fc">
          <h4>Navigation</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#facility-anchor">Manufacturing</Link></li>
            <li><Link href="/#quality-anchor">Quality</Link></li>
            <li><Link href="/#global-anchor">Exports</Link></li>
          </ul>
        </div>
        <div className="fc">
          <h4>Products</h4>
          <ul>
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/poultry">Poultry Products</Link></li>
            <li><Link href="/large">Large Animals</Link></li>
            <li><Link href="/pets">Pet Products</Link></li>
            <li><Link href="/human">Human Health</Link></li>
            <li><Link href="/cosmetics">Cosmetics</Link></li>
          </ul>
        </div>
        <div className="fc">
          <h4>Stay Updated</h4>
          <ul>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/contact">Careers</Link></li>
            <li><Link href="/contact">News &amp; Events</Link></li>
          </ul>
        </div>
      </div>
      <div className="ft-bot">
        <div className="ft-copy">HEXAMIND LIFE SCIENCES PVT. LTD. ©2025{full ? " | All Rights Reserved" : ""}</div>
        <div className="ft-legal"><a>Terms of Use</a><a>Privacy Policy</a></div>
      </div>
    </footer>
  );
}
