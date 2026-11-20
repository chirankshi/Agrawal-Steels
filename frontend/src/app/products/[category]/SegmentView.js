'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ScrollToTop from '../../../components/ScrollToTop';
import ProductCard from '../../../components/ProductCard';
import { IconArrowRight, IconPhone, IconDownload } from '../../../components/Icons';
import { useCatalogue } from '../../../lib/catalogueApi';
import { useProducts } from '../../../lib/productsApi';
import { resolveProductPlacement } from '../../../data/catalogue';
import { categoryImage, itemDetail, subcategoryImage } from '../../../lib/segments';

/** "Storage & Warehouse Racking" -> ["Storage &", "Warehouse Racking"] for the two-tone title. */
function splitTitle(name) {
  const words = name.split(' ');
  if (words.length < 3) return [name, ''];
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')];
}

// Varied crops so items sharing their line's photo don't look identical.
const CROPS = ['30% 40%', '70% 35%', '50% 70%', '20% 75%', '80% 65%', '45% 20%'];

/** One product tile: photo, name, short spec and an enquire link. */
function ItemCard({ item, line, index }) {
  const shared = !item.hasOwnImage;
  return (
    <article className={`prod-tile${shared ? ' prod-tile--shared' : ''}`}>
      <div className="prod-tile-media">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          style={shared ? { objectPosition: CROPS[index % CROPS.length] } : undefined}
        />
        <span className="prod-tile-chip">{line}</span>
        {shared && <h3 className="prod-tile-label">{item.name}</h3>}
      </div>
      <div className="prod-tile-body">
        {!shared && <h3>{item.name}</h3>}
        {item.description && <p>{item.description}</p>}
        <Link href={`/contact?product=${encodeURIComponent(`${item.name} (${line})`)}`} className="prod-tile-cta">
          Enquire now <IconArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}

export default function SegmentView() {
  const { category: slug } = useParams();
  const { tree, source } = useCatalogue();
  const { products } = useProducts();

  const category = tree.find((c) => c.slug === slug);
  const placed = useMemo(
    () => products.map((prod) => ({ prod, ...resolveProductPlacement(prod, tree) })).filter((p) => p.category?.slug === slug),
    [products, tree, slug]
  );

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="segment-page">
          <div className="section-container segment-missing">
            {source === 'seed' ? <p>Loading segment…</p> : (
              <>
                <h1>Segment not found</h1>
                <p>This product segment may have been renamed or hidden.</p>
                <Link href="/products" className="btn-primary">See all segments</Link>
              </>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const [lead, rest] = splitTitle(category.name);
  const others = tree.filter((c) => c.slug !== slug);
  const itemCount = category.subcategories.reduce((n, s) => n + s.items.length, 0);

  return (
    <>
      <Navbar />
      <main className="segment-page">
        {/* Hero: the segment poster */}
        <section className="segment-hero">
          <div className="section-container segment-hero-inner">
            <div className="segment-hero-text">
              <nav className="segment-crumbs" aria-label="Breadcrumb">
                <Link href="/products">Products</Link>
                <span>/</span>
                <span>{category.name}</span>
              </nav>
              <span className="segment-rule wide" aria-hidden="true" />
              <h1 className="segment-title">
                <span>{lead}</span>
                {rest && <span className="accent">{rest}</span>}
              </h1>
              {category.tagline && <p className="segment-tagline">{category.tagline}</p>}
              {category.description && <p className="segment-desc">{category.description}</p>}
              <div className="segment-facts">
                <span><b>{category.subcategories.length}</b> product lines</span>
                <span><b>{itemCount}</b> systems &amp; items</span>
                {category.company && <span>{category.company}</span>}
                {category.catalogue_page && <span>Catalogue p.{category.catalogue_page}</span>}
              </div>
              <div className="segment-hero-actions">
                <Link href={`/contact?product=${encodeURIComponent(category.name)}`} className="btn-primary">
                  <IconPhone size={16} /> <span>Get a quote</span>
                </Link>
                <a href="/Aggarwal_Steels_Catalogue_2026.pdf" download className="btn-secondary">
                  <IconDownload size={16} /> <span>Catalogue PDF</span>
                </a>
              </div>
            </div>
            <div className="segment-hero-img">
              <img src={categoryImage(category)} alt={category.name} />
            </div>
          </div>
        </section>

        {/* Sub-category jump bar */}
        {category.subcategories.length > 1 && (
          <nav className="segment-tabs" aria-label={`${category.name} product lines`}>
            <div className="section-container segment-tabs-inner">
              {category.subcategories.map((s) => (
                <a key={s.slug} href={`#${s.slug}`} className="segment-tab">
                  {s.name} <span>{s.items.length}</span>
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* One block per sub-category, like the catalogue pages */}
        <div className="section-container segment-blocks">
          {category.subcategories.map((s) => {
            const prods = placed.filter((p) => p.subcategory?.slug === s.slug).map((p) => p.prod);
            const items = s.items.map((i) => itemDetail(i, s, category, prods));
            return (
              <section key={s.slug} id={s.slug} className="prod-line">
                <header className="prod-line-head">
                  <img className="prod-line-bg" src={subcategoryImage(s, category, prods)} alt="" loading="lazy" />
                  <div className="prod-line-text">
                    <span className="prod-line-count">{items.length} {items.length === 1 ? 'product' : 'products'}</span>
                    <h2>{s.name}</h2>
                    {s.description && <p>{s.description}</p>}
                  </div>
                  <Link href={`/contact?product=${encodeURIComponent(s.name)}`} className="segment-panel-cta">
                    Get a quote for {s.name} <IconArrowRight size={14} />
                  </Link>
                </header>
                {items.length > 0 && (
                  <div className="prod-tile-grid">
                    {items.map((item, i) => <ItemCard key={item.name} item={item} line={s.name} index={i} />)}
                  </div>
                )}
              </section>
            );
          })}

          {placed.some((p) => !p.subcategory) && (
            <section className="segment-block">
              <header className="segment-block-head"><div className="segment-block-title"><span className="segment-rule" /><h2>More in {category.name}</h2></div></header>
              <div className="dedicated-products-grid">
                {placed.filter((p) => !p.subcategory).map(({ prod }) => <ProductCard key={prod.id} prod={prod} />)}
              </div>
            </section>
          )}
        </div>

        {/* Other segments */}
        <section className="section-container segment-others">
          <h2>Other segments</h2>
          <div className="segment-cards">
            {others.map((c) => (
              <Link key={c.slug} href={`/products/${c.slug}`} className="segment-card small">
                <img src={categoryImage(c)} alt="" loading="lazy" />
                <span className="segment-card-body">
                  <strong>{c.name}</strong>
                  <em>{c.subcategories.length} product lines</em>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
