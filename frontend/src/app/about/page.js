'use client';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import AnnouncementBar from '../../components/AnnouncementBar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ScrollAnimations from '../../components/ScrollAnimations';
import CountUp from '../../components/CountUp';
import {
  IconAward,
  IconShieldCheck,
  IconCheckCircle,
  IconArrowRight,
  IconPhone,
  IconDownload
} from '../../components/Icons';

export default function AboutPage() {
  return (
    <>
      <ScrollAnimations />
      <AnnouncementBar />
      <Navbar />

      <main className="dedicated-page-container">
        {/* Page Hero */}
        <section className="dedicated-page-hero">
          <div className="section-container">
            <div className="dedicated-hero-badge">
              <IconAward size={14} />
              <span>CORPORATE LEGACY • ESTABLISHED 2015</span>
            </div>
            <h1 className="dedicated-hero-title">
              Strong Foundations, <span className="text-gradient">Stronger Relations</span>
            </h1>
            <p className="dedicated-hero-subtitle">
              For over a decade, Aggarwal Steels and its manufacturing subsidiary Majestic AR Technology 
              have powered India&apos;s infrastructure, heavy engineering, and warehousing landscape through 
              uncompromising steel quality, fair pricing, and rapid logistics execution.
            </p>

            <div className="dedicated-hero-actions">
              <Link href="/contact" className="btn-primary" id="btnAboutConnect">
                <IconPhone size={16} />
                <span>Connect With Leadership</span>
              </Link>
              <a
                href="/Aggarwal_Steels_Catalogue_2026.pdf"
                download="Aggarwal_Steels_Catalogue_2026.pdf"
                className="btn-secondary"
                id="btnDownloadProfile"
              >
                <IconDownload size={16} />
                <span>Download Corporate Profile (PDF)</span>
              </a>
            </div>
          </div>
        </section>

        {/* Founder & Leadership Section */}
        <section className="about-founder-deep-section">
          <div className="section-container">
            <div className="founder-deep-grid">
              <div className="founder-photo-col">
                <div className="founder-image-frame">
                  <img
                    src="/images/aakash_goyal.jpg"
                    alt="Mr. Aakash Goyal - Founder & Managing Director"
                    className="founder-portrait-img"
                  />
                  <div className="founder-card-tag">
                    <h4>Mr. Aakash Goyal</h4>
                    <p>Founder &amp; Managing Director</p>
                  </div>
                </div>

                <div className="founder-cert-badges">
                  <div className="cert-pill" style={{ justifyContent: 'center' }}>
                    <img
                      src="/images/brand/iso_make_in_india.png"
                      alt="ISO 9001:2015 & Make in India"
                      style={{ maxHeight: 44, width: 'auto', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </div>

              <div className="founder-content-col">
                <span className="section-tag">LEADERSHIP MESSAGE</span>
                <h2 className="section-title">Empowering Indian Industry With Certified Steel</h2>
                
                <blockquote className="founder-quote-highlight">
                  &ldquo;In industrial steel supply, precision and timing are paramount. When a construction site or 
                  a heavy fabrication shop stops for lack of steel, time and money are lost. Our commitment since 2015 
                  has been steadfast: 100% genuine mill-certified steel, complete transparency in weighment, and 
                  unflinching dispatch discipline.&rdquo;
                </blockquote>

                <p className="founder-body-text">
                  Founded under the visionary leadership of <strong>Mr. Aakash Goyal</strong>, Aggarwal Steels 
                  began with a core focus on primary steel distribution. Over the years, recognizing the burgeoning 
                  demand for modern logistics and warehousing infrastructure, the group established 
                  <strong> Majestic AR Technology Pvt. Ltd.</strong> — a specialized industrial manufacturing 
                  and automated powder coating arm.
                </p>

                <p className="founder-body-text">
                  Today, the group operates across <strong>5 strategic units</strong> (including state-of-the-art 
                  manufacturing plants in Bhiwadi and warehousing hubs in Delhi NCR), managing over 
                  <strong> ₹200 Crores</strong> in annual turnover and supporting 250+ dedicated engineers, 
                  fabrication experts, and logistics personnel.
                </p>

                <div className="about-stats-strip">
                  <div className="stat-box stagger-stat-1">
                    <span className="stat-val">
                      <CountUp target={200} prefix="₹" suffix=" Cr+" duration={2000} unitClassName="stat-unit-about" />
                    </span>
                    <span className="stat-lbl">Annual Turnover</span>
                  </div>
                  <div className="stat-box stagger-stat-2">
                    <span className="stat-val">
                      <CountUp target={11} suffix="+ Yrs" duration={1800} unitClassName="stat-unit-about" />
                    </span>
                    <span className="stat-lbl">Industry Trust</span>
                  </div>
                  <div className="stat-box stagger-stat-3">
                    <span className="stat-val">
                      <CountUp target={250} suffix="+" duration={2200} unitClassName="stat-unit-about" />
                    </span>
                    <span className="stat-lbl">Technical Workforce</span>
                  </div>
                  <div className="stat-box stagger-stat-4">
                    <span className="stat-val">
                      <CountUp target={5} suffix=" Units" duration={1600} unitClassName="stat-unit-about" />
                    </span>
                    <span className="stat-lbl">Plants &amp; Hubs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Entity Synergy */}
        <section className="about-synergy-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">GROUP SYNERGY</span>
              <h2 className="section-title">Two Powerhouses, One Unified Promise</h2>
              <p className="section-desc">
                The seamless integration between raw material supply and precision fabrication eliminates middleman markups and delays.
              </p>
            </div>

            <div className="synergy-grid">
              <div className="synergy-card">
                <div className="synergy-header">
                  <span className="synergy-tag">RAW MATERIAL ARM</span>
                  <h3>Aggarwal Steels</h3>
                </div>
                <p>
                  Direct distribution partner for India&apos;s leading primary steel mills: SAIL, TATA Steel, JSPL, AMNS, and Apollo Pipes.
                </p>
                <ul className="synergy-list">
                  <li><IconCheckCircle size={15} /> Huge buffer inventory of HR/CR coils, plates & structural beams</li>
                  <li><IconCheckCircle size={15} /> Mill Test Certificates (MTC) with strict heat-number traceability</li>
                  <li><IconCheckCircle size={15} /> 24-hour dispatch assurance on standard commercial sizes</li>
                  <li><IconCheckCircle size={15} /> Electronic weighbridge verification on every outgoing consignment</li>
                </ul>
              </div>

              <div className="synergy-card highlight-card">
                <div className="synergy-header">
                  <span className="synergy-tag">MANUFACTURING ARM</span>
                  <h3>Majestic AR Technology Pvt. Ltd.</h3>
                </div>
                <p>
                  Engineered industrial storage solutions, mezzanine floor systems, and conveyorized finishing.
                </p>
                <ul className="synergy-list">
                  <li><IconCheckCircle size={15} /> North India&apos;s premier 520 ft automated powder coating line</li>
                  <li><IconCheckCircle size={15} /> Heavy CNC press brakes (up to 250T) and continuous roll forming</li>
                  <li><IconCheckCircle size={15} /> Structural designs validated under European SEMA / EN 15512 codes</li>
                  <li><IconCheckCircle size={15} /> Full turnkey execution: CAD layout, fabrication, supply & erection</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision & Core Values */}
        <section className="about-values-section">
          <div className="section-container">
            <div className="mission-vision-modern-grid">
              <div className="mv-card">
                <h3>Our Vision</h3>
                <p>
                  To be India&apos;s most dependable, transparent, and technology-driven integrated steel supply and storage manufacturing conglomerate, setting benchmarks in customer satisfaction and zero-defect quality.
                </p>
              </div>
              <div className="mv-card">
                <h3>Our Mission</h3>
                <p>
                  To empower infrastructure builders, logistics companies, and industrial enterprises by delivering certified steel at fair market rates with unmatched lead times and rigorous structural engineering.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
}
