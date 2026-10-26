'use client';
import { useState } from 'react';
import { IconAward, IconGlobe, IconLayers, IconTruck, IconArrowRight, IconShieldCheck } from './Icons';

export default function Journey() {
  const [activeYear, setActiveYear] = useState('2024-25');

  // Exact figures from Document Page 4 ("Our Journey...")
  const timeline = [
    { year: '2021-22', revenue: '₹52 Cr.', height: '35%', desc: 'Expanding national flat & long primary steel distribution network' },
    { year: '2022-23', revenue: '₹68 Cr.', height: '46%', desc: 'Setting up Majestic AR Technology Pvt. Ltd. racking & manufacturing' },
    { year: '2023-24', revenue: '₹98 Cr.', height: '66%', desc: 'Commissioning automated 520ft robotic powder coating line & CNC machines' },
    { year: '2024-25', revenue: '₹148 Cr.', height: '80%', desc: 'Record audited annual milestone across steel supply & warehousing systems' },
    { year: '2025-26', revenue: '₹200+ Cr.', height: '100%', desc: 'Current group run-rate with 2 manufacturing plants & 3 trading units', isLatest: true },
  ];

  const milestones = [
    { label: 'Year Established', value: '2015', icon: <IconAward size={20} /> },
    { label: 'Group Turnover', value: '₹200+ Cr', icon: <IconTruck size={20} /> },
    { label: 'Workforce', value: '250+ Team', icon: <IconLayers size={20} /> },
    { label: 'Trading Experience', value: '11+ Years', icon: <IconGlobe size={20} /> },
  ];

  return (
    <section className="section journey-modern-section" id="journey">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-amber">
            <IconAward size={15} /> OUR JOURNEY &bull; VERIFIED FINANCIALS
          </div>
          <h2 className="section-title text-white">
            A Journey Built on <span className="text-gradient">Trust &amp; Continuous Growth</span>
          </h2>
          <p className="section-desc text-gray">
            Step by step, with innovation and trust, Aggarwal Steels has grown into an enduring symbol of strength and reliability.
          </p>
        </div>

        {/* Dynamic Financial Bar Chart with Gradient Glow */}
        <div className="growth-chart-wrap">
          <div className="growth-chart-header">
            <div>
              <span className="growth-chart-label">CONSOLIDATED GROUP TURNOVER TRAJECTORY</span>
              <div className="growth-current-revenue">₹200+ Crore <span className="growth-badge">Run-Rate Milestone</span></div>
            </div>
            <div className="growth-legend">
              <span className="legend-dot"></span>
              <span>Audited Financial Progression</span>
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
            <span className="sub-tag">IN-HOUSE MANUFACTURING &bull; RACKING &amp; FABRICATION</span>
            <h3 className="sub-title">Majestic AR Technology Pvt. Ltd.</h3>
            <p className="sub-desc">
              Where Innovation Meets Precision. Operating 2 manufacturing units in Bhiwadi &amp; Manesar, producing Heavy-Duty Storage Racks, Mezzanine Floors, SS Commercial Kitchens, and Custom Cabinets.
            </p>
          </div>
          <div className="sub-right">
            <a href="#capabilities" className="btn-modern-outline">
              <span>View In-House Machinery</span>
              <IconArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
