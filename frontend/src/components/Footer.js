import Link from 'next/link';
import { IconShieldCheck, IconPhone, IconMail, IconMapPin, IconClock, IconFileText } from './Icons';

export default function Footer() {
  return (
    <footer className="footer-modern" id="footer">
      <div className="footer-top-wrap">
        <div className="container">
          <div className="footer-modern-grid">
            {/* Brand Column */}
            <div className="footer-col-brand" id="footerBrand">
              <div className="footer-brand-box">
                <img
                  src="/images/brand/aggarwal_logo_circle.png"
                  alt="Aggarwal Steels Logo"
                  width={52}
                  height={52}
                  className="footer-logo-img"
                />
                <div className="footer-brand-text">
                  <span className="footer-company-name">AGGARWAL STEELS</span>
                  <span className="footer-subsidiary-name">&amp; Majestic AR Technology</span>
                </div>
              </div>
              <p className="footer-description">
                Building Stronger Industries Together. Integrated primary steel distribution (SAIL, TATA, JSPL, AMNS) and specialized warehouse storage racking, robotic powder coating, and precision fabrication across PAN India.
              </p>
              
              <div className="footer-cert-wrap">
                <img
                  src="/images/brand/iso_make_in_india.png"
                  alt="ISO 9001:2015 & Make in India Certified"
                  className="footer-cert-badge-img"
                  width={170}
                  height={44}
                />
              </div>

              <div className="footer-dl-row">
                <a
                  href="/Aggarwal_Steels_Catalogue_2026.pdf"
                  download="Aggarwal_Steels_Catalogue_2026.pdf"
                  className="btn-footer-download"
                  id="btnFooterCatalog"
                >
                  <IconFileText size={15} />
                  <span>Download Official Catalogue 2026</span>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="footer-col-nav" id="footerProducts">
              <h4 className="footer-heading">Steel Supply (Trading)</h4>
              <ul className="footer-nav-list">
                <li><Link href="/products#hr-plates">Hot Rolled (HR) Plates &amp; Coils</Link></li>
                <li><Link href="/products#cr-sheets">Cold Rolled (CR) Precision Sheets</Link></li>
                <li><Link href="/products#chequered-plates">MS Chequered Anti-Skid Plates</Link></li>
                <li><Link href="/products#structural-steel">MS Structural Beams, Channels &amp; Angles</Link></li>
                <li><Link href="/products#ms-pipes">Hollow Sections (SHS/RHS) &amp; Pipes</Link></li>
                <li><Link href="/products">View All Certified Products &rarr;</Link></li>
                <li><Link href="/about#certifications">Accredited ISO Certifications &rarr;</Link></li>
              </ul>
            </div>

            {/* In-House Manufacturing */}
            <div className="footer-col-nav" id="footerMfg">
              <h4 className="footer-heading">In-House Manufacturing</h4>
              <ul className="footer-nav-list">
                <li><Link href="/manufacturing">520ft Automated Powder Coating Line</Link></li>
                <li><Link href="/products#heavy-duty-pallet-racks">Heavy-Duty Pallet Racking Systems</Link></li>
                <li><Link href="/products#mezzanine-floors">Multi-Tier Mezzanine Floors (2 &amp; 3 Tier)</Link></li>
                <li><Link href="/products#cantilever-racks">Heavy Cantilever Storage Systems</Link></li>
                <li><Link href="/manufacturing">CNC Multi-Axis Hydraulic Press Brakes</Link></li>
                <li><Link href="/products#ss-commercial-kitchen">Commercial Stainless Steel Fabrication</Link></li>
                <li><Link href="/clients">Enterprise Clients &amp; Projects &rarr;</Link></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="footer-col-contact" id="footerContact">
              <h4 className="footer-heading">Official Contact</h4>
              <ul className="footer-contact-list">
                <li>
                  <IconPhone size={15} />
                  <div>
                    <a href="tel:+917300070778">+91 73000 70778</a>
                    <span style={{ color: '#64748b' }}> / </span>
                    <a href="tel:+918800885185">+91 8800885185</a>
                  </div>
                </li>
                <li>
                  <IconMail size={15} />
                  <div>
                    <a href="mailto:info@majesticar.in">info@majesticar.in</a>
                  </div>
                </li>
                <li>
                  <IconMapPin size={15} />
                  <span>Head Office: E-372, RIICO Ind. Area, Bhiwadi, RJ 301019</span>
                </li>
                <li>
                  <IconMapPin size={15} />
                  <span>Unit 01: 89, Sec 3, IMT Manesar, Gurugram, HR</span>
                </li>
                <li>
                  <IconClock size={15} />
                  <span>Mon – Sat: 09:00 AM – 06:00 PM IST</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-wrap">
        <div className="container footer-bottom-flex">
          <p>© 2026 Aggarwal Steels &amp; Majestic AR Technology Pvt. Ltd. All rights reserved.</p>
          <p>Where Innovation Meets Precision &bull; A Legacy of Strength</p>
        </div>
      </div>
    </footer>
  );
}
