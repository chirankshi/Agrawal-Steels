import Link from 'next/link';
import { IconArrowRight } from './Icons';
import { CLIENTS, PRIMARY_MILLS } from '../data/clients';

export default function PartnersStrip({ isHome = true }) {
  return (
    <div className="partners-modern-strip" id="clients">
      <span id="partners" style={{ position: 'relative', top: '-90px', visibility: 'hidden' }}></span>
      <span id="partnersStrip" style={{ position: 'relative', top: '-90px', visibility: 'hidden' }}></span>
      <div className="container">
        {/* Steel Mills Primary Partners */}
        <div className="partners-header">
          <span className="partners-tag">PRIMARY STEEL SOURCING PARTNERS</span>
          <p className="partners-sub">Procuring directly from leading integrated blast furnace mills with 100% Mill Test Certificates (MTC)</p>
        </div>
        <div className="partners-brand-grid">
          {PRIMARY_MILLS.map(p => (
            <div className="partner-brand-tile" id={p.id} key={p.id}>
              <div className="partner-brand-name">{p.name}</div>
              <span className="partner-brand-desc">{p.title}</span>
              <span className="partner-mill-badge">{p.badge}</span>
            </div>
          ))}
        </div>

        {/* Real Trusted Corporate Clients with Genuine Logos */}
        <div className="partners-header" style={{ marginTop: '1.75rem' }}>
          <span className="partners-tag partners-tag--clients">OUR VALUED CLIENTS &bull; VERIFIED INDUSTRIAL TRACK RECORD</span>
          <p className="partners-sub">Partnering with Fortune 500 enterprises, national EPC leaders, and automotive manufacturing titans</p>
        </div>
        
        <div className="client-logos-grid" id="clientLogosGrid">
          {(isHome ? CLIENTS.slice(0, 6) : CLIENTS).map((c) => (
            <div className="client-logo-card" key={c.name} title={`${c.name} - ${c.category}`}>
              <div className="client-logo-img-wrap">
                {c.logo ? (
                  <img src={c.logo} alt={`${c.name} Corporate Logo`} className="client-logo-img" loading="lazy" />
                ) : (
                  <span className="client-logo-text">{c.name}</span>
                )}
              </div>
              <div className="client-logo-meta">
                <span className="client-logo-title">{c.name}</span>
                <span className="client-logo-cat">{c.category}</span>
              </div>
            </div>
          ))}
        </div>

        {isHome && (
          <div className="section-cta-wrap">
            <Link href="/clients" className="btn-modern-outline" id="btnViewAllClients">
              <span>View All Client Partners &amp; Project Track Record (20+ Enterprises)</span>
              <IconArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
