import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import Certificates from '../../components/Certificates';
import { IconArrowRight, IconPhone, IconCheckCircle } from '../../components/Icons';

export const metadata = {
  title: 'Quality, Safety & Logistics',
  description:
    'How Aggarwal Steels and Majestic AR Technology check every stage from raw material to dispatch, keep the workplace safe, and deliver across India.',
  alternates: { canonical: '/quality' },
};

const IMG = '/images/catalogue/';

// Text from the 2026 catalogue, pages 26 to 29.
const QUALITY_STEPS = [
  { title: 'Raw material inspection', text: 'Incoming material is checked for grade, thickness, dimensions and surface quality.', img: 'qc-raw.jpg' },
  { title: 'In-process quality checks', text: 'Dimensions, fabrication accuracy and fitment are inspected at each stage of production.', img: 'qc-inprocess.jpg' },
  { title: 'Finish & coating inspection', text: 'Powder coating thickness, surface finish and adhesion are verified for long-lasting performance.', img: 'qc-coating.jpg' },
  { title: 'Final inspection & dispatch', text: 'Complete dimensional, visual and assembly checks are done before dispatch to ensure zero-defect delivery.', img: 'qc-dispatch.jpg' },
];

const QUALITY_CHECKS = [
  { title: 'Raw material', text: 'Quality steel sourced from trusted suppliers, with mill test certificates.', img: 'qa-raw-material.jpg' },
  { title: 'Dimensional checks', text: 'Accurate measurements for precise fabrication.', img: 'qa-dimensional.jpg' },
  { title: 'Weld quality', text: 'Strong and reliable joints with advanced welding processes.', img: 'qa-weld.jpg' },
  { title: 'Finish inspection', text: 'Uniform coating and flaw-free finishing.', img: 'qa-finish.jpg' },
];

const SUSTAINABILITY = [
  { title: 'Environment conscious', text: 'Efficient use of resources and responsible waste management.' },
  { title: 'Resource efficiency', text: 'Optimised processes to minimise material wastage.' },
  { title: 'A greener tomorrow', text: 'Committed to sustainable growth for future generations.' },
];

const SAFETY = [
  { title: 'Safety first', text: 'Regular training and safety protocols for all employees.' },
  { title: 'People well-being', text: 'Healthy and secure work environments across facilities.' },
  { title: 'Compliance', text: 'Adherence to industry standards and regulatory requirements.' },
  { title: 'Sustainable operations', text: 'Contributing to a cleaner and safer industrial ecosystem.' },
];

const LOGISTICS = [
  { title: 'Pan India delivery', text: 'Reliable distribution network across major cities and industrial hubs.' },
  { title: 'Secure packaging', text: 'Strong and safe packaging so products arrive in perfect condition.' },
  { title: 'On-time dispatch', text: 'Efficient planning and coordination for timely delivery commitments.' },
  { title: 'Flexible supply', text: 'Customised logistics support for bulk and project-based orders.' },
];

const CAPABILITIES = [
  'Bulk order handling',
  'Project-wise dispatch planning',
  'Coordination with trusted transport partners',
  'Safe loading and unloading',
  'Real-time tracking and updates',
];

function Intro({ eyebrow, title, accent, children, img, alt, reverse = false, id }) {
  return (
    <section className={`qp-intro ${reverse ? 'reverse' : ''}`} id={id}>
      <div className="section-container qp-intro-inner">
        <div className="qp-intro-text">
          <span className="segment-rule wide" aria-hidden="true" />
          <span className="qp-eyebrow">{eyebrow}</span>
          <h2 className="segment-title">
            <span>{title}</span>
            <span className="accent">{accent}</span>
          </h2>
          {children}
        </div>
        <div className="segment-hero-img qp-intro-img">
          <img src={IMG + img} alt={alt} loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function PointGrid({ items, cols = 4 }) {
  return (
    <ul className="qp-points" style={{ '--cols': cols }}>
      {items.map((p) => (
        <li key={p.title}>
          <span className="segment-row-tick" aria-hidden="true">✓</span>
          <div>
            <strong>{p.title}</strong>
            <span>{p.text}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function QualityPage() {
  return (
    <>
      <Navbar />
      <main className="segment-page qp-page">
        <section className="segment-hero">
          <div className="section-container segment-hero-inner">
            <div className="segment-hero-text">
              <nav className="segment-crumbs" aria-label="Breadcrumb">
                <Link href="/about">About</Link>
                <span>/</span>
                <span>Quality, Safety &amp; Logistics</span>
              </nav>
              <span className="segment-rule wide" aria-hidden="true" />
              <h1 className="segment-title">
                <span>Quality &amp;</span>
                <span className="accent">Assurance</span>
              </h1>
              <p className="segment-tagline">Committed to precision, durability and consistent quality in every output.</p>
              <p className="segment-desc">
                From raw material inspection to final dispatch, every order is checked for grade, dimensions, weld quality and finish.
                Our plants follow ISO 9001, ISO 14001, ISO 45001 and ISO 3834-2.
              </p>
              <div className="segment-facts">
                <a href="#quality">Quality control</a>
                <a href="#safety">Sustainability &amp; safety</a>
                <a href="#logistics">Logistics</a>
              </div>
            </div>
            <div className="segment-hero-img">
              <img src={`${IMG}quality-hero.jpg`} alt="Digital caliper measuring a steel plate" />
            </div>
          </div>
        </section>

        <div className="section-container qp-block" id="quality">
          <div className="qp-head">
            <span className="segment-rule" aria-hidden="true" />
            <h2>Quality at every step</h2>
            <p>A stringent quality control process at every stage of production, for precision, durability and reliability.</p>
          </div>
          <ol className="qp-steps">
            {QUALITY_STEPS.map((s, i) => (
              <li key={s.title}>
                <img src={IMG + s.img} alt="" loading="lazy" />
                <div>
                  <span className="qp-step-no">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{s.title}</strong>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="qp-checks">
            {QUALITY_CHECKS.map((c) => (
              <figure key={c.title}>
                <img src={IMG + c.img} alt="" loading="lazy" />
                <figcaption>
                  <strong>{c.title}</strong>
                  <span>{c.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <Intro id="safety" eyebrow="Responsible manufacturing" title="Sustainability" accent="& Safety" img="sustainability-plant.jpg" alt="Majestic AR Technology plant building">
          <p className="segment-desc">
            We are committed to sustainable practices and a safe working environment, ensuring growth for our business, our people and the planet.
          </p>
          <PointGrid items={SUSTAINABILITY} cols={1} />
        </Intro>

        <div className="section-container qp-block">
          <div className="qp-split">
            <div className="segment-hero-img qp-split-img">
              <img src={`${IMG}safety-gear.jpg`} alt="Aggarwal Steels safety helmet, gloves and glasses" loading="lazy" />
            </div>
            <div>
              <div className="qp-head left">
                <span className="segment-rule" aria-hidden="true" />
                <h2>Our commitment to a safe workplace</h2>
              </div>
              <PointGrid items={SAFETY} cols={2} />
            </div>
          </div>
        </div>

        <Intro id="logistics" reverse eyebrow="Delivering reliability across India" title="Logistics &" accent="Supply Chain" img="logistics-truck.jpg" alt="Loaded trailer leaving the Aggarwal Steels plant">
          <p className="segment-desc">
            Safe, timely and efficient delivery through a well-managed logistics and supply chain network, serving clients across India.
          </p>
          <PointGrid items={LOGISTICS} cols={2} />
        </Intro>

        <div className="section-container qp-block">
          <div className="qp-capabilities">
            <div>
              <div className="qp-head left">
                <span className="segment-rule" aria-hidden="true" />
                <h2>Our logistics capabilities</h2>
              </div>
              <ul className="qp-cap-list">
                {CAPABILITIES.map((c) => (
                  <li key={c}><IconCheckCircle size={16} /> {c}</li>
                ))}
              </ul>
              <div className="segment-hero-actions">
                <Link href="/contact" className="btn-primary"><IconPhone size={16} /> <span>Plan a delivery</span></Link>
                <Link href="/products" className="btn-secondary"><span>Browse products</span> <IconArrowRight size={14} /></Link>
              </div>
            </div>
            <div className="qp-cap-imgs">
              <img src={`${IMG}logistics-stock.jpg`} alt="Racking uprights packed on pallets, ready for dispatch" loading="lazy" />
              <img src={`${IMG}logistics-fleet.jpg`} alt="Forklift loading and the delivery fleet" loading="lazy" />
            </div>
          </div>
        </div>

        <Certificates />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
