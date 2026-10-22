'use client';
import { useState } from 'react';
import { IconAward, IconGlobe, IconLayers, IconTruck, IconArrowRight, IconShieldCheck } from './Icons';

export default function Journey() {
  const [activeYear, setActiveYear] = useState('2024-25');

  const timeline = [
    { year: '2021-22', revenue: '₹52 Cr.', height: '35%', desc: 'Expansion into regional flat products distribution' },
    { year: '2022-23', revenue: '₹68 Cr.', height: '46%', desc: 'Incorporation of Majestic AR Technology racking division' },
    { year: '2023-24', revenue: '₹98 Cr.', height: '66%', desc: 'Multi-hub logistics expansion into Western & Central India' },
    { year: '2024-25', revenue: '₹148 Cr.', height: '100%', desc: 'Record turnover milestone with full-stack fabrication', isLatest: true },
  ];

  const milestones = [
    { label: 'Founded In', value: '1990', icon: <IconAward size={20} /> },
    { label: 'Strategic Hubs', value: '7+ Cities', icon: <IconGlobe size={20} /> },
    { label: 'Commercial Divisions', value: '2 Wings', icon: <IconLayers size={20} /> },
    { label: 'Stock Dispatch', value: '< 24 Hours', icon: <IconTruck size={20} /> },
  ];

  return (
    <section className="section journey-modern-section" id="journey">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-amber">
            <IconAward size={15} /> GROWTH TRAJECTORY
          </div>
          <h2 className="section-title text-white">
            Scaling Through <span className="text-gradient">Performance &amp; Scale</span>
          </h2>
          <p className="section-desc text-gray">
            Year-over-year revenue expansion driven by customer trust, broader product lines, and seamless logistics.
          </p>
        </div>

        {/* Dynamic Financial Bar Chart with Gradient Glow */}
        <div className="growth-chart-wrap">
          <div className="growth-chart-header">
            <div>
              <span className="growth-chart-label">ANNUAL REVENUE RUN-RATE</span>
              <div className="growth-current-revenue">₹148 Crore <span className="growth-badge">+51% YoY</span></div>
            </div>
            <div className="growth-legend">
              <span className="legend-dot"></span>
              <span>Audited Consolidated Revenue</span>
            </div>
          </div>

          <div className="growth-bars-row">
            {timeline.map((item) => (
              <div
                key={item.year}
                className={`growth-bar-col ${activeYear === item.year ? 'growth-bar-col--active' : ''}`}
                onMouseEnter={() => setActiveYear(item.year)}
              >
                <div className="growth-bar-val">{item.revenue}</div>
                <div className="growth-bar-track">
                  <div
                    className="growth-bar-fill"
                    style={{ height: item.height }}
                  >
                    <span className="growth-bar-glow"></span>
                  </div>
                </div>
                <div className="growth-bar-year">{item.year}</div>
                {item.isLatest && <span className="growth-latest-pill">Current FY</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Key Milestone Telemetry Badges */}
        <div className="milestone-modern-grid">
          {milestones.map((m, idx) => (
            <div className="milestone-modern-box" key={idx}>
              <div className="milestone-icon-wrap">{m.icon}</div>
              <div className="milestone-val">{m.value}</div>
              <div className="milestone-lbl">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Subsidiary Integration Banner */}
        <div className="subsidiary-modern-banner">
          <div className="sub-left">
            <span className="sub-tag">SISTER CONCERN &bull; IN-HOUSE MANUFACTURING</span>
            <h3 className="sub-title">Majestic AR Technology Pvt. Ltd.</h3>
            <p className="sub-desc">
              Specialized manufacturing of Heavy-Duty Storage Racks, Multi-Tier Mezzanine Floors, Structural PEB Assemblies, and Food-Grade SS Kitchen Systems.
            </p>
          </div>
          <div className="sub-right">
            <a href="#capabilities" className="btn-modern-outline">
              <span>View Racking &amp; Fabrication</span>
              <IconArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
