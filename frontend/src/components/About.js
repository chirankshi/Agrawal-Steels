'use client';
import Link from 'next/link';
import { useSiteSettings, num, turnoverBillionText } from '../lib/siteSettings';
import { IconShieldCheck, IconAward, IconZap, IconGlobe, IconTarget, IconCompass, IconArrowRight, IconLayers } from './Icons';

export default function About() {
  const { settings: k } = useSiteSettings();
  const values = [
    { title: 'Quality Integrity', desc: 'ISO 9001:2015 Certified & BIS Compliant', icon: <IconShieldCheck size={18} /> },
    { title: '24-Hour Dispatch', desc: 'Fast turnaround across primary steel lines', icon: <IconZap size={18} /> },
    { title: 'PAN India Supply', desc: '7+ Strategic hubs from Bhiwadi to Rourkela', icon: <IconGlobe size={18} /> },
    { title: 'Turnkey Manufacturing', desc: '2 Production Units & 3 Trading Units', icon: <IconLayers size={18} /> },
  ];

  return (
    <section className="section about-modern-section" id="about">
      <div className="container">
        <div className="about-modern-grid">
          {/* Left Column: Narrative */}
          <div className="about-modern-content">
            <div className="section-label label-amber">
              <IconAward size={15} /> CORPORATE OVERVIEW &bull; SINCE {k.founded_year}
            </div>
            <h2 className="section-title text-white">
              Strong Foundations.<br />
              <span className="text-gradient">Stronger Relations.</span>
            </h2>
            <p className="about-lead">
              Established in <strong>{k.founded_year}</strong>, <strong>Aggarwal Steels</strong> alongside manufacturing sister arm <strong>Majestic AR Technology Pvt. Ltd.</strong> has grown into an integrated steel supply and industrial fabrication powerhouse.
            </p>
            <p className="about-sub">
              With over <strong>{k.trading_years}+ years of trading experience</strong> and <strong>{k.manufacturing_years}+ years of advanced manufacturing</strong>, we operate <strong>2 manufacturing plants</strong> and <strong>3 trading units</strong> with a consolidated group turnover of <strong>₹{turnoverBillionText(k)} Billion ({k.turnover_year})</strong> and a {k.staff_count}+ dedicated workforce. From primary steel distribution (SAIL, TATA, JSPL, AMNS) to heavy warehouse racking and automated powder-coating lines, we power India's mega infrastructure and manufacturing sectors.
            </p>

            {/* Core Values Bento Grid */}
            <div className="about-values-grid">
              {values.map((v, i) => (
                <div className="value-modern-card" key={i}>
                  <div className="value-icon-box">{v.icon}</div>
                  <div>
                    <h4 className="value-title">{v.title}</h4>
                    <span className="value-desc">{v.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-actions-row" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/about" className="btn-modern-primary" id="btnReadOurStory">
                <span>Read Our Story</span>
                <IconArrowRight size={18} />
              </Link>
              <a href="#contact" className="btn-modern-outline" id="btnTalkTechnicalSales">
                <span>Talk to Technical Sales</span>
              </a>
            </div>
          </div>

          {/* Right Column: Founder Quote & Strategic Pillars */}
          <div className="about-modern-cards">
            {/* Leadership Statement Card */}
            <div className="founder-modern-card">
              <div className="founder-header founder-header--portrait">
                <div className="founder-photo-wrap">
                  <img
                    src="/images/aakash_goyal_portrait.jpg"
                    alt="Mr. Aakash Goyal - Founder & Director, Aggarwal Steels"
                    className="founder-photo-img"
                  />
                  <span className="founder-photo-badge">Director</span>
                </div>
                <div>
                  <h3 className="founder-name">Mr. Aakash Goyal</h3>
                  <span className="founder-role">Founder &amp; Director &bull; Aggarwal Steels &amp; Majestic AR Technology</span>
                  <div className="founder-exp-tag">{k.trading_years}+ Years Trading &bull; {k.manufacturing_years}+ Years Manufacturing</div>
                </div>
              </div>
              <blockquote className="founder-quote-text">
                &ldquo;Steel is not just a product – it is the strength that builds foundations and the trust that builds relationships.&rdquo;
              </blockquote>
              <div className="founder-footer-strip">
                <img
                  src="/images/brand/iso_make_in_india.png"
                  alt="ISO 9001:2015 & Make in India"
                  className="founder-iso-badge"
                  width={140}
                  height={50}
                />
                <div className="founder-meta">
                  <span>ESTABLISHED {k.founded_year} &bull; ₹{turnoverBillionText(k)} BILLION TURNOVER {k.turnover_year}</span>
                </div>
              </div>
            </div>

            {/* Mission & Vision Split */}
            <div className="mission-vision-modern-grid">
              <div className="mv-modern-card">
                <div className="mv-icon-wrap">
                  <IconTarget size={20} />
                </div>
                <h4 className="mv-heading">Our Mission</h4>
                <p className="mv-text">
                  To deliver strength with purpose: providing high-quality iron, steel, and custom storage solutions that empower builders, industries, and infrastructure projects with cost-effective reliability and timely supply.
                </p>
              </div>

              <div className="mv-modern-card">
                <div className="mv-icon-wrap">
                  <IconCompass size={20} />
                </div>
                <h4 className="mv-heading">Our Vision</h4>
                <p className="mv-text">
                  To shape the future of construction and industrial storage by becoming a globally recognized brand in iron and steel — driving mega infrastructure, enabling industries, and delivering value beyond borders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
