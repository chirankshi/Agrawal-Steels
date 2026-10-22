'use client';
import { useState } from 'react';
import { IconArrowRight, IconShieldCheck, IconFileText } from './Icons';

const PRODUCTS = [
  {
    id: 'productTmt',
    name: 'MS TMT Bars',
    category: 'TMT & Rebars',
    grade: 'Fe-415 / Fe-500D / Fe-550D',
    desc: 'High-yield thermo-mechanically treated rebars engineered for critical RCC seismic structural designs.',
    img: '/images/product_tmt_bars.jpg',
    tags: ['SAIL', 'Tata Tiscon', 'JSPL'],
    badge: 'High Demand',
    specs: 'Sizes 8mm to 32mm | IS 1786',
  },
  {
    id: 'productHr',
    name: 'HR Plates & Coils',
    category: 'Plates & Coils',
    grade: 'IS 2062 E250 / E350',
    desc: 'Heavy-gauge hot rolled plates and master coils for structural fabrication, pressure vessels, and PEB frames.',
    img: '/images/product_hr_plates.jpg',
    tags: ['SAIL', 'AMNS India'],
    badge: 'Heavy Gauge',
    specs: 'Thickness 2mm to 63mm',
  },
  {
    id: 'productAngles',
    name: 'MS Structural Angles',
    category: 'Structural Steel',
    grade: 'Equal & Unequal Legs',
    desc: 'Precision L-profile structural angles for telecommunication towers, trusses, and industrial machinery bases.',
    img: '/images/product_ms_angles.jpg',
    tags: ['SAIL', 'JSPL'],
    specs: '25x25mm to 200x200mm | IS 2062',
  },
  {
    id: 'productChannel',
    name: 'MS Channels (ISMC)',
    category: 'Structural Steel',
    grade: 'ISMC Standard Profiles',
    desc: 'Standard C-shaped hot rolled channels for architectural framing, bridge decks, and column reinforcements.',
    img: '/images/product_ms_channel.jpg',
    tags: ['SAIL', 'Tata Steel'],
    specs: 'ISMC 75 to ISMC 400',
  },
  {
    id: 'productBeam',
    name: 'MS Beams (I & H Joists)',
    category: 'Structural Steel',
    grade: 'ISMB / NPB / WPB',
    desc: 'High section-modulus structural beams for wide-span industrial sheds, multi-story buildings, and heavy cranes.',
    img: '/images/product_ms_beam.jpg',
    tags: ['SAIL', 'JSPL Universal'],
    specs: 'ISMB 100 to ISMB 600',
  },
  {
    id: 'productPipe',
    name: 'Hollow Sections & Pipes',
    category: 'Pipes & Tubes',
    grade: 'Square, Rectangular, Round',
    desc: 'High-strength structural hollow sections (SHS/RHS) and MS pipes for architectural facades and trusses.',
    img: '/images/product_ms_pipe.jpg',
    tags: ['APL Apollo', 'Jindal'],
    specs: 'IS 4923 & IS 1161 Certified',
  },
  {
    id: 'productCr',
    name: 'CR Coils & Precision Slit',
    category: 'Plates & Coils',
    grade: 'CR1 / CR2 / CR3 Deep Draw',
    desc: 'Cold rolled steel coils and slit strips with ultra-fine surface finish for automotive stamping and electronics.',
    img: '/images/product_cr_coils.jpg',
    tags: ['SAIL', 'Tata Steelium'],
    specs: '0.4mm to 3.0mm Thickness',
  },
  {
    id: 'productGp',
    name: 'GP Coils & Galvanized Sheets',
    category: 'Plates & Coils',
    grade: 'Zinc Coating 120-275 GSM',
    desc: 'Galvanized plain steel coils with high corrosion resistance for ducting, roofing, and outdoor enclosures.',
    img: '/images/product_gp_coils.jpg',
    tags: ['SAIL', 'AMNS'],
    specs: 'Zero Spangle / Regular Spangle',
  },
  {
    id: 'productSs',
    name: 'Stainless Steel Sheets',
    category: 'Stainless Steel',
    grade: 'SS 304 / SS 202 / SS 316',
    desc: 'Austenitic stainless steel sheets and plates in 2B and No.4 finishes for pharmaceutical and kitchen equipment.',
    img: '/images/product_ss_sheets.jpg',
    tags: ['Jindal Stainless'],
    badge: 'Corrosion Free',
    specs: 'Sheets, Coils & Custom Cut',
  },
];

const CATEGORIES = ['All Products', 'Structural Steel', 'Plates & Coils', 'TMT & Rebars', 'Pipes & Tubes', 'Stainless Steel'];

export default function Products({ onSelectProduct }) {
  const [selectedCat, setSelectedCat] = useState('All Products');

  const filtered = selectedCat === 'All Products'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCat);

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
            <IconFileText size={15} /> PRODUCT PORTFOLIO
          </div>
          <h2 className="section-title text-white">
            Certified Structural &amp; <span className="text-gradient">Flat Steel</span>
          </h2>
          <p className="section-desc text-gray">
            Direct mill distribution and custom sizing with full mill test certificates (MTC) and traceable chemical &amp; physical compliance.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="product-category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`category-tab-btn ${selectedCat === cat ? 'category-tab-btn--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid with Modern Dark Cards */}
        <div className="products-modern-grid" id="productsGrid">
          {filtered.map(p => (
            <div className="product-modern-card" id={p.id} key={p.id}>
              <div className="pm-img-wrap">
                <img src={p.img} alt={p.name} className="pm-img" loading="lazy" />
                <div className="pm-overlay">
                  <button
                    type="button"
                    className="pm-overlay-btn"
                    onClick={() => handleQuoteClick(p.name)}
                  >
                    <span>Instant Quotation</span>
                    <IconArrowRight size={16} />
                  </button>
                </div>
                {p.badge && <span className="pm-badge">{p.badge}</span>}
              </div>

              <div className="pm-body">
                <div className="pm-category">{p.category}</div>
                <h3 className="pm-title">{p.name}</h3>
                <div className="pm-grade">{p.grade}</div>
                <p className="pm-desc">{p.desc}</p>

                <div className="pm-spec-strip">
                  <IconShieldCheck size={14} className="text-accent" />
                  <span>{p.specs}</span>
                </div>

                <div className="pm-footer">
                  <div className="pm-tags">
                    {p.tags.map(t => (
                      <span className="pm-tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="pm-btn-link"
                    onClick={() => handleQuoteClick(p.name)}
                  >
                    <span>Enquire</span>
                    <IconArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
