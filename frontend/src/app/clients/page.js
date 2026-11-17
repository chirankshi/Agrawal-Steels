'use client';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ScrollAnimations from '../../components/ScrollAnimations';
import {
  IconAward,
  IconPhone,
  IconDownload
} from '../../components/Icons';
import { CLIENTS } from '../../data/clients';

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
              {CLIENTS.map((c) => (
                <div key={c.name} className="client-rich-card">
                  <div className="client-rich-logo-box">
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} className="client-rich-logo-img" />
                    ) : (
                      <span className="client-logo-text">{c.name}</span>
                    )}
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
