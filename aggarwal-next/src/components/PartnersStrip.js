export default function PartnersStrip() {
  const partners = [
    { id: 'partnerSail', name: 'SAIL', sub: 'Steel Authority of India' },
    { id: 'partnerTata', name: 'TATA', sub: 'Tata Steel Ltd.' },
    { id: 'partnerJspl', name: 'JSPL', sub: 'Jindal Steel & Power' },
    { id: 'partnerAmns', name: 'AMNS', sub: 'Essar / AMNS' },
    { id: 'partnerApollo', name: 'Apollo', sub: 'Apollo Pipes Ltd.' },
  ];

  return (
    <div className="partners-strip" id="partnersStrip">
      <div className="container">
        <div className="partners-label">Authorised Dealer &amp; Partner of</div>
        <div className="partners-logos">
          {partners.map(p => (
            <div className="partner-item" key={p.id}>
              <div className="partner-logo-box" id={p.id}>{p.name}</div>
              <span>{p.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
