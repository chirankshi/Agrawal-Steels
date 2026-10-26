'use client';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import AnnouncementBar from '../../components/AnnouncementBar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ScrollAnimations from '../../components/ScrollAnimations';
import {
  IconFactory,
  IconShieldCheck,
  IconZap,
  IconAward,
  IconCheckCircle,
  IconPhone,
  IconDownload,
  IconSettings,
  IconArrowRight
} from '../../components/Icons';

export default function ManufacturingPage() {
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
              <IconFactory size={14} />
              <span>ADVANCED INFRASTRUCTURE • 50,000+ SQ. FT. COMBINED CAPACITY</span>
            </div>
            <h1 className="dedicated-hero-title">
              In-House Precision <span className="text-gradient">Manufacturing & Coating</span>
            </h1>
            <p className="dedicated-hero-subtitle">
              Majestic AR Technology operates state-of-the-art heavy engineering and metal finishing plants 
              equipped with North India&apos;s premier 520 ft automated conveyorized powder coating line, 
              CNC multi-axis hydraulic press brakes, and continuous roll-forming lines.
            </p>

            <div className="dedicated-hero-actions">
              <Link href="/contact" className="btn-primary" id="btnScheduleVisit">
                <IconPhone size={16} />
                <span>Schedule a Plant Audit / Visit</span>
              </Link>
              <a
                href="/Aggarwal_Steels_Catalogue_2026.pdf"
                download="Aggarwal_Steels_Catalogue_2026.pdf"
                className="btn-secondary"
                id="btnDownloadMachinerySpecs"
              >
                <IconDownload size={16} />
                <span>Download Machinery Specifications</span>
              </a>
            </div>
          </div>
        </section>

        {/* Core Infrastructure Highlight */}
        <section className="mfg-plant-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">FLAGSHIP FINISHING FACILITY</span>
              <h2 className="section-title">520 Ft Automated Conveyorized Powder Coating Line</h2>
              <p className="section-desc">
                Engineered for heavy warehouse racking uprights, beams, and structural assemblies. Provides unmatched corrosion resistance and uniform industrial finish.
              </p>
            </div>

            <div className="mfg-feature-grid">
              <div className="mfg-feature-card">
                <div className="mfg-icon-box">
                  <IconSettings size={28} />
                </div>
                <h3>9-Stage Chemical Pre-Treatment</h3>
                <p>
                  Components undergo heated alkaline degreasing, twin water rinses, acid derusting, phosphating, and de-mineralized passivation to create an unyielding crystalline bond.
                </p>
                <ul className="mfg-feature-list">
                  <li><IconCheckCircle size={14} /> Hot Alkaline Degreasing (60°C - 70°C)</li>
                  <li><IconCheckCircle size={14} /> Zinc / Iron Phosphating Coating</li>
                  <li><IconCheckCircle size={14} /> Total removal of mill scale & industrial oil</li>
                </ul>
              </div>

              <div className="mfg-feature-card">
                <div className="mfg-icon-box">
                  <IconZap size={28} />
                </div>
                <h3>Automated Reciprocator Powder Booth</h3>
                <p>
                  High-efficiency electrostatic spray guns with automated reciprocators guarantee uniform wrap-around coverage inside upright perforations and beam corners.
                </p>
                <ul className="mfg-feature-list">
                  <li><IconCheckCircle size={14} /> 70 to 80 Micron Dry Film Thickness (DFT)</li>
                  <li><IconCheckCircle size={14} /> Pure Polyester & Epoxy-Polyester Powders</li>
                  <li><IconCheckCircle size={14} /> Rapid Color Changes for Custom Brand Specs</li>
                </ul>
              </div>

              <div className="mfg-feature-card">
                <div className="mfg-icon-box">
                  <IconShieldCheck size={28} />
                </div>
                <h3>Precision Camel-Back Curing Oven</h3>
                <p>
                  Continuous overhead monorail conveyor passes through a 220°C temperature-controlled baking zone for complete molecular cross-linking and scratch resistance.
                </p>
                <ul className="mfg-feature-list">
                  <li><IconCheckCircle size={14} /> 500+ Hours ASTM B117 Salt Spray Tested</li>
                  <li><IconCheckCircle size={14} /> Zero Chipping, Cracking, or Orange Peel</li>
                  <li><IconCheckCircle size={14} /> Heavy Load Track: Handles up to 250 kg/hanger</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Heavy Fabrication Machinery */}
        <section className="mfg-machinery-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">FABRICATION INFRASTRUCTURE</span>
              <h2 className="section-title">Heavy Metal Forming & Shearing Equipment</h2>
              <p className="section-desc">
                High-capacity CNC machinery delivering micron-level repeatability on heavy steel plates and cold rolled coils.
              </p>
            </div>

            <div className="machinery-specs-grid">
              <div className="machinery-spec-card">
                <div className="machinery-badge">CNC Press Brakes</div>
                <h3>CNC Multi-Axis Hydraulic Bending</h3>
                <p>Capacities from 100 Ton to 250 Ton with 4000 mm bed length for complex racking uprights, box step-beams, and custom profiles.</p>
                <div className="machinery-metric-row">
                  <div>
                    <span className="metric-number">250T</span>
                    <span className="metric-label">Max Tonnage</span>
                  </div>
                  <div>
                    <span className="metric-number">4.0m</span>
                    <span className="metric-label">Max Bed Length</span>
                  </div>
                  <div>
                    <span className="metric-number">±0.2mm</span>
                    <span className="metric-label">Tolerance</span>
                  </div>
                </div>
              </div>

              <div className="machinery-spec-card">
                <div className="machinery-badge">Hydraulic Shearing</div>
                <h3>Variable Rake Heavy Shearing Machines</h3>
                <p>Precision hydraulic shearing capable of cutting MS plates up to 12 mm thickness without twist or burr formation.</p>
                <div className="machinery-metric-row">
                  <div>
                    <span className="metric-number">12mm</span>
                    <span className="metric-label">Max Plate Cut</span>
                  </div>
                  <div>
                    <span className="metric-number">3.1m</span>
                    <span className="metric-label">Blade Length</span>
                  </div>
                  <div>
                    <span className="metric-number">100%</span>
                    <span className="metric-label">Burr-Free Edge</span>
                  </div>
                </div>
              </div>

              <div className="machinery-spec-card">
                <div className="machinery-badge">Roll Forming</div>
                <h3>Automated Racking Roll Forming Lines</h3>
                <p>Continuous roll forming mills with in-line CNC punching dies for precision teardrop, diamond, and slotted hole pitches.</p>
                <div className="machinery-metric-row">
                  <div>
                    <span className="metric-number">14+</span>
                    <span className="metric-label">Roll Stations</span>
                  </div>
                  <div>
                    <span className="metric-number">12.5m</span>
                    <span className="metric-label">Single Piece Uprights</span>
                  </div>
                  <div>
                    <span className="metric-number">High-Tensile</span>
                    <span className="metric-label">IS 5986 Steel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Lab & Certifications */}
        <section className="mfg-quality-section">
          <div className="section-container">
            <div className="quality-card-banner">
              <div className="quality-text-col">
                <span className="section-tag">METALLURGY & TESTING LAB</span>
                <h2>Zero Compromise on Quality & Load Integrity</h2>
                <p>
                  Every batch of steel arriving at our plant undergoes dimensional, tensile, and chemical verification. 
                  All fabricated racking assemblies are tested under simulation for maximum rated pallet loads 
                  conforming to <strong>SEMA</strong> and <strong>EN 15512</strong> structural standards.
                </p>
                <div className="quality-badges-row">
                  <div className="q-badge">
                    <IconAward size={20} />
                    <span>ISO 9001:2015 Certified</span>
                  </div>
                  <div className="q-badge">
                    <IconShieldCheck size={20} />
                    <span>Make in India Compliant</span>
                  </div>
                  <div className="q-badge">
                    <IconCheckCircle size={20} />
                    <span>100% MTC Accompanied</span>
                  </div>
                </div>
              </div>

              <div className="quality-cta-col">
                <Link href="/contact" className="btn-primary" id="btnContactPlant">
                  <span>Speak With Plant Head</span>
                  <IconArrowRight size={16} />
                </Link>
                <a href="tel:+919999009890" className="btn-secondary">
                  <IconPhone size={16} />
                  <span>Call: +91 99990 09890</span>
                </a>
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
