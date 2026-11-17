import Link from 'next/link';
import { IconArrowRight } from './Icons';

/** Full specification card for a product (Products directory and segment pages). */
export default function ProductCard({ prod }) {
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
