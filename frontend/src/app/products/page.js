'use client';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { IconArrowRight, IconShieldCheck, IconPhone, IconClock, IconAward, IconDownload } from '../../components/Icons';
import { useCatalogue } from '../../lib/catalogueApi';
import { categoryImage } from '../../lib/segments';

/** Products landing: one card per segment. Each card opens /products/[category]. */
function ProductsDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tree } = useCatalogue();

  // Old filter links (/products?category=racking&sub=...) open the segment page
  const legacyCategory = searchParams.get('category');
  const legacySub = searchParams.get('sub');
  useEffect(() => {
    if (legacyCategory) router.replace(`/products/${legacyCategory}${legacySub ? `#${legacySub}` : ''}`);
  }, [legacyCategory, legacySub, router]);

  return (
    <>
      <Navbar />
      <main className="dedicated-page-container">
        <section className="products-landing-hero">
          <div className="section-container products-landing-head">
            <div className="products-landing-text">
              <h1>Our Products</h1>
              <p>Choose a segment to see every product line we supply and manufacture.</p>
            </div>
            <div className="products-landing-actions">
              <a href="/Aggarwal_Steels_Catalogue_2026.pdf" download className="btn-primary" id="btnDownloadCatalogProducts">
                <IconDownload size={16} /> <span>Download Catalogue<span className="hide-sm"> (PDF)</span></span>
              </a>
              <Link href="/contact" className="btn-secondary" id="btnRequestQuoteProducts">
                <IconPhone size={16} /> <span>Get a Quote</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="section-container products-landing">
          <div className="segment-cards" id="segments">
            {tree.map((c) => (
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
