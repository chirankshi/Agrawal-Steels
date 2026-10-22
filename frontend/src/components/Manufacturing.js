'use client';
import { useState } from 'react';
import { IconCpu, IconWrench, IconLayers, IconShieldCheck, IconArrowRight } from './Icons';

const CAPABILITIES = [
  {
    id: 'cnc',
    title: 'CNC Bending & Precision Sheet Processing',
    badge: 'In-House Machinery',
    icon: <IconCpu size={22} />,
    desc: 'Advanced CNC hydraulic press brake machinery delivering precision bends, custom profiling, and angular accuracy for HR, CR, and Stainless Steel sheets up to 12mm thickness.',
    img: '/images/cnc_bending.jpeg',
    specs: ['Hydraulic CNC Control', 'Bending up to 12mm', 'Tolerance ±0.2mm', 'Complex Profiles'],
  },
  {
    id: 'racking',
    title: 'Heavy-Duty Industrial Storage Racking',
    badge: 'Majestic AR Technology',
    icon: <IconLayers size={22} />,
    desc: 'Complete warehouse storage engineering through our sister concern Majestic AR Technology Pvt. Ltd. — heavy-duty pallet racks, mezzanine flooring, and cantilever systems.',
    img: '/images/storage_racking.jpeg',
    specs: ['Heavy Pallet Racking', 'Multi-Tier Mezzanine', 'High Load Capacity', 'Turnkey Warehouse Fit-outs'],
  },
  {
    id: 'welding',
    title: 'Structural Support Welding & PEB Fabrication',
    badge: 'Engineered Strength',
    icon: <IconWrench size={22} />,
    desc: 'High-tensile structural welding, column fabrication, truss assemblies, and pre-engineered steel building (PEB) structural components built strictly to industrial load standards.',
    img: '/images/support_welding.jpeg',
    specs: ['MIG & TIG Certified', 'Heavy Beam Assembly', 'Base Plate Jointing', 'Load Tested Fabrication'],
  },
  {
    id: 'kitchen',
    title: 'Commercial Stainless Steel Kitchen Equipment',
    badge: 'Food-Grade SS 304',
    icon: <IconShieldCheck size={22} />,
    desc: 'Custom hygiene-compliant stainless steel fabrication for commercial hotels, industrial cafeterias, and institutional kitchens — worktables, exhaust hoods, and wash units.',
    img: '/images/commercial_kitchen.jpeg',
    specs: ['SS 304 / 202 Grades', 'Sanitary Finish', 'Custom Workstations', 'Corrosion Proof'],
  },
];

export default function Manufacturing() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="section capabilities-section" id="capabilities">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-cyan">
            <IconWrench size={16} /> Advanced Manufacturing &amp; Engineering
          </div>
          <h2 className="section-title text-white">
            Beyond Sourcing: <span className="text-gradient">In-House Fabrication</span>
          </h2>
          <p className="section-desc text-gray">
            Aggarwal Steels &amp; its sister manufacturing arm <strong>Majestic AR Technology</strong> combine primary steel supply with modern CNC metalworking, structural welding, and turn-key racking solutions.
          </p>
        </div>

        {/* Dynamic Bento-Style Capability Showcase */}
        <div className="capabilities-bento">
          {CAPABILITIES.map((cap, idx) => (
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
                  <span>Enquire Custom Fabrication</span>
                  <IconArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
