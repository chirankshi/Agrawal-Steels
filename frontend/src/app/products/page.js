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
  { id: 'all', label: 'All Products (14 Lines)' },
  { id: 'racks', label: 'Storage & Warehouse Racking' },
  { id: 'mezzanine', label: 'Mezzanine & Multi-Tier' },
  { id: 'structural', label: 'Heavy Structural & PEB' },
  { id: 'sheetmetal', label: 'SS Kitchen & Sheet Metal' },
  { id: 'primary', label: 'Primary Steel Dealerships' },
];

const PRODUCTS_DATA = [
  // --- 1. STORAGE & WAREHOUSE RACKING (Pages 12-16) ---
  {
    id: 'heavy-duty-pallet-racks',
    category: 'racks',
    name: 'Heavy-Duty Pallet Racking Systems',
    tagline: 'Selective, Double-Deep, Drive-In & Narrow Aisle High-Bay Racks',
    desc: 'Engineered for high-density warehouse pallet storage with up to 4,000 kg capacity per beam level. Uprights roll-formed in-house and finished in our 520 ft automated conveyorized powder coating plant.',
    badge: 'Warehouse Flagship',
    grades: 'High-Tensile Cold Rolled IS 5986 / IS 2062 Steel',
    thickness: 'Uprights: 1.8 mm to 3.2 mm | Heavy Box Step-Beams',
    standardSizes: 'Heights up to 12.5 Meters | Custom Bay Widths & Depths',
    dispatch: 'Turnkey Design, Manufacturing, Powder Coating & On-Site Installation',
    applications: ['3PL Logistics Hubs', 'E-Commerce Fulfillment Centers (Amazon, Zepto)', 'FMCG Warehouses', 'Cold Storage Facilities'],
  },
  {
    id: 'cantilever-racks',
    category: 'racks',
    name: 'Heavy-Duty Cantilever Racking Systems',
    tagline: 'Ideal for Pipes, Tubes, Long Structural Sections & Timber',
    desc: 'Open-front design with adjustable cantilever arms supporting up to 1,500 kg per arm. Eliminates front column interference for rapid forklift loading of oversized materials.',
    badge: 'Long Goods Storage',
    grades: 'Heavy Structural ISMB Columns & High-Tensile Tubular Construction',
    thickness: 'Heavy Gauge Structural Steel Base & Arms',
    standardSizes: 'Arm Lengths 600 mm to 1800 mm | Column Heights up to 8m',
    dispatch: 'Engineered CAD Drawings & Turnkey Erection',
    applications: ['Steel Pipe & Bar Yards', 'Aluminium Extrusions', 'Plywood & Timber Storage', 'Automotive Chassis Stacking'],
  },
  {
    id: 'metal-pallets-accessories',
    category: 'racks',
    name: 'Metal Pallets, Column Guards & Rack Accessories',
    tagline: 'Powder-Coated & GI Pallets with Full Impact Protection Accessories',
    desc: 'Heavy-duty steel pallets (powder-coated, slatted, hot-dip GI, and custom designs) built for heavy load-bearing and cold storage. Coupled with Column Guards, Row Guards, Wire Mesh Partitions, and Pallet Support Bars (PSB).',
    badge: 'Impact Tested',
    grades: 'Heavy Mild Steel & Hot-Dip Galvanized (GI)',
    thickness: 'Load Capacity: 500 kg to 2,000 kg',
    standardSizes: '1000 x 1200 mm standard or 100% Custom Dimensional Profiles',
    dispatch: 'Ready Stock & Custom Manufacturing from Bhiwadi Unit',
    applications: ['Forklift Impact Protection', 'Cold Storage Goods', 'Heavy Industrial Storage', 'Wire Mesh Segregation'],
  },
  {
    id: 'material-handling-trolleys',
    category: 'racks',
    name: 'Material Handling Trolleys & Components',
    tagline: 'Platform Trolleys, Mesh-Side Trolleys & Roll Cage Containers',
    desc: 'Industrial material handling trolleys designed for effortless order picking in high-volume distribution centers, alongside essential racking hardware: Pallet Back Stoppers and Anchor Base Plates.',
    badge: 'Intralogistics',
    grades: 'Heavy Tubular Steel Framework with Heavy-Duty Swivel Castor Wheels',
    thickness: 'Load Ratings: 250 kg to 1,000 kg per trolley',
    standardSizes: 'Standard Platform Sizes & Custom Foldable Roll Cages',
    dispatch: 'Fast Dispatch Across Delhi NCR & Pan India',
    applications: ['Order Fulfillment Centers', 'Assembly Line Transport', 'Retail Backroom Picking', 'Heavy Tool Transport'],
  },

  // --- 2. MEZZANINE & MULTI-TIER SYSTEMS (Page 14) ---
  {
    id: 'mezzanine-floors',
    category: 'mezzanine',
    name: 'Multi-Tier Industrial Mezzanine Floors',
    tagline: 'Double or Triple Your Usable Facility Area Vertically',
    desc: 'Self-supporting heavy structural mezzanine platforms designed without civil modifications to the parent building. Supplied with safety handrails, staircases, pallet pivot gates, and chequered or wooden deck panels.',
    badge: 'Space Multiplier',
    grades: 'Heavy ISMB / NPB Columns, Built-Up Girders & C/Z Purlins',
    thickness: 'Engineered Load Capacity: 300 kg/m² to 1,500 kg/m²',
    standardSizes: 'Custom Column Spans up to 8m x 8m Grid Layouts',
    dispatch: 'Turnkey Structural Design, 520ft Powder Coating & Site Installation',
    applications: ['Warehouse Picking Mezzanines', 'Office Over Shopfloor', 'Sortation Hubs', 'High-Density Archive Storage'],
  },
  {
    id: 'multi-tier-racks',
    category: 'mezzanine',
    name: '2-Tier & 3-Tier Multi-Level Racking Systems',
    tagline: 'Walkway-Integrated High-Density Carton & Bin Storage',
    desc: 'Integrated rack-supported multi-tier structures that utilize full ceiling clearance for multi-level order picking with staircases and goods lift integration.',
    badge: 'High-Density Picking',
    grades: 'High-Tensile Cold Rolled Uprights & Heavy Walkway Decking',
    thickness: 'Up to 3 Tiers (Ground + 2 Levels)',
    standardSizes: 'Engineered per warehouse clear height',
    dispatch: 'Complete Turnkey Delivery with Structural Load Certificates',
    applications: ['Pharma Distribution', 'E-Commerce Fashion & Footwear Sortation', 'Automotive Spares Hubs'],
  },

  // --- 3. HEAVY STRUCTURAL & PEB (Pages 22-24, 26) ---
  {
    id: 'heavy-structural-peb',
    category: 'structural',
    name: 'Heavy Structural Steel Fabrication & PEB (Unit 1)',
    tagline: '700 to 1,000 MT Monthly Fabrication Capacity Under ISO 3834-2',
    desc: 'Pre-Engineered Buildings (PEB), Heavy Industrial Sheds, Bridge Structures, EOT Crane Girders, Railway Overbridges / Foot Overbridges (ROB / FOB), and Transmission Tower Structures fabricated with submerged arc welding.',
    badge: '1,000 MT / Mo Capacity',
    grades: 'IS 2062 Grade E250 / E350 BR/BO High Tensile',
    thickness: 'Built-up plate sections up to 63mm thickness',
    standardSizes: 'Clear Spans up to 60 Meters | Bay Spacings up to 9 Meters',
    dispatch: 'Full Trailer Loads (FTL) with On-Site Erection Crew',
    applications: ['Turnkey Factory Buildings', 'Heavy PEB Warehouses', 'Highway Flyovers & ROB Bridges', 'Crane Bay Runways'],
  },
  {
    id: 'road-crash-barriers',
    category: 'structural',
    name: 'Road Crash Barriers (Hot-Dip Galvanized W-Beam)',
    tagline: 'Certified Highway Safety Systems per MoRTH & AASHTO Standards',
    desc: 'High-safety cold-formed W-Beam metal crash barriers with spacer channels, anchor posts, and high-tensile fasteners. Hot-dip galvanized for decades of zero maintenance in all weather conditions.',
    badge: 'MoRTH Standard',
    grades: 'IS 2062 / IS 5986 Steel Hot-Dip Galvanized to 550 GSM',
    thickness: 'Beam: 3.0 mm | Post: 5.0 mm heavy channel section',
    standardSizes: 'Standard 4318 mm length beam sections',
    dispatch: 'Ready Stock for Fast Highway Project Dispatches',
    applications: ['National & State Expressways', 'Flyover & Bridge Approaches', 'Industrial Plant Perimeter Safety', 'Mountain Roads'],
  },

  // --- 4. SS COMMERCIAL KITCHEN & SHEET METAL (Pages 17-20) ---
  {
    id: 'ss-commercial-kitchen',
    category: 'sheetmetal',
    name: 'Commercial Stainless Steel (SS) Kitchen Equipment',
    tagline: 'Food-Grade SS 304 Sanitary Fabrication for Hotels & Cloud Kitchens',
    desc: 'Heavy-gauge commercial SS work tables with backsplash, cooking ranges, Bain Marie, pot storage racks, dual-sink dish wash stations, and exhaust hoods with grease filtration.',
    badge: 'SS 304 Hygienic',
    grades: 'AISI SS 304 / SS 316 Food Grade (No. 4 Brushed Finish)',
    thickness: '16 Gauge (1.6 mm) to 18 Gauge (1.2 mm) Heavy Sheet',
    standardSizes: 'Modular Worktable Sizes (4ft, 5ft, 6ft) & 100% Custom Layouts',
    dispatch: 'Sanitary TIG Welded with Scotch-Brite Satin Finish',
    applications: ['Commercial Cloud Kitchens', '5-Star Hotels & Restaurants', 'Hospital & Corporate Pantries', 'Food Processing Facilities'],
  },
  {
    id: 'ms-sheet-metal-cabinets',
    category: 'sheetmetal',
    name: 'MS Precision Sheet Metal Enclosures & Cabinets',
    tagline: 'Tandem CNC Bent Electrical & Automation Control Enclosures',
    desc: 'Industrial control panel cabinets, server racks, heavy-duty workshop workbenches with drawers, perforated sheets, cable trays, and custom mounting brackets.',
    badge: '5 Tandem Bending',
    grades: 'CRCA / GI Sheet Metal (0.8 mm to 4.0 mm)',
    thickness: 'High Precision Tolerances ±0.2 mm',
    standardSizes: 'Custom Fabricated per CAD / DXF Drawings',
    dispatch: 'Automated Powder Coated in Custom RAL Colors',
    applications: ['Electrical Power Panels', 'Telecom & Server Enclosures', 'Shopfloor Heavy Workbenches', 'Cable Management Trays'],
  },

  // --- 5. PRIMARY STEEL DEALERSHIPS (Page 25) ---
  {
    id: 'raw-material-structural',
    category: 'primary',
    name: 'Structural Steel (Channels, Beams, Angles & Flats)',
    tagline: 'Authorised Dealer: TATA STEEL & JINDAL STEEL',
    desc: 'Primary mill authorized distribution of parallel flange beams (ISMB 100 to 600), heavy channels (ISMC 75 to 400), equal/unequal angles, and flats with original Mill Test Certificates (MTC).',
    badge: 'Authorised Dealer',
    grades: 'IS 2062 Grade E250 / E350 (SAIL, TATA, JSPL)',
    thickness: 'Beams: 100-600mm | Channels: 75-400mm | Angles: 25x25 to 200x200mm',
    standardSizes: '6m & 12m Commercial Standard Lengths',
    dispatch: '24-Hour Express Dispatch from Ready Yard Stock',
    applications: ['PEB Building Columns', 'Overhead Crane Tracks', 'Heavy Industrial Structures', 'Infrastructure Bridge Works'],
  },
  {
    id: 'tmt-rebars-primary',
    category: 'primary',
    name: 'Primary MS TMT Rebars (Fe 500D / 550D)',
    tagline: 'Direct Primary Sourcing from SAIL, TATA Tiscon & Jindal Panther',
    desc: 'High-ductility earthquake-resistant Thermo-Mechanically Treated rebars for critical infrastructure foundations, metro corridors, and high-rise civil construction. Over 3,000 MT stock maintained.',
    badge: '3,000 MT Stock',
    grades: 'Fe 500D & Fe 550D (IS 1786 Certified)',
    thickness: 'Diameters: 8 mm, 10 mm, 12 mm, 16 mm, 20 mm, 25 mm, 32 mm',
    standardSizes: 'Standard 12-Meter Factory Straight Lengths & Bends',
    dispatch: 'Full Trailer Load (FTL) with Direct Factory Weight Slips',
    applications: ['Bridge & Metro Rail Foundations', 'Commercial High-Rises', 'Industrial Floor Rafts', 'Heavy Machinery Foundations'],
  },
  {
    id: 'hr-plates-coils',
    category: 'primary',
    name: 'Hot Rolled (HR) Plates & Coils (IS 2062)',
    tagline: 'Heavy Industrial Plates from SAIL, TATA Steel & AM/NS India',
    desc: 'Structural quality hot-rolled steel plates and master slit coils offering flawless weldability, uniform elongation, and tested ultrasonic integrity for heavy manufacturing and pressure vessels.',
    badge: 'Heavy Gauge Stock',
    grades: 'IS 2062 E250 / E350 BR/BO, ASTM A36',
    thickness: '1.6 mm to 100 mm Thickness',
    standardSizes: '1250 x 6000 mm, 1500 x 6000 mm, 2000 x 6000 mm, up to 12m Length',
    dispatch: 'Custom Flame / Plasma Profiling & Cut-to-Size Available',
    applications: ['PEB Built-Up Beams', 'Heavy Machinery Bases', 'Industrial Shims & Baseplates', 'Pressure Vessels'],
  },
  {
    id: 'chequered-plates-anti-skid',
    category: 'primary',
    name: 'MS Chequered Anti-Skid Plates',
    tagline: 'Tear-Drop & Diamond Pattern Industrial Safety Flooring',
    desc: 'Heavy-duty slip-resistant chequered steel plates offering maximum traction under oil, water, and heavy industrial pedestrian and forklift traffic.',
    badge: 'Anti-Skid Flooring',
    grades: 'IS 2062 E250 A / BR',
    thickness: '3.0 mm to 12.0 mm',
    standardSizes: '1250 x 5000 mm, 1500 x 6000 mm',
    dispatch: 'Immediate Dispatch from Delhi NCR & Bhiwadi Stockyards',
    applications: ['Mezzanine Floor Walkways', 'Staircase Treads', 'Commercial Trailer Beds', 'Factory Safety Platforms'],
  },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = PRODUCTS_DATA.filter(prod => {
    const matchCategory = activeCategory === 'all' || prod.category === activeCategory;
    const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prod.grades.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prod.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prod.desc.toLowerCase().includes(searchQuery.toLowerCase());
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
              <span>OFFICIAL PRODUCT DIRECTORY • LATEST 2026 SPECIFICATIONS</span>
            </div>
            <h1 className="dedicated-hero-title">
              Manufactured Systems &amp; <span className="text-gradient">Primary Steel Supply</span>
            </h1>
            <p className="dedicated-hero-subtitle">
              From heavy-duty warehouse racking and multi-tier mezzanine floors to 1,000 MT/month PEB structural fabrication, 
              commercial SS kitchen equipment, and authorized primary steel distribution (Tata Steel &amp; Jindal Steel). 
              Supplied with complete Mill Test Certificates (MTC) and 24-hour dispatch.
            </p>

            <div className="dedicated-hero-actions">
              <a
                href="/Aggarwal_Steels_Catalogue_2026.pdf"
                download="Aggarwal_Steels_Catalogue_2026.pdf"
                className="btn-primary"
                id="btnDownloadCatalogProducts"
              >
                <IconDownload size={16} />
                <span>Download 2026 Catalogue (PDF)</span>
              </a>
              <Link href="/contact" className="btn-secondary" id="btnRequestQuoteProducts">
                <IconPhone size={16} />
                <span>Get Instant Tonnage Quote</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Product Catalog Grid Section */}
        <section className="dedicated-products-section">
          <div className="section-container">
            {/* Filter Pills & Live Search */}
            <div className="products-controls-bar">
              <div className="category-filter-chips">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="catalog-search-box">
                <input
                  type="text"
                  placeholder="Search products, grades, standards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="catalog-search-input"
                />
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="dedicated-products-grid">
              {filtered.map(prod => (
                <div key={prod.id} id={prod.id} className="dedicated-product-card">
                  <div className="product-card-top">
                    <span className="product-badge">{prod.badge}</span>
                    <span className="product-category-tag">{prod.category.toUpperCase()}</span>
                  </div>

                  <h3 className="product-title">{prod.name}</h3>
                  <p className="product-tagline">{prod.tagline}</p>
                  <p className="product-body-desc">{prod.desc}</p>

                  <div className="product-tech-specs">
                    <div className="spec-row">
                      <span className="spec-label">Grades / Standards:</span>
                      <span className="spec-value">{prod.grades}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Thickness / Capacity:</span>
                      <span className="spec-value">{prod.thickness}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Available Sizes:</span>
                      <span className="spec-value">{prod.standardSizes}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Dispatch Mode:</span>
                      <span className="spec-value text-accent">{prod.dispatch}</span>
                    </div>
                  </div>

                  <div className="product-apps-wrap">
                    <span className="apps-heading">Common Industry Applications:</span>
                    <div className="apps-tags-flex">
                      {prod.applications.map((app, i) => (
                        <span key={i} className="app-pill">✓ {app}</span>
                      ))}
                    </div>
                  </div>

                  <div className="product-card-cta">
                    <Link href={`/contact?product=${encodeURIComponent(prod.name)}`} className="btn-card-enquire">
                      <span>Get Best Factory Rate</span>
                      <IconArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="no-products-found">
                <p>No products found matching &quot;{searchQuery}&quot;.</p>
                <button type="button" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} className="btn-primary">
                  Reset Search Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Dispatch Guarantee Banner */}
        <section className="sla-banner-section">
          <div className="section-container">
            <div className="sla-banner-inner">
              <div className="sla-item">
                <IconClock size={32} className="sla-icon" />
                <div>
                  <h4>24-Hour Dispatch Guarantee</h4>
                  <p>Standard raw steel items and warehouse pallet racks dispatched within 24 hours of PO confirmation.</p>
                </div>
              </div>
              <div className="sla-item">
                <IconShieldCheck size={32} className="sla-icon" />
                <div>
                  <h4>100% Mill Test Certificates</h4>
                  <p>Original heat number stamped MTC reports from primary mills (SAIL, TATA, Jindal) with every consignment.</p>
                </div>
              </div>
              <div className="sla-item">
                <IconAward size={32} className="sla-icon" />
                <div>
                  <h4>SEMA &amp; ISO 9001 Tested</h4>
                  <p>All manufactured racking and mezzanine floor systems engineered to rigorous structural load standards.</p>
                </div>
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
