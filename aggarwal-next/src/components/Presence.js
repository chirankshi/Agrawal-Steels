export default function Presence() {
  const cities = [
    { id: 'presenceFbd', name: 'Faridabad', state: 'Haryana — Head Office', icon: '🏭' },
    { id: 'presenceBhiwadi', name: 'Bhiwadi', state: 'Rajasthan', icon: '📦' },
    { id: 'presenceRaipur', name: 'Raipur', state: 'Chhattisgarh', icon: '📦' },
    { id: 'presenceNagpur', name: 'Nagpur', state: 'Maharashtra', icon: '📦' },
    { id: 'presenceRourkela', name: 'Rourkela', state: 'Odisha', icon: '📦' },
    { id: 'presencePune', name: 'Pune', state: 'Maharashtra', icon: '📦' },
    { id: 'presenceMumbai', name: 'Mumbai', state: 'Maharashtra', icon: '📦' },
  ];

  return (
    <section className="presence-section section" id="presence">
      <div className="container">
        <div className="section-header section-header-light">
          <div className="section-label label-gold">Our Presence</div>
          <h2 className="section-title text-white">PAN India <span className="text-accent">Network</span></h2>
          <p className="section-desc text-gray">
            Aggarwal Steels' PAN India presence reflects our commitment to quality, consistency, and customer trust across the nation.
          </p>
        </div>
        <div className="presence-grid" id="presenceGrid">
          {cities.map(c => (
            <div className="presence-card" id={c.id} key={c.id}>
              <div className="presence-icon">{c.icon}</div>
              <h4>{c.name}</h4>
              <span>{c.state}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
