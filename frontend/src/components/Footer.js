import { IconShieldCheck, IconPhone, IconMail, IconMapPin, IconClock } from './Icons';

export default function Footer() {
  return (
    <footer className="footer-modern" id="footer">
      <div className="footer-top-wrap">
        <div className="container">
          <div className="footer-modern-grid">
            {/* Brand Column */}
            <div className="footer-col-brand" id="footerBrand">
              <div className="nav-logo">
                <div className="logo-symbol">
                  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                    <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#f59e0b" strokeWidth="2.5" fill="rgba(245, 158, 11, 0.08)"/>
                    <path d="M18 10V26" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M11 22L18 26L25 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="logo-text">
                  <span className="logo-brand">AGGARWAL</span>
                  <span className="logo-tagline">STEELS &bull; ESTD 1990</span>
                </div>
              </div>
              <p className="footer-description">
                India's trusted distributor of prime structural, flat, and tubular steel products. Authorized partners for SAIL, Tata Steel, JSPL, and AM/NS.
              </p>
              <div className="footer-badges-strip">
                <span className="cert-pill">
                  <IconShieldCheck size={13} /> BIS Certified
                </span>
                <span className="cert-pill">GST Registered</span>
                <span className="cert-pill">ISO 9001 Compliant</span>
              </div>
            </div>

            {/* Product Links */}
            <div className="footer-col-nav" id="footerProducts">
              <h4 className="footer-heading">Prime Products</h4>
              <ul className="footer-nav-list">
                <li><a href="#products">MS TMT Bars (Fe 500D/550D)</a></li>
                <li><a href="#products">Hot Rolled Plates &amp; Coils</a></li>
                <li><a href="#products">MS Angles &amp; Channels</a></li>
                <li><a href="#products">MS Structural Beams &amp; Joists</a></li>
                <li><a href="#products">CR Coils &amp; Slit Strips</a></li>
                <li><a href="#products">GP &amp; Galvanized Sheets</a></li>
                <li><a href="#products">Stainless Steel Sheets (304/202)</a></li>
              </ul>
            </div>

            {/* In-House Manufacturing */}
            <div className="footer-col-nav" id="footerMfg">
              <h4 className="footer-heading">Manufacturing Arm</h4>
              <ul className="footer-nav-list">
                <li><a href="#capabilities">Majestic AR Technology</a></li>
                <li><a href="#capabilities">Heavy-Duty Storage Racking</a></li>
                <li><a href="#capabilities">Multi-Tier Mezzanine Floors</a></li>
                <li><a href="#capabilities">Hydraulic CNC Sheet Bending</a></li>
                <li><a href="#capabilities">Structural PEB Welding</a></li>
                <li><a href="#capabilities">Commercial SS Kitchen Systems</a></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="footer-col-contact" id="footerContact">
              <h4 className="footer-heading">Contact Details</h4>
              <ul className="footer-contact-list">
                <li>
                  <IconPhone size={15} />
                  <a href="tel:+918800885185">+91 8800885185</a>
                </li>
                <li>
                  <IconMail size={15} />
                  <a href="mailto:info@aggarwalsteels.com">info@aggarwalsteels.com</a>
                </li>
                <li>
                  <IconMapPin size={15} />
                  <span>Plot 680, Sec 59, Faridabad, HR 121004</span>
                </li>
                <li>
                  <IconClock size={15} />
                  <span>Mon – Sat: 09:00 AM – 06:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-wrap">
        <div className="container footer-bottom-flex">
          <p>© 2025 Aggarwal Steels. All rights reserved. GSTIN: 06AAFPA0415LI2G</p>
          <p>Engineered for India's Heavy Infrastructure &amp; Manufacturing</p>
        </div>
      </div>
    </footer>
  );
}
