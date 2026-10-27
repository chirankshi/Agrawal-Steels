'use client';
import Link from 'next/link';
import { useState } from 'react';
import { IconArrowRight, IconShieldCheck, IconFileText, IconLayers, IconCpu } from './Icons';

const PRODUCTS = [
  // --- PRIMARY STEEL PRODUCTS (TRADING & SUPPLY) ---
  {
    id: 'productTmt',
    name: 'MS TMT Bars',
    category: 'Steel Supply',
    subcat: 'TMT & Rebars',
    grade: 'Fe 415 / Fe 500D / Fe 550D',
    desc: 'High-yield thermo-mechanically treated rebars engineered for high-rises, bridges, and critical earthquake seismic zones.',
    img: '/images/product_tmt_bars.jpg',
    tags: ['SAIL', 'TATA Steel', 'JSPL'],
    badge: 'High Demand',
    specs: 'Sizes 8mm to 32mm | IS 1786 Certified',
  },
  {
    id: 'productHr',
    name: 'HR Plates & Coils',
    category: 'Steel Supply',
    subcat: 'Plates & Coils',
    grade: 'IS 2062 E250 / E350',
    desc: 'Heavy-gauge hot-rolled plates and master coils for structural engineering, heavy fabrication, and PEB building frameworks.',
    img: '/images/product_hr_plates.jpg',
    tags: ['SAIL', 'AMNS India', 'TATA'],
    badge: 'Heavy Gauge',
    specs: 'Thickness 2mm to 63mm | Width up to 2500mm',
  },
  {
    id: 'productAngles',
    name: 'MS Structural Angles',
    category: 'Steel Supply',
    subcat: 'Structural Steel',
    grade: 'Equal & Unequal Profiles (IS 2062)',
    desc: 'Precision L-profile structural angles for transmission towers, trusses, sheds, and industrial machinery bases.',
    img: '/images/product_ms_angles.jpg',
    tags: ['SAIL', 'JSPL'],
    badge: 'Structural',
    specs: '25x25mm to 200x200mm | Length 6m / 12m',
  },
  {
    id: 'productChannel',
    name: 'MS Channels (ISMC)',
    category: 'Steel Supply',
    subcat: 'Structural Steel',
    grade: 'ISMC Standard Profiles',
    desc: 'Standard C-shaped hot rolled channels for architectural framing, bridge decks, and column reinforcements.',
    img: '/images/product_ms_channel.jpg',
    tags: ['SAIL', 'TATA Steel', 'JSPL'],
    badge: 'Structural',
    specs: 'ISMC 75 to ISMC 400',
  },
  {
    id: 'productBeam',
    name: 'MS Beams (I & H Joists)',
    category: 'Steel Supply',
    subcat: 'Structural Steel',
    grade: 'ISMB / NPB / WPB',
    desc: 'High section-modulus structural beams for wide-span industrial sheds, multi-story buildings, and heavy cranes.',
    img: '/images/product_ms_beam.jpg',
    tags: ['SAIL', 'JSPL Universal'],
    badge: 'Heavy Sections',
    specs: 'ISMB 100 to ISMB 600',
  },
  {
    id: 'productChequered',
    name: 'MS Chequered Plates',
    category: 'Steel Supply',
    subcat: 'Plates & Coils',
    grade: 'Tear Drop & Diamond Pattern (IS 2062)',
    desc: 'Anti-skid industrial flooring plates for walkways, ramps, mezzanine stairs, factory gangways, and commercial trailers.',
    img: '/images/product_hr_plates.jpg',
    tags: ['SAIL', 'AMNS'],
    badge: 'Anti-Skid',
    specs: 'Thickness 3mm to 12mm',
  },
  {
    id: 'productPipe',
    name: 'Hollow Sections & MS Pipes',
    category: 'Steel Supply',
    subcat: 'Pipes & Tubes',
    grade: 'Square (SHS), Rectangular (RHS) & Round',
    desc: 'High-strength structural hollow sections and MS pipes for architectural facades, trusses, and PEB columns.',
    img: '/images/product_ms_pipe.jpg',
    tags: ['APL Apollo', 'Jindal Steels Pipes'],
    badge: 'Certified',
    specs: 'IS 4923 & IS 1161 Certified',
  },
  {
    id: 'productCr',
    name: 'CR Coils & Precision Slit Coils',
    category: 'Steel Supply',
    subcat: 'Plates & Coils',
    grade: 'CR1 / CR2 / CR3 Deep Draw',
    desc: 'Cold-rolled steel coils and slit strips with ultra-fine surface finish for automotive stamping and electronics.',
    img: '/images/product_cr_coils.jpg',
    tags: ['SAIL', 'TATA Steelium'],
    badge: 'Precision Slit',
    specs: '0.4mm to 3.0mm Thickness',
  },
  {
    id: 'productGp',
    name: 'GP Coils & Galvanized Sheets',
    category: 'Steel Supply',
    subcat: 'Plates & Coils',
    grade: 'Zinc Coating 120-275 GSM',
    desc: 'Galvanized plain steel coils and roofing sheets with high corrosion resistance for ducting and industrial sheds.',
    img: '/images/product_gp_coils.jpg',
    tags: ['SAIL', 'AMNS'],
    badge: 'Galvanized',
    specs: 'Zero Spangle & Regular Spangle',
  },
  {
    id: 'productSs',
    name: 'Stainless Steel Sheets (304 / 202)',
    category: 'Steel Supply',
    subcat: 'Stainless Steel',
    grade: 'SS 304 / SS 202 / SS 316',
    desc: 'Austenitic stainless steel sheets in 2B and No.4 finishes for pharmaceutical and kitchen equipment.',
    img: '/images/product_ss_sheets.jpg',
    tags: ['Jindal Stainless'],
    badge: 'Corrosion Free',
    specs: 'Sheets, Coils & Custom Cut',
  },

  // --- IN-HOUSE MANUFACTURING & STORAGE SYSTEMS (Majestic AR Technology) ---
  {
    id: 'mfgRacks',
    name: 'Heavy-Duty Warehouse Storage Racks',
    category: 'Manufactured Systems',
    subcat: 'Storage Solutions',
    grade: 'Selective, Double Deep, Drive-In & Cantilever',
    desc: 'Turnkey industrial pallet storage racking systems engineered for high cubic volume, seismic stability, and heavy pallet loads.',
    img: '/images/storage_racking.jpeg',
    tags: ['Majestic AR', 'In-House Plant'],
    badge: 'Warehouse Grade',
    specs: 'Up to 4000kg/level | Custom Upright heights up to 12m',
  },
  {
    id: 'mfgMezzanine',
    name: 'Multi-Tier Mezzanine Floor Systems',
    category: 'Manufactured Systems',
    subcat: 'Storage Solutions',
    grade: '2-Tier & 3-Tier Multi-Level Systems',
    desc: 'Multiply usable warehouse square footage without expanding building footprint. Includes staircases, railings, and conveyor integration.',
    img: '/images/storage_racking.jpeg',
    tags: ['Majestic AR', 'Custom Engineered'],
    badge: 'Space Optimization',
    specs: 'Heavy steel deck panels, integrated staircases & safety gates',
  },
  {
    id: 'mfgSlotted',
    name: 'Slotted Angle & Small Parts Bin Racks',
    category: 'Manufactured Systems',
    subcat: 'Storage Solutions',
    grade: 'Roll-Formed Slotted Profiles',
    desc: 'Budget-friendly, modular slotted angle storage racks and bin systems for spare parts, hardware, and retail order picking.',
    img: '/images/cnc_bending.jpeg',
    tags: ['Majestic AR', 'Roll Formed'],
    badge: 'Modular Racks',
    specs: 'Custom shelf heights & plastic bin compatibility',
  },
  {
    id: 'mfgDisplay',
    name: 'Supermarket & Retail Display Racks',
    category: 'Manufactured Systems',
    subcat: 'Retail Racking',
    grade: 'Gondola, Wall, End & Island Racks',
    desc: 'Modern powder-coated retail fixtures, fruit/vegetable racks, bakery displays, and checkout counters for hypermarkets.',
    img: '/images/storage_racking.jpeg',
    tags: ['Majestic AR', 'Powder Coated'],
    badge: 'Retail Grade',
    specs: '520ft Robotic Powder Coated in custom RAL colors',
  },
  {
    id: 'mfgKitchen',
    name: 'Commercial Stainless Steel Kitchen Equipment',
    category: 'Manufactured Systems',
    subcat: 'Custom Fabrication',
    grade: 'SS 304 Food Grade',
    desc: 'Industrial stainless steel prep counters, commercial sink units, storage shelves, and exhaust hoods for hotels and cloud kitchens.',
    img: '/images/commercial_kitchen.jpeg',
    tags: ['Aggarwal Steels', 'Majestic AR'],
    badge: 'SS 304 Hygienic',
    specs: 'Sanitary TIG/MIG welding, custom sizing & drain boards',
  },
  {
    id: 'mfgCabinets',
    name: 'Electrical & Control Panel Enclosures',
    category: 'Manufactured Systems',
    subcat: 'Custom Fabrication',
    grade: 'CR / GI Powder Coated (IP Rated Enclosures)',
    desc: 'Precision laser-cut and CNC-bent cabinets for power distribution boards, automation control panels, and telecom server racks.',
    img: '/images/support_welding.jpeg',
    tags: ['Majestic AR', '3kW Laser Cut'],
    badge: 'Precision Fit',
    specs: 'Cut on 3kW Prime Laser & bent on HACO/Energy Mission press brakes',
  },
  {
    id: 'mfgPeb',
    name: 'PEB Structures & Heavy Industrial Sheds',
    category: 'Manufactured Systems',
    subcat: 'Heavy Fabrication',
    grade: 'IS 2062 Structural Assemblies',
    desc: 'Pre-engineered steel building structures, factory warehouse sheds, platform walkways, and pipeline support towers.',
    img: '/images/hero_steel_background.jpg',
    tags: ['Aggarwal Steels', 'Heavy Fabrication'],
    badge: 'Heavy Duty',
    specs: 'Custom spans, built-up columns & rafters with full MTC',
  },
];

const CATEGORIES = [
  'All Products',
  'Steel Supply',
  'Manufactured Systems',
  'Structural Steel',
  'Plates & Coils',
  'Storage Solutions',
  'Custom Fabrication',
];

export default function Products({ onSelectProduct, isHome = true }) {
  const [selectedCat, setSelectedCat] = useState('All Products');

  const HOME_BEST_SELLERS = [
    'productTmt',
    'productHr',
    'productBeam',
    'productPipe',
    'mfgRacks',
    'mfgMezzanine',
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
            <IconFileText size={15} /> VERIFIED PRODUCT PORTFOLIO
          </div>
          <h2 className="section-title text-white">
            Primary Steel Supply &amp; <span className="text-gradient">Engineered Systems</span>
          </h2>
          <p className="section-desc text-gray">
            From wholesale raw steel distribution (SAIL, TATA, JSPL, AMNS) to in-house manufactured heavy pallet racking, mezzanine systems, and commercial SS fabrication.
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
              <span>View All Certified Products (All 17 Lines)</span>
              <IconArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
