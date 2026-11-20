'use client';
import Link from 'next/link';
import { IconArrowRight, IconFileText } from './Icons';
import { useCatalogue } from '../lib/catalogueApi';
import { categoryImage } from '../lib/segments';

/**
 * Home page products section: one row of segment cards (the first three by
 * display order, set in Admin -> Categories). "View all products" opens the
 * full list. Each card opens the segment page (/products/[category]).
 */
const HOME_SEGMENTS = 3;

export default function Products() {
  const { tree } = useCatalogue();

  return (
    <section className="section products-modern-section" id="products">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-amber">
            <IconFileText size={15} /> OUR PRODUCTS &bull; 2026 CATALOGUE
          </div>
          <h2 className="section-title text-white">
            What we <span className="text-gradient">supply &amp; manufacture</span>
          </h2>
          <p className="section-desc text-gray">
            Choose a segment to see every product line, from primary steel to racking, mezzanines and fabrication.
          </p>
        </div>

        <div className="segment-cards home-segment-cards" id="productsGrid">
          {tree.slice(0, HOME_SEGMENTS).map((c) => (
            <Link key={c.slug} href={`/products/${c.slug}`} className="segment-card">
              <img src={categoryImage(c)} alt="" loading="lazy" />
              <span className="segment-card-body">
                <span className="segment-rule" aria-hidden="true" />
                <strong>{c.name}</strong>
                {c.tagline && <em>{c.tagline}</em>}
                <span className="segment-card-meta">
                  View {c.subcategories.length} product lines
                  <IconArrowRight size={14} />
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="section-cta-wrap">
          <Link href="/products" className="btn-modern-primary" id="btnViewAllProducts">
            <span>View all {tree.length} product segments</span>
            <IconArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
