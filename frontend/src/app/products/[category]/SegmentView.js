'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ScrollToTop from '../../../components/ScrollToTop';
import ProductCard from '../../../components/ProductCard';
import { CatalogueSkeleton } from '../../../components/Skeletons';
import { IconArrowRight, IconPhone, IconDownload } from '../../../components/Icons';
import { useCatalogue } from '../../../lib/catalogueApi';
import { useProducts } from '../../../lib/productsApi';
import { resolveProductPlacement } from '../../../data/catalogue';
import { itemDetail, subcategoryImage } from '../../../lib/segments';

/**
 * One product tile. Items with their own photo get a photo card; items that
 * would only repeat the line's photo get a clean spec card instead.
 */
function ItemCard({ item, line, index }) {
  const href = `/contact?product=${encodeURIComponent(`${item.name} (${line})`)}`;
  if (!item.hasOwnImage) {
    return (
      <article className="prod-spec">
        <span className="prod-spec-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <h3>{item.name}</h3>
        {item.description && <p>{item.description}</p>}
        <Link href={href} className="prod-tile-cta">Enquire now <IconArrowRight size={13} /></Link>
      </article>
    );
  }
  return (
    <article className="prod-tile">
      <div className="prod-tile-media">
        <img src={item.image_url} alt={item.name} loading="lazy" />
      </div>
      <div className="prod-tile-body">
        <h3>{item.name}</h3>
        {item.description && <p>{item.description}</p>}
        <Link href={href} className="prod-tile-cta">Enquire now <IconArrowRight size={13} /></Link>
      </div>
    </article>
  );
}

export default function SegmentView() {
  const { category: slug } = useParams();
  const { tree, source } = useCatalogue();
  const { products } = useProducts();
  const router = useRouter();
  // Selected product line, kept in the URL hash (#tmt-bars) so it can be linked and survives refresh.
  const [lineSlug, setLineSlug] = useState('');
  useEffect(() => {
    const read = () => setLineSlug(decodeURIComponent(window.location.hash.slice(1)));
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  const pickLine = (lineSlugNext) => {
    setLineSlug(lineSlugNext);
    window.history.replaceState(null, '', `#${lineSlugNext}`);
    document.getElementById('catalogue-browser')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const category = tree.find((c) => c.slug === slug);
  const placed = useMemo(
    () => products.map((prod) => ({ prod, ...resolveProductPlacement(prod, tree) })).filter((p) => p.category?.slug === slug),
    [products, tree, slug]
  );

  if (!category && source === 'seed') {
    return (
      <>
        <Navbar />
        <main className="segment-page"><CatalogueSkeleton withChrome={false} /></main>
        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="segment-page">
          <div className="section-container segment-missing">
            {(
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

  const itemCount = category.subcategories.reduce((n, s) => n + s.items.length, 0);
  const line = category.subcategories.find((s) => s.slug === lineSlug) || category.subcategories[0];
  const lineProds = line ? placed.filter((p) => p.subcategory?.slug === line.slug).map((p) => p.prod) : [];
  const items = line ? line.items.map((i) => itemDetail(i, line, category, lineProds)) : [];
  const photoItems = items.filter((i) => i.hasOwnImage);
  const specItems = items.filter((i) => !i.hasOwnImage);
  const loose = placed.filter((p) => !p.subcategory);

  return (
    <>
      <Navbar />
      <main className="segment-page">
        {/* Compact segment header */}
        <section className="cat-head">
          <div className="section-container cat-head-inner">
            <div className="cat-head-text">
              <nav className="segment-crumbs" aria-label="Breadcrumb">
                <Link href="/products">Products</Link>
                <span>/</span>
                <span>{category.name}</span>
                {line && <><span>/</span><span className="current">{line.name}</span></>}
              </nav>
              <h1>{category.name}</h1>
              {category.tagline && <p>{category.tagline}</p>}
              <div className="segment-facts">
                <span><b>{category.subcategories.length}</b> product lines</span>
                <span><b>{itemCount}</b> products</span>
                {category.company && <span>{category.company}</span>}
              </div>
            </div>
            <div className="cat-head-actions">
              <Link href={`/contact?product=${encodeURIComponent(category.name)}`} className="btn-primary">
                <IconPhone size={16} /> <span>Get a quote</span>
              </Link>
              <a href="/Aggarwal_Steels_Catalogue_2026.pdf" download className="btn-secondary">
                <IconDownload size={16} /> <span>Catalogue PDF</span>
              </a>
            </div>
          </div>
        </section>

        <div className="section-container cat-browser" id="catalogue-browser">
          {/* Left: Segment -> Product line tree */}
          <aside className="cat-side" aria-label="Browse the catalogue">
            <span className="cat-side-title">Browse catalogue</span>

            {/* Phones: segment picker + line chips */}
            <select
              className="cat-side-select"
              value={category.slug}
              onChange={(e) => router.push(`/products/${e.target.value}`)}
              aria-label="Product segment"
            >
              {tree.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>

            <ul className="cat-tree">
              {tree.map((c) => {
                const open = c.slug === category.slug;
                return (
                  <li key={c.slug} className={open ? 'open' : undefined}>
                    <Link href={`/products/${c.slug}`} className="cat-tree-seg" aria-current={open ? 'page' : undefined}>
                      <span>{c.name}</span>
                      <em>{c.subcategories.reduce((n, s) => n + s.items.length, 0)}</em>
                    </Link>
                    {open && (
                      <ul className="cat-tree-lines">
                        {c.subcategories.map((s) => (
                          <li key={s.slug}>
                            <button
                              type="button"
                              className={s.slug === line?.slug ? 'active' : undefined}
                              aria-pressed={s.slug === line?.slug}
                              onClick={() => pickLine(s.slug)}
                            >
                              <span>{s.name}</span>
                              <em>{s.items.length}</em>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Right: the selected product line only */}
          <div className="cat-main">
            {line ? (
              <section className="prod-line" key={line.slug}>
                <header className="prod-line-head">
                  <div className="prod-line-photo">
                    <img src={subcategoryImage(line, category, lineProds)} alt={line.name} />
                  </div>
                  <div className="prod-line-text">
                    <span className="prod-line-count">{items.length} {items.length === 1 ? 'product' : 'products'}</span>
                    <h2>{line.name}</h2>
                    {line.description && <p>{line.description}</p>}
                  </div>
                  <div className="prod-line-cta">
                    <Link href={`/contact?product=${encodeURIComponent(line.name)}`} className="segment-panel-cta" title={`Get a quote for ${line.name}`}>
                      Get a quote <IconArrowRight size={13} />
                    </Link>
                  </div>
                </header>
                {photoItems.length > 0 && (
                  <div className="prod-tile-grid">
                    {photoItems.map((item, i) => <ItemCard key={item.name} item={item} line={line.name} index={i} />)}
                  </div>
                )}
                {specItems.length > 0 && (
                  <div className="prod-tile-grid prod-spec-grid">
                    {specItems.map((item, i) => <ItemCard key={item.name} item={item} line={line.name} index={i} />)}
                  </div>
                )}
              </section>
            ) : <p className="cat-empty">No product lines in this segment yet.</p>}

            {loose.length > 0 && (
              <section className="segment-block">
                <header className="segment-block-head"><div className="segment-block-title"><span className="segment-rule" /><h2>More in {category.name}</h2></div></header>
                <div className="dedicated-products-grid">
                  {loose.map(({ prod }) => <ProductCard key={prod.id} prod={prod} />)}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
