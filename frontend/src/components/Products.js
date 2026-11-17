'use client';
import Link from 'next/link';
import { IconArrowRight, IconShieldCheck, IconFileText } from './Icons';
import { useProducts } from '../lib/productsApi';
import { useCatalogue } from '../lib/catalogueApi';

/** Short chip labels for the long catalogue names. */
const SHORT_NAMES = {
  'steel-supply': 'Primary Steel Supply',
  racking: 'Warehouse Racking',
  mezzanine: 'Mezzanine & Multi-Tier',
  'material-handling': 'Material Handling',
  'ms-sheet-metal': 'MS Sheet Metal',
  'ss-fabrication': 'SS & Commercial Kitchen',
  'heavy-structural': 'Heavy Structural & PEB',
  infrastructure: 'Infrastructure',
  services: 'Services',
};

export default function Products({ onSelectProduct, isHome = true }) {
  const { products } = useProducts();
  const { tree } = useCatalogue();

  const featured = products.filter((p) => p.show_on_home);
  const shown = isHome ? (featured.length ? featured : products.slice(0, 6)) : products;

  const handleQuoteClick = (productName) => {
    if (onSelectProduct) onSelectProduct(productName);
    const contactEl = document.getElementById('contact');
    if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
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

        {/* Browse by catalogue category (links into the full directory) */}
        <div className="products-filter-pills" id="productFilterBar">
          {tree.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className="filter-pill-btn" title={`${c.subcategories.length} sub-categories`}>
              {SHORT_NAMES[c.slug] || c.name}
            </Link>
          ))}
        </div>

        {/* Featured Products Grid */}
        <div className="products-modern-grid" id="productsGrid">
          {shown.map((prod) => (
            <div className="product-modern-card" id={prod.slug} key={prod.id}>
              <div className="product-card-img-wrap">
                <img src={prod.image_url} alt={prod.name} className="product-card-img" loading="lazy" />
                <div className="product-card-overlay"></div>
                {prod.badge && <span className="product-card-badge">{prod.badge}</span>}
                <span className="product-card-category">{prod.subcategory || prod.category}</span>
              </div>

              <div className="product-card-body">
                <h3 className="product-card-title">{prod.name}</h3>
                {prod.grade && <span className="product-card-grade">{prod.grade}</span>}
                <p className="product-card-desc">{prod.description}</p>

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
              <span>View Full Directory ({tree.length} Categories, {tree.reduce((n, c) => n + c.subcategories.length, 0)} Ranges)</span>
              <IconArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
