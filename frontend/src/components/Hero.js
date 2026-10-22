'use client';
import { useState } from 'react';
import { IconShieldCheck, IconZap, IconTruck, IconGlobe, IconArrowRight, IconCheck } from './Icons';

export default function Hero() {
  const [selectedGrade, setSelectedGrade] = useState('Fe 550D');

  return (
    <section className="hero-modern" id="home">
      {/* Background with Dark Industrial Mesh & Vignette */}
      <div className="hero-backdrop">
        <img
          src="/images/hero_steel_background.jpg"
          alt="Aggarwal Steels Processing Mill"
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
              <IconShieldCheck size={14} />
              <span>SAIL &bull; TATA STEEL &bull; JSPL AUTHORIZED PARTNER</span>
            </div>

            <h1 className="hero-heading">
              Engineered Steel.<br />
              <span className="hero-gradient-text">Uncompromised Strength.</span>
            </h1>

            <p className="hero-lead">
              Precision supply &amp; in-house fabrication of primary steel products for India's leading infrastructure, industrial warehouses, and commercial builders. Dispatched nationwide within 24 hours.
            </p>

            <div className="hero-cta-group">
              <a href="#products" className="btn-modern-primary">
                <span>Explore Products</span>
                <IconArrowRight size={18} />
              </a>
              <a href="#capabilities" className="btn-modern-outline">
                <span>View Factory Capabilities</span>
              </a>
            </div>

            {/* Quick Steel Grade Selector */}
            <div className="hero-grades-row">
              <span className="grades-label">Popular Standards:</span>
              <div className="grades-chips">
                {['Fe 550D TMT', 'IS 2062 E250 HR', 'ISMC 150-400', 'SS 304 / 202', 'IS 4923 Hollow'].map((grade) => (
                  <span
                    key={grade}
                    className={`grade-chip ${selectedGrade === grade ? 'grade-chip--active' : ''}`}
                    onClick={() => setSelectedGrade(grade)}
                  >
                    {grade}
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
                  <span className="telemetry-title">LIVE SUPPLY METRICS</span>
                </div>
                <span className="telemetry-year">FY 2024-25</span>
              </div>

              <div className="telemetry-stats-grid">
                <div className="telemetry-stat-box">
                  <span className="stat-label-modern">Annual Turnover</span>
                  <div className="stat-value-modern">
                    ₹148<span className="stat-unit">Cr+</span>
                  </div>
                  <span className="stat-note-modern">Consistent 42% YoY Growth</span>
                </div>

                <div className="telemetry-stat-box">
                  <span className="stat-label-modern">Order Dispatch</span>
                  <div className="stat-value-modern">
                    24<span className="stat-unit">Hrs</span>
                  </div>
                  <span className="stat-note-modern">Guaranteed stock dispatch</span>
                </div>

                <div className="telemetry-stat-box">
                  <span className="stat-label-modern">Logistics Reach</span>
                  <div className="stat-value-modern">
                    7<span className="stat-unit">Hubs</span>
                  </div>
                  <span className="stat-note-modern">Faridabad &bull; Mumbai &bull; Raipur</span>
                </div>

                <div className="telemetry-stat-box">
                  <span className="stat-label-modern">Quality Assured</span>
                  <div className="stat-value-modern">
                    100<span className="stat-unit">%</span>
                  </div>
                  <span className="stat-note-modern">BIS / Mill Test Certificates</span>
                </div>
              </div>

              {/* Sister Concern Highlight */}
              <div className="telemetry-footer-card">
                <div className="telemetry-footer-icon">
                  <IconTruck size={20} />
                </div>
                <div className="telemetry-footer-info">
                  <strong>Integrated Fabrication Wing</strong>
                  <p>Majestic AR Technology: CNC Bending, Racking &amp; PEB Structures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
