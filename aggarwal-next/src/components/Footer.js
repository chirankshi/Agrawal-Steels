export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand" id="footerBrand">
              <div className="nav-logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="20,2 38,36 2,36" stroke="#f59e0b" strokeWidth="3" fill="none"/>
                    <line x1="20" y1="10" x2="20" y2="30" stroke="#f59e0b" strokeWidth="2.5"/>
                    <line x1="12" y1="28" x2="28" y2="28" stroke="#f59e0b" strokeWidth="2.5"/>
                  </svg>
                </div>
                <div className="logo-text">
                  <span className="logo-main">Aggarwal</span>
                  <span className="logo-sub">Steels</span>
                </div>
              </div>
              <p className="footer-tagline">
                Faridabad's trusted steel supplier since 1990. Quality, reliability, and competitive pricing for India's manufacturing sector.
              </p>
              <div className="footer-certs">
                <span className="cert-badge">ISI Certified</span>
                <span className="cert-badge">GST Registered</span>
              </div>
            </div>

            <div className="footer-col" id="footerProducts">
              <h4>Products</h4>
              <ul>
                <li><a href="#products">MS TMT Bars</a></li>
                <li><a href="#products">HR Plates &amp; Coils</a></li>
                <li><a href="#products">MS Angles</a></li>
                <li><a href="#products">MS Channel</a></li>
                <li><a href="#products">MS Beam</a></li>
                <li><a href="#products">CR Coils</a></li>
                <li><a href="#products">GP Coils &amp; Sheets</a></li>
                <li><a href="#products">SS Sheets</a></li>
              </ul>
            </div>

            <div className="footer-col" id="footerCompany">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#why-us">Why Choose Us</a></li>
                <li><a href="#journey">Our Journey</a></li>
                <li><a href="#presence">Our Presence</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>

            <div className="footer-col" id="footerContact">
              <h4>Contact</h4>
              <ul>
                <li>📞 <a href="tel:+918800885185">+91 8800885185</a></li>
                <li>✉️ <a href="mailto:info@aggarwalsteels.com">info@aggarwalsteels.com</a></li>
                <li>📍 Plot No. 680, Sec 59, Faridabad, Haryana 121004</li>
                <li>🕐 Mon–Sat: 9:00 AM – 6:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2025 Aggarwal Steels. All rights reserved. GST No: 06AAFPA0415LI2G</p>
          <p>Made with ❤️ for India's Steel Industry</p>
        </div>
      </div>
    </footer>
  );
}
