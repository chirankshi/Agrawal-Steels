'use client';
import Link from 'next/link';
import { useState } from 'react';
import { IconArrowRight, IconShieldCheck, IconFileText } from './Icons';

const PRODUCTS = [
  // --- 1. WAREHOUSE STORAGE & RACKING (Catalogue Pages 12-16) ---
  {
    id: 'mfgRacks',
    name: 'Heavy-Duty Pallet Racking Systems',
    category: 'Storage & Racking',
    subcat: 'Pallet Storage System',
    grade: 'Selective, Double Deep, Drive-In, Narrow Aisle & Cantilever',
    desc: 'Smart high-density pallet storage racking engineered for safe, faster, and maximum volumetric warehouse utilisation. Uprights roll-formed in-house and finished in 520ft automated powder coating line.',
    img: '/images/storage_racking.jpeg',
    tags: ['Majestic AR', 'High Load Capacity', 'Robotic Coated'],
    badge: 'Flagship System',
    specs: 'Up to 4,000 kg/level | Uprights up to 12m height | Safe & stable',
  },
  {
    id: 'mfgMezzanine',
    name: 'Mezzanine Floor & Multi-Tier Racks',
    category: 'Storage & Racking',
    subcat: 'Vertical Space Optimization',
    grade: 'Freestanding Structural Mezzanines, 2-Tier & 3-Tier Multi-Level Racks',
    desc: 'Multiply usable warehouse square footage without expanding civil footprint. Heavy structural steel columns, beam girders, staircases, handrails, and pallet drop gates.',
    img: '/images/storage_racking.jpeg',
    tags: ['Majestic AR', 'Custom Engineered', 'Heavy Load Deck'],
    badge: 'Space Multiplier',
    specs: 'Load 300 to 1,500 kg/sqm | Custom column grids up to 8m x 8m',
  },
  {
    id: 'mfgMetalPallets',
    name: 'Metal Pallets & Rack Accessories',
    category: 'Storage & Racking',
    subcat: 'Pallets & Safety Accessories',
    grade: 'Powder-Coated, Slatted, Hot-Dip GI & Custom Heavy Pallets',
    desc: 'Heavy-duty steel pallets built for cold storage and harsh shop floors. Includes Column Guards, Row Guards, and Wire Mesh Partitions for forklift impact protection.',
    img: '/images/storage_racking.jpeg',
    tags: ['Powder Coated / GI', 'Reusable Long Life', 'Forklift Safe'],
    badge: 'Impact Tested',
    specs: '500 to 2,000 kg load | Column & Row Guards | Wire mesh partitions',
  },
  {
    id: 'mfgTrolleys',
    name: 'Material Handling Trolleys & Racking Parts',
    category: 'Storage & Racking',
    subcat: 'Trolleys & Components',
    grade: 'Platform, Mesh-Side & Roll Cage Trolleys | PSB & Base Plates',
    desc: 'Heavy-duty material handling trolleys for warehouse order picking, coupled with essential rack safety parts: Pallet Support Bars (PSB), Pallet Back Stoppers, and floor Anchor Base Plates.',
    img: '/images/cnc_bending.jpeg',
    tags: ['Smooth Rolling', 'Ergonomic Design', 'High Durability'],
    badge: 'Material Handling',
    specs: 'Heavy steel platform | PSB pallet supports | Roll cage folding options',
  },

  // --- 2. SHEET METAL FABRICATION & SS COMMERCIAL KITCHEN (Catalogue Pages 17-20) ---
  {
    id: 'mfgKitchen',
    name: 'SS Commercial Kitchen Equipments',
    category: 'Sheet Metal & SS',
    subcat: 'Stainless Steel (SS) Fabrication',
    grade: 'SS 304 Food Grade (Hygienic Finish)',
    desc: 'Complete commercial stainless steel kitchen solutions: SS Cooking Ranges, Bain Marie, Work Tables with/without backsplash, SS Storage Pot Racks, Washing Sinks, and Kitchen Exhaust Hoods/Ducts.',
    img: '/images/commercial_kitchen.jpeg',
    tags: ['SS 304 Food Grade', 'Miller TIG Welded', 'Hotels & Cloud Kitchens'],
    badge: 'Sanitary Grade',
    specs: 'Commercial cooking ranges | SS worktables & sinks | Exhaust ducting',
  },
  {
    id: 'mfgSheetMetal',
    name: 'MS Sheet Metal Cabinets & Enclosures',
    category: 'Sheet Metal & SS',
    subcat: 'Precision Sheet Metal',
    grade: 'High Precision CNC Bent & Powder Coated',
    desc: 'Customized MS & GI electrical enclosure cabinets, server racks, heavy industrial storage cabinets, perforated panels, work tables & benches, and custom mounting brackets.',
    img: '/images/support_welding.jpeg',
    tags: ['5 Tandem Bending', 'Spot Welded', 'Automated Powder Coated'],
    badge: 'Precision Fit',
    specs: 'Laser cut & tandem CNC bent | IP rated enclosures | Perforated panels',
  },
  {
    id: 'mfgScaffolding',
    name: 'Scaffolding Systems & Cable Trays',
    category: 'Sheet Metal & SS',
    subcat: 'Infrastructure Components',
    grade: 'Scaffolding GI Planks & Perforated / Ladder Cable Trays',
    desc: 'High-strength galvanized steel scaffolding planks and modular scaffolding systems for safe construction work platforms, plus heavy perforated and ladder-type cable management trays.',
    img: '/images/cnc_bending.jpeg',
    tags: ['High-Strength GI', 'Anti-Skid Planks', 'Industrial Cable Trays'],
    badge: 'Safety Certified',
    specs: 'Anti-skid perforated GI planks | Ladder cable trays | Modular scaffolding',
  },

  // --- 3. HEAVY STRUCTURAL STEEL & PEB FABRICATION (Catalogue Pages 22-24) ---
  {
    id: 'mfgStructuralUnit1',
    name: 'Heavy Structural Steel Fabrication (Unit 1)',
    category: 'Heavy Structural & PEB',
    subcat: 'Heavy Infrastructure Fabrication',
    grade: '700 to 1,000 MT Monthly Capacity (IS 2062)',
    desc: 'Pre-Engineered Buildings (PEB), Heavy Industrial Sheds, Bridge Girders, Railway Overbridges (ROB / FOB), EOT Crane Girders, and Transmission Tower Structures fabricated under ISO 3834-2 certified welding.',
    img: '/images/hero_steel_background.jpg',
    tags: ['700-1000 MT / Month', 'PEB Superstructures', 'ISO 3834-2 Certified'],
    badge: '1,000 MT / Mo Capacity',
    specs: 'Clear spans up to 60m | Heavy crane girders | Transmission towers & ROB/FOB',
  },
  {
    id: 'mfgCrashBarriers',
    name: 'Road Crash Barriers (W-Beam)',
    category: 'Heavy Structural & PEB',
    subcat: 'Highway Infrastructure',
    grade: 'Hot-Dip Galvanized W-Beam (MoRTH / AASHTO)',
    desc: 'High-safety metal beam crash barrier systems for National Highways, state expressways, and flyover bridge approaches. Engineered to absorb vehicular impact with zero post detachment.',
    img: '/images/product_ms_channel.jpg',
    tags: ['MoRTH Standard', 'Hot-Dip Galvanized', 'Highway & Bridge'],
    badge: 'MoRTH Standard',
    specs: 'W-Beam profiles | Heavy crash barrier posts | High-tensile fasteners',
  },

  // --- 4. RAW MATERIAL SUPPLY & AUTHORISED DEALERSHIPS (Catalogue Page 25) ---
  {
    id: 'productRawSteel',
    name: 'Raw Material Supply & Authorised Dealerships',
    category: 'Steel Supply',
    subcat: 'Primary Mill Authorised Dealer',
    grade: 'TATA STEEL & JINDAL STEEL Authorised Dealerships',
    desc: 'Direct primary mill authorized supply of ISMC Channels, ISMB Beams, Structural Angles, Flats, and customized structural steel sections with full original Mill Test Certificates (MTC).',
    img: '/images/product_ms_beam.jpg',
    tags: ['TATA Steel', 'Jindal Steel', 'SAIL Direct'],
    badge: 'Authorised Dealer',
    specs: 'ISMC 75-400 | ISMB 100-600 | Angles 25x25 to 200x200 | MTC verified',
  },
  {
    id: 'productTmt',
    name: 'MS TMT Rebars (Fe 500D / 550D)',
    category: 'Steel Supply',
    subcat: 'TMT & Rebars',
    grade: 'Fe 500D / Fe 550D (IS 1786 High Ductility)',
    desc: 'Primary mill direct earthquake-resistant Thermo-Mechanically Treated rebars for bridge foundations, infrastructure superstructures, and industrial plants. 3000 MT ready stock.',
    img: '/images/product_tmt_bars.jpg',
    tags: ['SAIL', 'TATA Tiscon', 'Jindal Panther'],
    badge: '3,000 MT Ready Stock',
    specs: 'Diameters 8mm to 32mm | High elongation >16% | Full MTC',
  },
  {
    id: 'productHr',
    name: 'HR Plates & Coils (IS 2062)',
    category: 'Steel Supply',
    subcat: 'Plates & Coils',
    grade: 'IS 2062 E250 / E350 BR/BO',
    desc: 'Hot rolled steel plates and slit master coils with uniform thickness and superior tensile strength for heavy machinery fabrication and PEB built-up beams.',
    img: '/images/product_hr_plates.jpg',
    tags: ['SAIL', 'AMNS India', 'TATA Steel'],
    badge: 'Heavy Gauge Stock',
    specs: 'Thickness 2.0mm to 63mm | Width up to 2500mm | Length up to 12m',
  },
  {
    id: 'productChequered',
    name: 'MS Chequered Anti-Skid Plates',
    category: 'Steel Supply',
    subcat: 'Plates & Coils',
    grade: 'Tear Drop & Diamond Pattern (IS 2062)',
    desc: 'Anti-skid industrial flooring plates for warehouse mezzanine gangways, factory access ramps, stair treads, and heavy trailer beds.',
    img: '/images/product_hr_plates.jpg',
    tags: ['SAIL', 'AMNS India'],
    badge: 'Anti-Skid Floor',
    specs: 'Thickness 3mm to 12mm | High slip resistance | Ready stock',
  },
  {
    id: 'productPipes',
    name: 'Hollow Sections & MS Pipes',
    category: 'Steel Supply',
    subcat: 'Pipes & Tubes',
    grade: 'Square (SHS), Rectangular (RHS) & Round (IS 4923 / 1161)',
    desc: 'High-strength structural hollow sections for architectural trusses, columns, and mezzanine supports sourced from leading primary pipe mills.',
    img: '/images/product_ms_pipe.jpg',
    tags: ['APL Apollo', 'Jindal Pipes'],
    badge: 'Certified Hollow Sections',
    specs: 'SHS / RHS up to 300x300mm | Round pipes up to 14" NB',
  },
];

const CATEGORIES = [
  'All Products',
  'Storage & Racking',
  'Heavy Structural & PEB',
  'Sheet Metal & SS',
  'Steel Supply',
];

export default function Products({ onSelectProduct, isHome = true }) {
  const [selectedCat, setSelectedCat] = useState('All Products');

  const HOME_BEST_SELLERS = [
    'mfgRacks',
    'mfgMezzanine',
    'mfgStructuralUnit1',
    'productTmt',
    'productHr',
    'mfgCrashBarriers',
  ];

  let filtered = PRODUCTS;
  if (selectedCat !== 'All Products') {
    filtered = PRODUCTS.filter(p => p.category === selectedCat || p.subcat === selectedCat);
  } else if (isHome) {
    filtered = PRODUCTS.filter(p => HOME_BEST_SELLERS.includes(p.id));
  }

  const handleQuoteClick = (productName) => {
    if (onSelectProduct) {
      onSelectProduct(productName);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section products-modern-section" id="products">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-amber">
            <IconFileText size={15} /> VERIFIED PRODUCT PORTFOLIO &bull; LATEST 2026 CATALOGUE
          </div>
          <h2 className="section-title text-white">
            Manufactured Systems &amp; <span className="text-gradient">Primary Steel Supply</span>
          </h2>
          <p className="section-desc text-gray">
            Engineered industrial storage racking, heavy PEB structural fabrication (700–1000 MT/Mo), commercial stainless steel kitchen systems, and authorized primary steel distribution (Tata Steel &amp; Jindal Steel).
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="products-filter-pills" id="productFilterBar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill-btn ${selectedCat === cat ? 'filter-pill-btn--active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-modern-grid" id="productsGrid">
          {filtered.map((prod) => (
            <div className="product-modern-card" id={prod.id} key={prod.id}>
              <div className="product-card-img-wrap">
                <img src={prod.img} alt={prod.name} className="product-card-img" loading="lazy" />
                <div className="product-card-overlay"></div>
                {prod.badge && <span className="product-card-badge">{prod.badge}</span>}
                <span className="product-card-category">{prod.subcat}</span>
              </div>

              <div className="product-card-body">
                <h3 className="product-card-title">{prod.name}</h3>
                <span className="product-card-grade">{prod.grade}</span>
                <p className="product-card-desc">{prod.desc}</p>

                {prod.specs && (
                  <div className="product-card-specs">
                    <span className="specs-chip">
                      <IconShieldCheck size={13} /> {prod.specs}
                    </span>
                  </div>
                )}

                <div className="product-card-footer">
                  <div className="product-tags-row">
                    {prod.tags.map((t) => (
                      <span key={t} className="product-brand-tag">{t}</span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn-card-quote"
                    onClick={() => handleQuoteClick(prod.name)}
                  >
                    <span>Request Quotation</span>
                    <IconArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isHome && (
          <div className="section-cta-wrap">
            <Link href="/products" className="btn-modern-primary" id="btnViewAllProducts">
              <span>View All Certified Products (All 14 Core Lines)</span>
              <IconArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
