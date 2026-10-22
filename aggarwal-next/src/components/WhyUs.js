export default function WhyUs() {
  const reasons = [
    {
      id: 'whyQuality',
      icon: '🏗️',
      title: 'Quality Team In-House',
      desc: 'Skilled professionals ensuring superior quality in every single product batch — from sourcing to dispatch.',
    },
    {
      id: 'whyDispatch',
      icon: '⚡',
      title: '24-Hour Fast Dispatch',
      desc: 'MS material dispatched within 24 hours for timely project support. Never let your project halt.',
    },
    {
      id: 'whyIndia',
      icon: '🌍',
      title: 'All India Presence',
      desc: 'Reliable supply across PAN India, reaching Faridabad, Bhiwadi, Raipur, Nagpur, Rourkela, Pune & Mumbai.',
    },
    {
      id: 'whyProducts',
      icon: '📦',
      title: 'Wide Product Range',
      desc: 'Complete range — TMT Bars, Plates, Angles, Channels, Beams, CR/HR/GP Coils, SS Sheets, and more.',
    },
    {
      id: 'whyExperience',
      icon: '📅',
      title: 'Long-Term Experience',
      desc: 'Years of expertise serving construction and industrial sectors with trust, consistency and competitive pricing.',
    },
    {
      id: 'whyIsi',
      icon: '✅',
      title: 'ISI Certified Materials',
      desc: 'All products conform to BIS/ISI standards. Mill test certificates provided on request for every order.',
    },
  ];

  return (
    <section className="why-section section" id="why-us">
      <div className="container">
        <div className="section-header section-header-light">
          <div className="section-label label-gold">Why Choose Us</div>
          <h2 className="section-title text-white">Built on <span className="text-accent">Trust</span> &amp; Quality</h2>
          <p className="section-desc text-gray">
            Three decades of serving India's construction and industrial sector with integrity, quality, and competitive pricing.
          </p>
        </div>

        <div className="why-grid" id="whyGrid">
          {reasons.map(r => (
            <div className="why-card" id={r.id} key={r.id}>
              <div className="why-icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="quote-banner" id="quoteBanner">
          <div className="qb-icon">"</div>
          <p className="qb-text">
            Iron is the backbone of modern construction — strong, durable, and essential for building infrastructure that lasts generations.
          </p>
        </div>
      </div>
    </section>
  );
}
