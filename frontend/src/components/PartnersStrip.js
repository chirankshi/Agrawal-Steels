export default function PartnersStrip() {
  const partners = [
    { id: 'partnerSail', name: 'SAIL', title: 'Steel Authority of India Ltd.' },
    { id: 'partnerTata', name: 'TATA STEEL', title: 'Tata Steel Limited' },
    { id: 'partnerJspl', name: 'JSPL', title: 'Jindal Steel & Power' },
    { id: 'partnerAmns', name: 'AM/NS', title: 'ArcelorMittal Nippon Steel' },
    { id: 'partnerApollo', name: 'APOLLO', title: 'APL Apollo Tubes Ltd.' },
    { id: 'partnerJindalSs', name: 'JINDAL SS', title: 'Jindal Stainless Limited' },
  ];

  return (
    <div className="partners-modern-strip" id="partnersStrip">
      <div className="container">
        <div className="partners-header">
          <span className="partners-tag">AUTHORIZED DISTRIBUTION NETWORK</span>
          <p className="partners-sub">Procuring directly from primary steel producers with mill-backed warranty</p>
        </div>
        <div className="partners-brand-grid">
          {partners.map(p => (
            <div className="partner-brand-tile" id={p.id} key={p.id}>
              <div className="partner-brand-name">{p.name}</div>
              <span className="partner-brand-desc">{p.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
