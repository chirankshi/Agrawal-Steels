'use client';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import AnnouncementBar from '../../components/AnnouncementBar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ScrollAnimations from '../../components/ScrollAnimations';
import {
  IconAward,
  IconShieldCheck,
  IconCheckCircle,
  IconArrowRight,
  IconPhone,
  IconDownload,
  IconZap,
  IconGlobe
} from '../../components/Icons';

const CLIENTS_LIST = [
  { name: 'Amazon', logo: '/images/brand/clients/client_logo_1.png', category: 'Warehousing & E-Commerce', project: 'High-Bay Pallet Racking & Multi-Tier Shelving' },
  { name: 'Maruti Suzuki', logo: '/images/brand/clients/client_logo_2.png', category: 'Automotive & Manufacturing', project: 'Heavy-Duty Storage & Press Component Racks' },
  { name: 'M3M India', logo: '/images/brand/clients/client_logo_3.png', category: 'Real Estate & Infrastructure', project: 'Structural Steel Beams, Plates & PEB Supply' },
  { name: 'Afcons Infrastructure', logo: '/images/brand/clients/client_logo_4.png', category: 'Civil & Heavy Engineering', project: 'Heavy ISMB Girders & Bridge Structural Steel' },
  { name: 'KEI Industries', logo: '/images/brand/clients/client_logo_5.png', category: 'Power & Cables', project: 'Cable Drum Heavy Cantilever Racking & Structural Steel' },
  { name: 'National Logistics Hub', logo: '/images/brand/clients/client_logo_6.png', category: '3PL Logistics & Cold Storage', project: 'Drive-in & Double-Deep Pallet Storage Racks' },
  { name: 'Apex Industrial', logo: '/images/brand/clients/client_logo_7.png', category: 'Industrial Fabrication', project: 'Cold Rolled Sheets & In-House Powder Coating' },
  { name: 'Paramount Infra', logo: '/images/brand/clients/client_logo_8.png', category: 'PEB Warehouses', project: 'Pre-Engineered Building Structural Framing' },
  { name: 'Continental Spares', logo: '/images/brand/clients/client_logo_9.png', category: 'Automotive Spares', project: 'Multi-Tier Picking Mezzanines & Slotted Shelving' },
  { name: 'Pinnacle Logistics', logo: '/images/brand/clients/client_logo_10.png', category: 'Supply Chain Hubs', project: 'Custom Storage Racking & Conveyor Walkways' },
  { name: 'Sterling Engineering', logo: '/images/brand/clients/client_logo_11.png', category: 'Precision Machinery', project: 'High-Tensile MS Plates & CNC Laser Cutting Supply' },
];

const SECTORS = [
  {
    title: 'E-Commerce & 3PL Logistics',
    stat: '45,000+ Pallet Positions',
    desc: 'High-density selective pallet racking, multi-tier picking mezzanines, and gravity flow racking for India&apos;s leading e-commerce and logistics networks.',
  },
  {
    title: 'Automotive & Engineering OEMs',
    stat: '15,000+ Metric Tonnes Delivered',
    desc: 'High-precision CR coils, HR plates, and custom fabricated assembly fixtures supplied with zero defect tolerances for automotive component manufacturers.',
  },
  {
    title: 'Real Estate, PEB & Infrastructure',
    stat: '100+ Mega Commercial Sites',
    desc: 'Primary structural steel beams (ISMB/NPB), heavy angles, and certified mill plates for industrial sheds, commercial towers, and highway flyovers.',
  },
  {
    title: 'Power, Cables & Heavy Yards',
    stat: '99.4% On-Time SLA Record',
    desc: 'Specialized heavy-duty cantilever racks designed for massive cable reels, long structural tubes, and raw bar stock with easy forklift access.',
  },
];

export default function ClientsPage() {
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
              <span>CLIENTELE & PROJECTS • NATIONWIDE REPUTATION</span>
            </div>
            <h1 className="dedicated-hero-title">
              Trusted by India&apos;s <span className="text-gradient">Industry Leaders</span>
            </h1>
            <p className="dedicated-hero-subtitle">
              From multinational e-commerce fulfilment centres and automotive manufacturing majors 
              to leading infrastructure developers, Aggarwal Steels &amp; Majestic AR Technology 
              have delivered verified steel supply and turnkey storage systems across India.
            </p>

            <div className="dedicated-hero-actions">
              <Link href="/contact" className="btn-primary" id="btnPartnerWithUs">
                <IconPhone size={16} />
                <span>Partner With Us on Your Next Project</span>
              </Link>
              <a
                href="/Aggarwal_Steels_Catalogue_2026.pdf"
                download="Aggarwal_Steels_Catalogue_2026.pdf"
                className="btn-secondary"
                id="btnDownloadClientCatalog"
              >
                <IconDownload size={16} />
                <span>Download Client & Project Portfolio</span>
              </a>
            </div>
          </div>
        </section>

        {/* Client Logos Grid */}
        <section className="clients-showcase-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">VALUED CLIENT PORTFOLIO</span>
              <h2 className="section-title">Corporate Partners &amp; Enterprise Clients</h2>
              <p className="section-desc">
                Official client associations documented in our certified corporate catalogue.
              </p>
            </div>

            <div className="clients-rich-grid">
              {CLIENTS_LIST.map((c, i) => (
                <div key={i} className="client-rich-card">
                  <div className="client-rich-logo-box">
                    <img src={c.logo} alt={c.name} className="client-rich-logo-img" />
                  </div>
                  <div className="client-rich-info">
                    <h4>{c.name}</h4>
                    <span className="client-sector-tag">{c.category}</span>
                    <p className="client-project-desc">{c.project}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sectors Served */}
        <section className="sectors-served-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">INDUSTRY FOOTPRINT</span>
              <h2 className="section-title">Specialized Steel &amp; Racking Solutions by Sector</h2>
              <p className="section-desc">
                Engineering tailored to the unique load bearing and operational throughput demands of every vertical.
              </p>
            </div>

            <div className="sectors-grid">
              {SECTORS.map((s, idx) => (
                <div key={idx} className="sector-card">
                  <span className="sector-stat-badge">{s.stat}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLA Guarantee Strip */}
        <section className="client-sla-section">
          <div className="section-container">
            <div className="sla-banner">
              <div className="sla-col">
                <span className="sla-number">24h</span>
                <h4>Guaranteed Dispatch</h4>
                <p>Ready inventory on all standard sizes of HR/CR plates and structural sections.</p>
              </div>
              <div className="sla-col">
                <span className="sla-number">100%</span>
                <h4>MTC Accompanied</h4>
                <p>Every dispatch accompanied by certified Mill Test Certificates matching heat numbers.</p>
              </div>
              <div className="sla-col">
                <span className="sla-number">500h+</span>
                <h4>Salt Spray Tested</h4>
                <p>Powder coating tested to exceed standard ASTM B117 anti-corrosion benchmarks.</p>
              </div>
              <div className="sla-col">
                <span className="sla-number">Turnkey</span>
                <h4>Installation Team</h4>
                <p>Trained structural erection crews handling on-site assembly across India.</p>
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
