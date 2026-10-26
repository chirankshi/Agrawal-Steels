export default function PartnersStrip() {
  const primaryMills = [
    { id: 'partnerSail', name: 'SAIL', title: 'Steel Authority of India Ltd.', badge: 'MTC Certified' },
    { id: 'partnerTata', name: 'TATA STEEL', title: 'Tata Steel Limited', badge: 'Primary Partner' },
    { id: 'partnerJspl', name: 'JSPL', title: 'Jindal Steel & Power Ltd.', badge: 'Structural Grade' },
    { id: 'partnerAmns', name: 'AM / NS', title: 'ArcelorMittal Nippon Steel', badge: 'Flat Products' },
    { id: 'partnerApollo', name: 'APOLLO PIPES', title: 'APL Apollo Tubes Ltd.', badge: 'Hollow Sections' },
    { id: 'partnerJindalSs', name: 'JINDAL SS', title: 'Jindal Stainless Limited', badge: 'SS 304 / 202' },
  ];

  const trustedClients = [
    { name: 'Amazon', logo: '/images/brand/client_1.png', category: 'E-Commerce Fulfillment' },
    { name: 'Maruti Suzuki', logo: '/images/brand/client_9.png', category: 'Automotive Giant' },
    { name: 'M3M India', logo: '/images/brand/client_11.png', category: 'Mega Real Estate' },
    { name: 'KEI Wires & Cables', logo: '/images/brand/client_3.png', category: 'Heavy Electrical' },
    { name: 'AFCONS Infrastructure', logo: '/images/brand/client_6.png', category: 'National EPC & Bridges' },
    { name: 'Kuehne + Nagel', logo: '/images/brand/client_4.png', category: 'Global Logistics' },
    { name: 'Yusen Logistics', logo: '/images/brand/client_2.png', category: 'Supply Chain Operations' },
    { name: 'Jubilant', logo: '/images/brand/client_7.png', category: 'Pharma & Chemicals' },
    { name: 'AIPL', logo: '/images/brand/client_8_whitebg.png', category: 'Commercial Spaces' },
    { name: 'SKH (Krishna Group)', logo: '/images/brand/client_10.png', category: 'Precision Metal Stamping' },
    { name: 'Pioneer', logo: '/images/brand/client_5.png', category: 'Industrial Systems' },
  ];

  return (
    <div className="partners-modern-strip" id="partnersStrip">
      <div className="container">
        {/* Steel Mills Primary Partners */}
        <div className="partners-header">
          <span className="partners-tag">PRIMARY STEEL SOURCING PARTNERS</span>
          <p className="partners-sub">Procuring directly from leading integrated blast furnace mills with 100% Mill Test Certificates (MTC)</p>
        </div>
        <div className="partners-brand-grid">
          {primaryMills.map(p => (
            <div className="partner-brand-tile" id={p.id} key={p.id}>
              <div className="partner-brand-name">{p.name}</div>
              <span className="partner-brand-desc">{p.title}</span>
              <span className="partner-mill-badge">{p.badge}</span>
            </div>
          ))}
        </div>

        {/* Real Trusted Corporate Clients with Genuine Logos */}
        <div className="partners-header" style={{ marginTop: '50px' }}>
          <span className="partners-tag partners-tag--clients">OUR VALUED CLIENTS &bull; VERIFIED INDUSTRIAL TRACK RECORD</span>
          <p className="partners-sub">Partnering with Fortune 500 enterprises, national EPC leaders, and automotive manufacturing titans</p>
        </div>
        
        <div className="client-logos-grid" id="clientLogosGrid">
          {trustedClients.map((c, i) => (
            <div className="client-logo-card" key={i} title={`${c.name} - ${c.category}`}>
              <div className="client-logo-img-wrap">
                <img
                  src={c.logo}
                  alt={`${c.name} Corporate Logo`}
                  className="client-logo-img"
                  loading="lazy"
                />
              </div>
              <div className="client-logo-meta">
                <span className="client-logo-title">{c.name}</span>
                <span className="client-logo-cat">{c.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
