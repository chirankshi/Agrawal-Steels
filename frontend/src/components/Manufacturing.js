'use client';
import { useState } from 'react';
import Link from 'next/link';
import { IconCpu, IconWrench, IconLayers, IconShieldCheck, IconArrowRight, IconZap } from './Icons';

const CAPABILITIES = [
  {
    id: 'laser',
    title: 'CNC Laser Cutting Machine (3 kW Prime)',
    badge: '3 kW Fiber Laser',
    icon: <IconZap size={22} />,
    desc: 'Ultra-high precision CNC fiber laser cutting for steel sheets and heavy plates. Clean edges, minimal wastage, and exact tolerance for custom drawings and panels.',
    img: '/images/cnc_bending.jpeg',
    specs: ['3 kW High Precision Laser', 'Clean Burr-Free Edges', 'Minimal Heat-Affected Zone', 'Custom CAD / DXF Profiling'],
  },
  {
    id: 'bending',
    title: 'CNC Bending Machines (HACO & Energy Mission)',
    badge: '4 CNC Press Brakes',
    icon: <IconCpu size={22} />,
    desc: '4 high-performance CNC bending machines (including Tandem setup and HACO units) for complex multi-bend angles, desk panels, heavy shelves, and enclosures.',
    img: '/images/support_welding.jpeg',
    specs: ['Energy Mission & HACO Machines', '4-Tandem Bending Setup', 'Up to 12mm Plate Bending', 'Repeat Accuracy ±0.2mm'],
  },
  {
    id: 'powder',
    title: '520 FT Automatic Powder Coating Plant',
    badge: 'Automated Robotic Arm',
    icon: <IconShieldCheck size={22} />,
    desc: 'Full-fledged 520 ft conveyorized automatic powder coating line with robotic spray arm. Capable of coating up to 12-meter-long structural products in a single continuous stretch with high corrosion resistance.',
    img: '/images/storage_racking.jpeg',
    specs: ['520 Ft Conveyorized Line', 'Automated Robotic Arm', '12m Length in Single Stretch', 'Multi-Stage Chemical Pre-Treatment'],
  },
  {
    id: 'rollforming',
    title: 'Heavy Roll Forming & Power Press (Up to 250 Ton)',
    badge: 'In-House Profiling',
    icon: <IconLayers size={22} />,
    desc: 'Continuous roll forming lines producing Slotted Angles, Racking Uprights, MKM Sections, and Omega Profiles. Backed by mechanical power presses up to 250 Ton capacity.',
    img: '/images/cnc_bending.jpeg',
    specs: ['Slotted Angles & Omega Sections', 'Heavy Upright Columns', 'Power Press up to 250 Ton', 'Continuous High-Speed Stamping'],
  },
  {
    id: 'racking',
    title: 'Turnkey Warehouse Storage Systems',
    badge: 'Majestic AR Technology',
    icon: <IconLayers size={22} />,
    desc: 'Heavy-Duty Pallet Racking (Selective, Double Deep, Drive-In, Cantilever), Multi-Tier Mezzanine floors, and supermarket display systems engineered for maximum warehouse cubic volume.',
    img: '/images/storage_racking.jpeg',
    specs: ['Selective & Drive-In Racks', 'Multi-Tier Mezzanines (2 & 3 Tier)', 'Pallets & Wire Mesh Partitions', 'Complete Turnkey Warehouse Design'],
  },
  {
    id: 'kitchen',
    title: 'Commercial Stainless Steel Kitchen Equipment',
    badge: 'SS 304 Hygienic Grade',
    icon: <IconWrench size={22} />,
    desc: 'Sanitary stainless steel equipment for hotels, industrial cafeterias, and food processing plants — worktables, prep counters, commercial sinks, and bakery racks with Miller TIG/MIG welding.',
    img: '/images/commercial_kitchen.jpeg',
    specs: ['SS 304 / 316 Food Grade', 'Miller TIG & MIG Clean Welds', 'Hospital & Commercial Kitchen Units', 'Corrosion-Proof Heavy Gauge'],
  },
];

export default function Manufacturing({ isHome = true }) {
  const [activeTab, setActiveTab] = useState(0);
  const displayedCapabilities = isHome ? CAPABILITIES.slice(0, 3) : CAPABILITIES;

  return (
    <section className="section capabilities-section" id="manufacturing">
      <span id="capabilities" style={{ position: 'relative', top: '-90px', visibility: 'hidden' }}></span>
      <div className="container">
        <div className="section-header">
          <div className="section-label label-cyan">
            <IconWrench size={16} /> IN-HOUSE MACHINERY &bull; MAJESTIC AR TECHNOLOGY
          </div>
          <h2 className="section-title text-white">
            Advanced Machinery: <span className="text-gradient">Precision Metalworking</span>
          </h2>
          <p className="section-desc text-gray">
            Equipped with state-of-the-art CNC lasers, HACO/Energy Mission press brakes, and a 520ft robotic powder coating line for complete in-house fabrication from raw coil to finished installation.
          </p>
        </div>

        {/* Dynamic Bento-Style Capability Showcase */}
        <div className="capabilities-bento">
          {displayedCapabilities.map((cap, idx) => (
            <div
              key={cap.id}
              className={`cap-card ${activeTab === idx ? 'cap-card--active' : ''}`}
              onMouseEnter={() => setActiveTab(idx)}
            >
              <div className="cap-img-wrapper">
                <img src={cap.img} alt={cap.title} className="cap-img" loading="lazy" />
                <div className="cap-overlay"></div>
                <span className="cap-badge">{cap.badge}</span>
              </div>
              <div className="cap-content">
                <div className="cap-icon-box">{cap.icon}</div>
                <h3 className="cap-title">{cap.title}</h3>
                <p className="cap-desc">{cap.desc}</p>
                <div className="cap-specs">
                  {cap.specs.map((spec, i) => (
                    <span key={i} className="cap-spec-tag">
                      ✓ {spec}
                    </span>
                  ))}
                </div>
                <a href="#contact" className="cap-link">
                  <span>Enquire Machine Specs &amp; RFQ</span>
                  <IconArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {isHome && (
          <div className="section-cta-wrap">
            <Link href="/manufacturing" className="btn-modern-outline" id="btnViewAllMachinery">
              <span>View All Machinery &amp; Technical Specs (All 6 Units)</span>
              <IconArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
