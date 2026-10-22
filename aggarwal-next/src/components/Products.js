'use client';
import { useState } from 'react';

const PRODUCTS = [
  {
    id: 'productTmt',
    name: 'MS TMT Bars',
    category: 'TMT & Rebars',
    desc: 'High-strength Thermo-Mechanically Treated bars for RCC construction. Fe-415, Fe-500, Fe-550 grades available.',
    img: '/images/product_tmt_bars.jpg',
    tags: ['SAIL', 'Tata', 'JSPL'],
    badge: 'Best Seller',
  },
  {
    id: 'productHr',
    name: 'HR Plates & Coils',
    category: 'Plates & Coils',
    desc: 'Hot Rolled plates and coils in various thicknesses for heavy engineering, fabrication and structural use.',
    img: '/images/product_hr_plates.jpg',
    tags: ['SAIL', 'Essar/AMNS'],
  },
  {
    id: 'productAngles',
    name: 'MS Angles',
    category: 'Structural Steel',
    desc: 'Mild Steel L-shaped structural angles for towers, trusses and general fabrication. Equal & unequal sizes available.',
    img: '/images/product_ms_angles.jpg',
    tags: ['SAIL', 'JSPL'],
  },
  {
    id: 'productChannel',
    name: 'MS Channel',
    category: 'Structural Steel',
    desc: 'C-shaped mild steel channels (ISMC) for structural framing, columns and load-bearing applications.',
    img: '/images/product_ms_channel.jpg',
    tags: ['SAIL', 'Tata'],
  },
  {
    id: 'productBeam',
    name: 'MS Beam (I & H)',
    category: 'Structural Steel',
    desc: 'I-Section and H-Section beams for bridges, buildings, and heavy structural applications. All ISSC grades.',
    img: '/images/product_ms_beam.jpg',
    tags: ['SAIL', 'JSPL'],
  },
  {
    id: 'productPipe',
    name: 'MS Square & Round Pipes',
    category: 'Pipes & Tubes',
    desc: 'Hollow steel sections – square, rectangular, and round pipes for fencing, furniture, and industrial use.',
    img: '/images/product_ms_pipe.jpg',
    tags: ['Jindal Pipes', 'Apollo'],
  },
  {
    id: 'productCr',
    name: 'CR Coils & Slit Coils',
    category: 'Plates & Coils',
    desc: 'Cold Rolled coils and precision slit coils for automotive, appliances and precision component manufacturing.',
    img: '/images/product_cr_coils.jpg',
    tags: ['SAIL', 'Tata'],
  },
  {
    id: 'productGp',
    name: 'GP Coils & Sheets',
    category: 'Plates & Coils',
    desc: 'Galvanized Plain steel coils and sheets with zinc coating for corrosion resistance. Roofing, cladding & more.',
    img: '/images/product_gp_coils.jpg',
    tags: ['SAIL', 'Essar'],
  },
  {
    id: 'productSs',
    name: 'SS Sheets (202 & 304)',
    category: 'Stainless Steel',
    desc: 'Stainless steel sheets in grades SS 202 & SS 304 for kitchen equipment, architectural and decorative use.',
    img: '/images/product_ss_sheets.jpg',
    tags: ['Grade 202', 'Grade 304'],
  },
];

const CATEGORIES = ['All', 'Structural Steel', 'Plates & Coils', 'TMT & Rebars', 'Pipes & Tubes', 'Stainless Steel'];

export default function Products({ onSelectProduct }) {
  const [selectedCat, setSelectedCat] = useState('All');

  const filtered = selectedCat === 'All'
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
    <section className="products-section section" id="products">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Our Products</div>
          <h2 className="section-title">Browse by <span className="text-accent">Category</span></h2>
          <p className="section-desc">
            Complete range of premium iron &amp; steel products for construction and industrial applications. Sourced directly from SAIL, Tata Steel, JSPL &amp; more.
          </p>

          {/* Interactive Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '1.5rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  background: selectedCat === cat ? 'var(--accent)' : 'var(--gray-100)',
                  color: selectedCat === cat ? 'var(--primary)' : 'var(--gray-700)',
                  border: selectedCat === cat ? '1px solid var(--accent)' : '1px solid var(--gray-200)',
                  boxShadow: selectedCat === cat ? '0 2px 8px rgba(245, 158, 11, 0.3)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid" id="productsGrid">
          {filtered.map(p => (
            <div className="product-card" id={p.id} key={p.id}>
              <div className="product-img-wrap">
                <img src={p.img} alt={p.name} className="product-img" loading="lazy" />
                <div className="product-overlay">
                  <a
                    href="#contact"
                    className="product-cta"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuoteClick(p.name);
                    }}
                  >
                    Get Quote →
                  </a>
                </div>
                {p.badge && <div className="product-badge">{p.badge}</div>}
              </div>
              <div className="product-info">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-desc">{p.desc}</p>
                <div className="product-tags">
                  {p.tags.map(t => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
