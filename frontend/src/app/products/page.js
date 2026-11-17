'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import AnnouncementBar from '../../components/AnnouncementBar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ScrollAnimations from '../../components/ScrollAnimations';
import {
  IconArrowRight,
  IconShieldCheck,
  IconPhone,
  IconClock,
  IconAward,
  IconDownload
} from '../../components/Icons';
import { useProducts } from '../../lib/productsApi';
import { useCatalogue } from '../../lib/catalogueApi';
import { resolveProductPlacement } from '../../data/catalogue';

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
const shortName = (c) => SHORT_NAMES[c.slug] || c.name;

function ProductCard({ prod }) {
  return (
    <div id={prod.slug} className="dedicated-product-card">
      {prod.image_url && (
        <div className="dedicated-product-img-wrap">
          <img src={prod.image_url} alt={prod.name} className="dedicated-product-img" loading="lazy" />
        </div>
      )}
      <div className="product-card-top">
        {prod.badge && <span className="product-badge">{prod.badge}</span>}
        <span className="product-category-tag">{prod.subcategory || prod.category}</span>
      </div>

      <h3 className="product-title">{prod.name}</h3>
      {prod.tagline && <p className="product-tagline">{prod.tagline}</p>}
      <p className="product-body-desc">{prod.description}</p>

      <div className="product-tech-specs">
        <div className="spec-row">
          <span className="spec-label">Grades / Standards:</span>
          <span className="spec-value">{prod.grade || 'On request'}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Thickness / Capacity:</span>
          <span className="spec-value">{prod.specs || 'On request'}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Available Sizes:</span>
          <span className="spec-value">{prod.sizes || 'Custom'}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Dispatch Mode:</span>
          <span className="spec-value text-accent">{prod.dispatch || '24-hour dispatch on stock items'}</span>
        </div>
      </div>

      {prod.applications.length > 0 && (
        <div className="product-apps-wrap">
          <span className="apps-heading">Common Industry Applications:</span>
          <div className="apps-tags-flex">
            {prod.applications.map((app, i) => (
              <span key={i} className="app-pill">✓ {app}</span>
            ))}
          </div>
        </div>
      )}

      <div className="product-card-cta">
        <Link href={`/contact?product=${encodeURIComponent(prod.name)}`} className="btn-card-enquire">
          <span>Get Best Factory Rate</span>
          <IconArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

/** Catalogue line items that do not (yet) have their own product card. */
function CatalogueItems({ items, subcategory }) {
  if (!items.length) return null;
  return (
    <div className="catalogue-items-wrap">
      <span className="catalogue-items-heading">Also in the {subcategory.name} range</span>
      <div className="catalogue-items-grid">
        {items.map((item) => (
          <Link key={item} href={`/contact?product=${encodeURIComponent(item)}`} className="catalogue-item-tile" title={`Enquire about ${item}`}>
            <span>{item}</span>
            <IconArrowRight size={13} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductsDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products } = useProducts();
  const { tree } = useCatalogue();

  const activeCategory = searchParams.get('category') || 'all';
  const activeSub = searchParams.get('sub') || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  const setFilter = (category, sub = 'all') => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (sub !== 'all') params.set('sub', sub);
    const qs = params.toString();
    router.replace(`/products${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  // Reset the sub-category when the category disappears (e.g. renamed in admin)
  useEffect(() => {
    if (activeCategory !== 'all' && tree.length && !tree.some((c) => c.slug === activeCategory)) setFilter('all');
  }, [activeCategory, tree]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = searchQuery.trim().toLowerCase();
  const matchesSearch = (prod) => !q || [prod.name, prod.grade, prod.tagline, prod.description, prod.specs, prod.subcategory].some((v) => (v || '').toLowerCase().includes(q));

  // Place every product in the tree once
  const placed = useMemo(() => products.map((prod) => ({ prod, ...resolveProductPlacement(prod, tree) })), [products, tree]);

  const category = activeCategory === 'all' ? null : tree.find((c) => c.slug === activeCategory);
  const subcategory = category && activeSub !== 'all' ? category.subcategories.find((s) => s.slug === activeSub) : null;

  /** Sections to render: [{ key, title, meta, products, subcategory? }] */
  const sections = useMemo(() => {
    if (!category) {
      // "All": one section per category, products only
      return tree
        .map((c) => ({
          key: c.slug,
          title: c.name,
          meta: c.company,
          link: c.slug,
          products: placed.filter((p) => p.category?.slug === c.slug && matchesSearch(p.prod)).map((p) => p.prod),
        }))
        .concat([{ key: 'other', title: 'Other products', meta: '', products: placed.filter((p) => !p.category && matchesSearch(p.prod)).map((p) => p.prod) }])
        .filter((s) => s.products.length);
    }
    const subs = subcategory ? [subcategory] : category.subcategories;
    const inCategory = placed.filter((p) => p.category?.slug === category.slug);
    const result = subs.map((s) => {
      const prods = inCategory.filter((p) => p.subcategory?.slug === s.slug && matchesSearch(p.prod)).map((p) => p.prod);
      const names = new Set(prods.map((p) => p.name.toLowerCase()));
      const items = s.items.filter((i) => !names.has(i.toLowerCase()) && (!q || i.toLowerCase().includes(q)));
      return { key: s.slug, title: s.name, meta: s.description, subcategory: s, products: prods, items };
    });
    const loose = inCategory.filter((p) => !p.subcategory && matchesSearch(p.prod)).map((p) => p.prod);
    if (!subcategory && loose.length) result.push({ key: 'more', title: `More ${shortName(category)} products`, meta: '', products: loose, items: [] });
    return result.filter((s) => s.products.length || s.items?.length);
  }, [category, subcategory, placed, tree, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalShown = sections.reduce((n, s) => n + s.products.length + (s.items?.length || 0), 0);

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

        {/* Product Catalog Section */}
        <section className="dedicated-products-section">
          <div className="section-container">
            {/* Level 1: categories */}
            <div className="products-controls-bar">
              <div className="category-filter-chips">
                <button type="button" className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                  All Products
                </button>
                {tree.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    className={`filter-chip ${activeCategory === c.slug ? 'active' : ''}`}
                    onClick={() => setFilter(c.slug)}
                  >
                    {shortName(c)}
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

            {/* Level 2: category intro + sub-categories */}
            {category && (
              <div className="category-intro">
                <div className="category-intro-text">
                  <h2>{category.name}</h2>
                  <p>
                    {[category.company, category.capacity].filter(Boolean).join(' • ')}
                    {category.catalogue_page ? ` • Catalogue p. ${category.catalogue_page}` : ''}
                  </p>
                  {category.partners.length > 0 && (
                    <div className="category-partners">
                      {category.partners.map((p) => <span key={p} className="app-pill">{p}</span>)}
                    </div>
                  )}
                </div>
                <div className="subcategory-chips">
                  <button type="button" className={`sub-chip ${activeSub === 'all' ? 'active' : ''}`} onClick={() => setFilter(category.slug)}>
                    All {shortName(category)}
                  </button>
                  {category.subcategories.map((s) => (
                    <button key={s.slug} type="button" className={`sub-chip ${activeSub === s.slug ? 'active' : ''}`} onClick={() => setFilter(category.slug, s.slug)}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sections */}
            {sections.map((section) => (
              <div key={section.key} className="product-group" id={`group-${section.key}`}>
                <div className="product-group-head">
                  <div>
                    <h3>{section.title}</h3>
                    {section.meta && <p>{section.meta}</p>}
                  </div>
                  {section.link && (
                    <button type="button" className="product-group-link" onClick={() => setFilter(section.link)}>
                      View full range <IconArrowRight size={14} />
                    </button>
                  )}
                </div>
                {section.products.length > 0 && (
                  <div className="dedicated-products-grid">
                    {section.products.map((prod) => <ProductCard key={prod.id} prod={prod} />)}
                  </div>
                )}
                {section.subcategory && <CatalogueItems items={section.items} subcategory={section.subcategory} />}
              </div>
            ))}

            {totalShown === 0 && (
              <div className="no-products-found">
                <p>No products found{q ? ` matching "${searchQuery}"` : ''}.</p>
                <button type="button" onClick={() => { setFilter('all'); setSearchQuery(''); }} className="btn-primary">
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

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsDirectory />
    </Suspense>
  );
}
