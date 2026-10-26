'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import AnnouncementBar from '../../components/AnnouncementBar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ScrollAnimations from '../../components/ScrollAnimations';
import {
  IconArrowRight,
  IconCheckCircle,
  IconShieldCheck,
  IconFileText,
  IconPhone,
  IconClock,
  IconAward,
  IconZap,
  IconDownload
} from '../../components/Icons';

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'primary', label: 'Primary Steel Supply' },
  { id: 'racks', label: 'Industrial Storage Racks' },
  { id: 'mezzanine', label: 'Mezzanine Floors' },
  { id: 'ss', label: 'SS & Custom Fabrication' },
];

const PRODUCTS_DATA = [
  // Primary Steel Supply
  {
    id: 'hr-plates',
    category: 'primary',
    name: 'Hot Rolled (HR) Plates & Coils',
    tagline: 'Direct Mill Sourcing from SAIL, TATA, JSPL & AMNS',
    desc: 'High-strength structural quality HR plates and coils with exceptional weldability and formability. Supplied with complete Mill Test Certificates (MTC) and ultrasonic testing on demand.',
    badge: 'Mill Certified',
    grades: 'IS 2062 E250 / E350, ASTM A36, S355JR',
    thickness: '1.6 mm to 100 mm',
    standardSizes: '1250 x 6000 mm, 1500 x 6000 mm, 2000 x 6000 mm, 2500 x 12000 mm',
    dispatch: '24-Hour Express Dispatch from Ready Inventory',
    applications: ['Heavy Machinery Bases', 'PEB Fabrication', 'Pressure Vessels', 'Infrastructure Foundations', 'Railway Wagons'],
  },
  {
    id: 'cr-sheets',
    category: 'primary',
    name: 'Cold Rolled (CR) Sheets & Coils',
    tagline: 'Precision Thickness & Flawless Surface Finish',
    desc: 'Close dimensional tolerance CR sheets engineered for precision sheet metal pressing, deep drawing, automated CNC bending, and electrical cabinet enclosures.',
    badge: 'Precision Grade',
    grades: 'IS 513 CR1 / CR2 / CR3 (D & DD Grade)',
    thickness: '0.40 mm to 3.20 mm',
    standardSizes: '900 x 2500 mm, 1250 x 2500 mm, Coils up to 1500 mm width',
    dispatch: 'Available in Slit Coils & Custom Cut-to-Length Sheets',
    applications: ['Automobile Components', 'Racking Uprights & Panels', 'Electrical Control Panels', 'Appliance Enclosures'],
  },
  {
    id: 'chequered-plates',
    category: 'primary',
    name: 'MS Chequered Plates (Tear / Diamond Pattern)',
    tagline: 'Anti-Skid Safety Flooring & Mezzanine Walkways',
    desc: 'Heavy-duty tear pattern chequered plates offering superior slip resistance, high durability, and impact tolerance for heavy industrial traffic and forklift walkways.',
    badge: 'Safety Grade',
    grades: 'IS 2062 E250 A / BR',
    thickness: '3.0 mm to 12.0 mm',
    standardSizes: '1250 x 5000 mm, 1500 x 6000 mm',
    dispatch: 'Ready Stock in Delhi NCR & Bhiwadi Warehouses',
    applications: ['Mezzanine Floor Decking', 'Industrial Stair Treads', 'Truck & Trailer Beds', 'Shipbuilding Decks', 'Bridge Footpaths'],
  },
  {
    id: 'structural-steel',
    category: 'primary',
    name: 'Structural Steel Sections (Beams, Channels & Angles)',
    tagline: 'IS 2062 Grade Primary Heavy Structural Sections',
    desc: 'Heavy structural beams (ISMB / NPB / WPB), parallel flange channels (ISMC / MC), and equal/unequal angles engineered for high-rise PEB structures and load-bearing columns.',
    badge: 'Primary Brand',
    grades: 'IS 2062 E250 / E350 (SAIL, RINL, JSPL)',
    thickness: 'Beams 100 mm to 600 mm, Channels 75 mm to 400 mm, Angles 25x3 to 200x20',
    standardSizes: 'Standard 6m, 11.5m to 12.5m Commercial Lengths',
    dispatch: 'Full Trailer Load (FTL) & Part Truck Load (PTL) across India',
    applications: ['Industrial Shed Columns', 'Warehouse Racking Baseframes', 'Overhead Crane Girders', 'Bridges & Towers'],
  },
  {
    id: 'ms-pipes',
    category: 'primary',
    name: 'Hollow Sections (SHS, RHS) & MS Pipes',
    tagline: 'Apollo & Primary Brand Structural Hollow Sections',
    desc: 'Square Hollow Sections (SHS), Rectangular Hollow Sections (RHS), and ERW MS pipes tested for high torsional rigidity, uniform strength-to-weight ratio, and clean aesthetic fabrication.',
    badge: 'High Rigidity',
    grades: 'IS 4923 (YSt 210 / 310 / 355), IS 1239 / 3589',
    thickness: '1.6 mm to 10.0 mm',
    standardSizes: 'SHS: 15x15 to 300x300 mm | RHS: 25x15 to 400x200 mm',
    dispatch: 'Stocked in all standard sizes with immediate dispatch',
    applications: ['Warehouse Trusses', 'Mezzanine Support Columns', 'Architectural Steel Framework', 'Solar Mounting Structures'],
  },

  // Industrial Storage Racks (Majestic AR Technology)
  {
    id: 'heavy-duty-pallet-racks',
    category: 'racks',
    name: 'Heavy-Duty Pallet Racking Systems',
    tagline: 'Selective, Double-Deep & Drive-In High-Bay Systems',
    desc: 'Engineered for high-density warehouse storage with up to 4,500 kg capacity per beam level. Fabricated with roll-formed high-tensile uprights and finished in our 520 ft automated powder coating plant.',
    badge: 'Warehouse Ready',
    grades: 'High-Tensile IS 5986 / IS 2062 Steel',
    thickness: 'Uprights: 1.8 mm to 3.0 mm | Beams: 1.6 mm to 2.5 mm box beam',
    standardSizes: 'Heights up to 12.5 Meters | Custom Bay Widths & Depths',
    dispatch: 'Turnkey Supply with Professional On-Site Installation Team',
    applications: ['3PL Logistics Hubs', 'E-Commerce Fulfillment Centers (Amazon, Flipkart)', 'FMCG & Cold Storage', 'Automotive Warehouses'],
  },
  {
    id: 'cantilever-racks',
    category: 'racks',
    name: 'Heavy-Duty Cantilever Racking',
    tagline: 'Ideal for Pipes, Tubes, Long Steel Bars & Timber',
    desc: 'Open-front design with adjustable cantilever arms supporting up to 1,500 kg per arm. Eliminates front column interference for rapid forklift loading of oversized materials.',
    badge: 'Heavy Tonnage',
    grades: 'Structural I-Beam & Heavy Tubular Construction',
    thickness: 'Heavy Gauge Heavy Duty Structural Columns',
    standardSizes: 'Arm Lengths 600 mm to 1800 mm | Column Heights up to 8m',
    dispatch: 'Engineered CAD Drawings & Turnkey Delivery',
    applications: ['Steel Pipe & Bar Yards', 'Aluminium Extrusions', 'Plywood & Gypsum Board Storage', 'Automotive Chassis Storage'],
  },
  {
    id: 'slotted-angle-racks',
    category: 'racks',
    name: 'Industrial Slotted Angle & Long-Span Shelving',
    tagline: 'Flexible Multi-Tier Hand-Loaded Storage',
    desc: 'Versatile, bolted slotted angle racks with adjustable panel heights and corner plates. Powder-coated 70-80 microns for rust-proof archival and retail spares inventory.',
    badge: 'High Utility',
    grades: 'Cold Rolled Steel (IS 513) with Epoxy Polyester Coating',
    thickness: 'Angles: 1.8 mm to 2.5 mm | Shelves: 0.8 mm to 1.6 mm',
    standardSizes: 'Heights: 6ft, 7ft, 8ft, 10ft | Depths: 12", 15", 18", 24", 36"',
    dispatch: 'Ready Stock Kits for Immediate Pick-Up or Dispatch',
    applications: ['Industrial Spares Stores', 'Document & Record Archives', 'Retail Backroom Storage', 'Pharma Sample Warehouses'],
  },

  // Mezzanine Floors
  {
    id: 'mezzanine-floors',
    category: 'mezzanine',
    name: 'Multi-Tier Industrial Mezzanine Floors',
    tagline: 'Double or Triple Your Usable Warehouse Floor Area',
    desc: 'Self-supporting structural mezzanine systems designed without taking support from the building structure. Equipped with staircases, safety handrails, pallet drop gates, and chequered or wooden deck flooring.',
    badge: 'Space Multiplier',
    grades: 'Heavy ISMB / NPB Columns & Roll-Formed C/Z Purlins',
    thickness: 'Engineered Load Ratings: 300 kg/m² to 1500 kg/m²',
    standardSizes: 'Custom Designed per Warehouse Clear Height & Column Spacing',
    dispatch: 'Turnkey Structural Design, Fabrication, Powder Coating & Erection',
    applications: ['Warehouse Picking Mezzanines', 'Office Over Factory Floor', 'Maintenance Platforms', 'E-Commerce Sortation Centers'],
  },

  // SS Fabrication
  {
    id: 'ss-commercial-kitchen',
    category: 'ss',
    name: 'Commercial Stainless Steel Kitchen & Food Processing Units',
    tagline: 'Food-Grade SS 304 / SS 316 Hygienic Fabrication',
    desc: 'Heavy-gauge commercial SS work tables, sink units, exhaust hoods, Bain Marie, tandoor tables, and cold storage shelving fabricated with precision TIG welding and sanitary polished finishes.',
    badge: 'Food Grade',
    grades: 'AISI SS 304 / SS 316 Food Grade Stainless Steel',
    thickness: '16 Gauge (1.6 mm) to 20 Gauge (0.9 mm)',
    standardSizes: 'Standard Modular Units & 100% Customized Kitchen Layouts',
    dispatch: 'Fabricated with In-House CNC Laser & Bending',
    applications: ['Cloud Kitchens & Fine Dining Hotels', 'Hospital & Institutional Pantries', 'Food Processing Facilities', 'Pharmaceutical Labs'],
  },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = PRODUCTS_DATA.filter(prod => {
    const matchCategory = activeCategory === 'all' || prod.category === activeCategory;
    const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prod.grades.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prod.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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
              <span>OFFICIAL PRODUCT DIRECTORY • 2026 SPECIFICATIONS</span>
            </div>
            <h1 className="dedicated-hero-title">
              Certified Primary Steel & <span className="text-gradient">Engineered Systems</span>
            </h1>
            <p className="dedicated-hero-subtitle">
              Sourced directly from India&apos;s tier-1 primary producers (SAIL, TATA Steel, JSPL, AMNS, Apollo) 
              and engineered at our ISO 9001:2015 certified Bahadurgarh & Bhiwadi manufacturing plants. 
              Supplied with genuine Mill Test Certificates (MTC) and guaranteed 24-hour dispatch on stock items.
            </p>

            <div className="dedicated-hero-actions">
              <a
                href="/Aggarwal_Steels_Catalogue_2026.pdf"
                download="Aggarwal_Steels_Catalogue_2026.pdf"
                className="btn-primary"
                id="btnDownloadCatalogProducts"
              >
                <IconDownload size={16} />
                <span>Download 2026 Full Catalogue (PDF)</span>
              </a>
              <Link href="/contact" className="btn-secondary" id="btnRequestQuoteProducts">
                <IconPhone size={16} />
                <span>Get Instant Tonnage Quote</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="products-filter-section">
          <div className="section-container">
            <div className="filter-controls-flex">
              <div className="category-pill-group">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search grade (e.g. IS 2062, Pallet Racks, HR Plates)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="product-search-input"
                />
              </div>
            </div>

            <div className="search-results-count">
              Showing <strong>{filtered.length}</strong> certified industrial product lines
            </div>

            {/* Products List */}
            <div className="products-detailed-grid">
              {filtered.map(item => (
                <article key={item.id} className="product-detailed-card" id={item.id}>
                  <div className="product-detailed-header">
                    <div>
                      <span className="product-category-tag">{item.badge}</span>
                      <h2 className="product-detailed-name">{item.name}</h2>
                      <p className="product-detailed-tagline">{item.tagline}</p>
                    </div>
                    <Link
                      href={`/contact?product=${encodeURIComponent(item.name)}`}
                      className="btn-card-quote"
                    >
                      <span>Inquire Tonnage</span>
                      <IconArrowRight size={14} />
                    </Link>
                  </div>

                  <p className="product-detailed-desc">{item.desc}</p>

                  <div className="specs-table-wrapper">
                    <table className="specs-table">
                      <tbody>
                        <tr>
                          <td className="spec-label">Grades / Standards</td>
                          <td className="spec-val font-accent">{item.grades}</td>
                        </tr>
                        <tr>
                          <td className="spec-label">Thickness / Dimensions</td>
                          <td className="spec-val">{item.thickness}</td>
                        </tr>
                        <tr>
                          <td className="spec-label">Standard Sizes / Length</td>
                          <td className="spec-val">{item.standardSizes}</td>
                        </tr>
                        <tr>
                          <td className="spec-label">Dispatch Lead Time</td>
                          <td className="spec-val text-success">
                            <IconCheckCircle size={13} style={{ display: 'inline', marginRight: 5 }} />
                            {item.dispatch}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="product-applications-wrap">
                    <span className="app-title">Key Industrial Applications:</span>
                    <div className="app-tags">
                      {item.applications.map((app, idx) => (
                        <span key={idx} className="app-tag-item">{app}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Technical MS Steel Reference Guide */}
        <section className="tech-guide-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">ENGINEERING REFERENCE GUIDE</span>
              <h2 className="section-title">Standard MS Plate & Sheet Weight Chart</h2>
              <p className="section-desc">
                Useful weight calculation reference for purchase managers, structural engineers, and fabricators.
                Formula: Weight (kg) = Thickness (mm) × Width (m) × Length (m) × 7.85
              </p>
            </div>

            <div className="weight-chart-wrapper">
              <table className="weight-chart-table">
                <thead>
                  <tr>
                    <th>Thickness (mm)</th>
                    <th>Weight per Sq. Meter (kg/m²)</th>
                    <th>Standard Sheet (1250 x 2500 mm)</th>
                    <th>Standard Plate (1500 x 6000 mm)</th>
                    <th>Standard Plate (2000 x 6000 mm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>2.0 mm</td><td>15.70 kg</td><td>49.06 kg</td><td>141.30 kg</td><td>188.40 kg</td></tr>
                  <tr><td>3.15 mm</td><td>24.73 kg</td><td>77.27 kg</td><td>222.55 kg</td><td>296.73 kg</td></tr>
                  <tr><td>5.0 mm</td><td>39.25 kg</td><td>122.66 kg</td><td>353.25 kg</td><td>471.00 kg</td></tr>
                  <tr><td>8.0 mm</td><td>62.80 kg</td><td>196.25 kg</td><td>565.20 kg</td><td>753.60 kg</td></tr>
                  <tr><td>10.0 mm</td><td>78.50 kg</td><td>245.31 kg</td><td>706.50 kg</td><td>942.00 kg</td></tr>
                  <tr><td>12.0 mm</td><td>94.20 kg</td><td>294.38 kg</td><td>847.80 kg</td><td>1,130.40 kg</td></tr>
                  <tr><td>16.0 mm</td><td>125.60 kg</td><td>392.50 kg</td><td>1,130.40 kg</td><td>1,507.20 kg</td></tr>
                  <tr><td>20.0 mm</td><td>157.00 kg</td><td>490.63 kg</td><td>1,413.00 kg</td><td>1,884.00 kg</td></tr>
                  <tr><td>25.0 mm</td><td>196.25 kg</td><td>613.28 kg</td><td>1,766.25 kg</td><td>2,355.00 kg</td></tr>
                  <tr><td>32.0 mm</td><td>251.20 kg</td><td>785.00 kg</td><td>2,260.80 kg</td><td>3,014.40 kg</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mtc-notice-box">
              <IconShieldCheck size={28} className="mtc-icon" />
              <div>
                <h4>100% Traceability & Mill Test Certificates (MTC)</h4>
                <p>
                  Every consignment dispatched by Aggarwal Steels is accompanied by manufacturer MTCs matching Heat Numbers,
                  chemical composition (C, Mn, S, P), and mechanical properties (Yield Strength, Tensile Strength, Elongation).
                </p>
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
