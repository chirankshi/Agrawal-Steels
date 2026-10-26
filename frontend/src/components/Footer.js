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
                  width={48}
                  height={48}
                  className="footer-logo-img"
                />
                <div className="logo-text">
                  <span className="logo-brand">AGGARWAL STEELS</span>
                  <span className="logo-tagline">&bull; MAJESTIC AR TECHNOLOGY PVT. LTD. &bull;</span>
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
                  width={180}
                  height={64}
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
                <li><a href="#products">MS TMT Bars (Fe 415/500D/550D)</a></li>
                <li><a href="#products">Hot Rolled Plates &amp; Coils (IS 2062)</a></li>
                <li><a href="#products">MS Structural Angles &amp; Channels</a></li>
                <li><a href="#products">MS Beams &amp; Joists (ISMB / NPB)</a></li>
                <li><a href="#products">Chequered Plates &amp; Flooring Sheets</a></li>
                <li><a href="#products">Hollow Sections &amp; Pipes (IS 4923)</a></li>
                <li><a href="#products">CR Coils &amp; GP Galvanized Sheets</a></li>
                <li><a href="#products">Stainless Steel Sheets (304 / 202)</a></li>
              </ul>
            </div>

            {/* In-House Manufacturing */}
            <div className="footer-col-nav" id="footerMfg">
              <h4 className="footer-heading">In-House Manufacturing</h4>
              <ul className="footer-nav-list">
                <li><a href="#capabilities">Majestic AR Technology Pvt. Ltd.</a></li>
                <li><a href="#capabilities">Heavy-Duty Pallet Racking Systems</a></li>
                <li><a href="#capabilities">Multi-Tier Mezzanine Floors (2 &amp; 3 Tier)</a></li>
                <li><a href="#capabilities">520ft Robotic Powder Coating Plant</a></li>
                <li><a href="#capabilities">3 kW Prime Fiber Laser Cutting</a></li>
                <li><a href="#capabilities">HACO / Energy Mission CNC Bending</a></li>
                <li><a href="#capabilities">SS Commercial Kitchen Equipment</a></li>
                <li><a href="#capabilities">Electrical &amp; Control Panel Cabinets</a></li>
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
                    <a href="mailto:md@majesticar.com">md@majesticar.com</a>
                    <br />
                    <a href="mailto:info@majesticar.in" style={{ fontSize: '0.82rem' }}>info@majesticar.in</a>
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
