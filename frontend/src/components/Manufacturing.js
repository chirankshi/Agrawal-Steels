'use client';
import { useState } from 'react';
import Link from 'next/link';
import { IconCpu, IconWrench, IconLayers, IconShieldCheck, IconArrowRight, IconZap } from './Icons';

const CAPABILITIES = [
  {
    id: 'bending',
    title: '5 CNC Tandem Bending Machines',
    badge: '5 Units • Tandem Setup',
    icon: <IconCpu size={22} />,
    desc: '5 high-precision CNC bending machines in tandem configuration for heavy multi-bend profiles, upright columns, desk panels, and complex enclosures with zero deflection.',
    img: '/images/catalogue/cnc-bending-tandem.jpg',
    specs: ['5 CNC Tandem Bending Units', 'Energy Mission & HACO Controls', 'Up to 12mm Plate Bending', 'Repeat Accuracy ±0.2mm'],
  },
  {
    id: 'shearing_press',
    title: 'High-Speed Shearing & Power Press (Up to 250T)',
    badge: 'Up to 250 Ton Capacity',
    icon: <IconZap size={22} />,
    desc: 'High-speed hydraulic shearing for precise, burr-free sheet cutting, backed by mechanical and hydraulic power presses up to 250 Ton capacity for heavy stamping and punching.',
    img: '/images/catalogue/power-press.jpg',
    specs: ['Up to 250 Ton Power Press', 'High-Speed Precision Shearing', 'Clean Burr-Free Edge Quality', 'Heavy-Duty Stamping & Piercing'],
  },
  {
    id: 'rollforming',
    title: 'Continuous Roll Forming Machine Lines',
    badge: 'In-House Cold Roll Profiling',
    icon: <IconLayers size={22} />,
    desc: 'Continuous roll forming lines specialized in manufacturing Slotted Angles, Racking Upright Columns, MKM Sections, and Omega Profiles with uniform structural rigidity.',
    img: '/images/catalogue/roll-forming-machine.jpg',
    specs: ['Slotted Angles & MKM Sections', 'Racking Uprights & Omega Profiles', 'High-Speed Continuous Roll Forming', 'Consistent Structural Tolerances'],
  },
  {
    id: 'welding',
    title: 'Miller TIG/MIG & Multi-Spot Welding',
    badge: 'Certified Welding Setup',
    icon: <IconWrench size={22} />,
    desc: 'Equipped with original Miller TIG & MIG welding stations for spotless SS and MS fabrication, along with heavy spot welding machines for electrical enclosures and panels.',
    img: '/images/catalogue/tig-mig-welding.jpg',
    specs: ['Miller TIG & MIG Power Sources', 'SS & MS Clean Penetration Welds', 'High-Speed Multi-Spot Welding', 'ISO 3834-2 Fusion Weld Certified'],
  },
  {
    id: 'powder_coating',
    title: '520 Ft Automated Powder Coating Plant',
    badge: '4-Stage Automated Line',
    icon: <IconShieldCheck size={22} />,
    desc: 'State-of-the-art 520 ft conveyorized plant with multi-stage pre-treatment, automatic reciprocator spray booth, and high-temp curing oven for durable, corrosion-proof finish.',
    img: '/images/catalogue/powder-coating-plant.jpg',
    specs: ['520 Ft Continuous Overhead Conveyor', 'Automatic Reciprocator Spray Booth', 'Multi-Stage Chemical Pre-Treatment', 'Long-Lasting High Corrosion Resistance'],
  },
  {
    id: 'material_handling',
    title: 'Heavy Material Handling (35T & 15T Cranes)',
    badge: '35 Ton Lifting Capacity',
    icon: <IconLayers size={22} />,
    desc: 'Massive plant lifting infrastructure: two 35-Ton EOT cranes (1st Bay), two 15-Ton EOT cranes (2nd Bay), 15-Ton Hydra mobile crane, and 4-Ton forklifts for 24-hour rapid dispatch.',
    img: '/images/catalogue/eot-crane-35t.jpg',
    specs: ['2x 35-Ton EOT Cranes (1st Bay)', '2x 15-Ton EOT Cranes (2nd Bay)', '15-Ton Mobile Hydra Crane', '4-Ton Heavy Industrial Forklift'],
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
            In-House Plant &amp; <span className="text-gradient">Advanced Machinery</span>
          </h2>
          <p className="section-desc text-gray">
            Equipped with 5 CNC tandem press brakes, up to 250-Ton power presses, continuous roll forming, 35-Ton heavy EOT cranes, and North India&apos;s premier 520ft automated powder coating line.
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
                <div className="cap-head">
                  <div className="cap-icon-box">{cap.icon}</div>
                  <h3 className="cap-title">{cap.title}</h3>
                </div>
                <p className="cap-desc">{cap.desc}</p>
                <ul className="cap-specs">
                  {cap.specs.map((spec, i) => (
                    <li key={i} className="cap-spec-tag">{spec}</li>
                  ))}
                </ul>
                <a href="#contact" className="cap-link">
                  <span>Enquire about this</span>
                  <IconArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {isHome && (
          <div className="section-cta-wrap">
            <Link href="/manufacturing" className="btn-modern-outline" id="btnViewAllMachinery">
              <span>View all machinery &amp; plant specs</span>
              <IconArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
