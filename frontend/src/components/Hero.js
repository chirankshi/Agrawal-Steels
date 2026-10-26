'use client';
import { useState } from 'react';
import { IconShieldCheck, IconZap, IconTruck, IconGlobe, IconArrowRight, IconCheck, IconAward } from './Icons';

export default function Hero() {
  const [selectedCategory, setSelectedCategory] = useState('Primary Steel Supply');

  return (
    <section className="hero-modern" id="home">
      {/* Background with Dark Industrial Mesh & Vignette */}
      <div className="hero-backdrop">
        <img
          src="/images/hero_steel_background.jpg"
          alt="Aggarwal Steels & Majestic AR Technology Plants"
          className="hero-backdrop-img"
        />
        <div className="hero-backdrop-overlay"></div>
        <div className="hero-grid-pattern"></div>
      </div>

      <div className="container hero-container">
        <div className="hero-split">
          {/* Left Column: Core Value Proposition */}
          <div className="hero-main">
            <div className="hero-status-pill">
              <span className="status-beacon"></span>
              <IconAward size={14} />
              <span>A LEGACY OF STRENGTH &bull; ISO 9001:2015 CERTIFIED &bull; MAKE IN INDIA</span>
            </div>

            <h1 className="hero-heading">
              Building Stronger<br />
              <span className="hero-gradient-text">Industries Together.</span>
            </h1>

            <p className="hero-lead">
              Integrated primary steel distribution and precision industrial storage manufacturing. Partnered with <strong>SAIL, TATA Steel, JSPL, AMNS &amp; Apollo Pipes</strong>, delivering turnkey steel solutions, heavy warehouse racking, and automated powder coating across India.
            </p>

            <div className="hero-cta-group">
              <a href="#products" className="btn-modern-primary">
                <span>Explore Catalog</span>
                <IconArrowRight size={18} />
              </a>
              <a href="#capabilities" className="btn-modern-outline">
                <span>In-House Machinery</span>
              </a>
            </div>

            {/* Quick Filter Pill Row */}
            <div className="hero-grades-row">
              <span className="grades-label">Core Divisions:</span>
              <div className="grades-chips">
                {['Primary Steel Supply', 'Industrial Storage Racks', 'Mezzanine Floors', 'SS Kitchen Equipment', 'CNC Sheet Bending'].map((cat) => (
                  <span
                    key={cat}
                    className={`grade-chip ${selectedCategory === cat ? 'grade-chip--active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry & Metrics Card */}
          <div className="hero-telemetry">
            <div className="telemetry-card">
              <div className="telemetry-header">
                <div className="telemetry-title-wrap">
                  <span className="telemetry-dot"></span>
                  <span className="telemetry-title">AT A GLANCE &bull; OFFICIAL AUDIT</span>
                </div>
                <span className="telemetry-year">SINCE 2015</span>
              </div>

              <div className="telemetry-stats-grid">
                <div className="telemetry-stat-box">
                  <span className="stat-label-modern">Annual Turnover</span>
                  <div className="stat-value-modern">
                    ₹200<span className="stat-unit">Cr+</span>
                  </div>
                  <span className="stat-note-modern">Consistent 40%+ YoY Surge</span>
                </div>

                <div className="telemetry-stat-box">
                  <span className="stat-label-modern">Workforce</span>
                  <div className="stat-value-modern">
                    250<span className="stat-unit">+</span>
                  </div>
                  <span className="stat-note-modern">Engineers, Technicians &amp; Staff</span>
                </div>

                <div className="telemetry-stat-box">
                  <span className="stat-label-modern">Trading Experience</span>
                  <div className="stat-value-modern">
                    11<span className="stat-unit">+ Yrs</span>
                  </div>
                  <span className="stat-note-modern">4+ Yrs In-House Manufacturing</span>
                </div>

                <div className="telemetry-stat-box">
                  <span className="stat-label-modern">Operating Units</span>
                  <div className="stat-value-modern">
                    5<span className="stat-unit">Units</span>
                  </div>
                  <span className="stat-note-modern">2 Mfg Plants &bull; 3 Trading Hubs</span>
                </div>
              </div>

              {/* Sister Concern Highlight */}
              <div className="telemetry-footer-card">
                <div className="telemetry-footer-icon">
                  <IconTruck size={20} />
                </div>
                <div className="telemetry-footer-info">
                  <strong>Majestic AR Technology Pvt. Ltd.</strong>
                  <p>In-House Racking, 520ft Automated Powder Coating, PEB &amp; CNC Bending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
