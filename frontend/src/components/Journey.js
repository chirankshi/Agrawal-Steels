export default function Journey() {
  const timeline = [
    { id: 'timeline2022', year: '2021-22', barHeight: '35%', revenue: '₹52 Cr.' },
    { id: 'timeline2023', year: '2022-23', barHeight: '46%', revenue: '₹68 Cr.' },
    { id: 'timeline2024', year: '2023-24', barHeight: '66%', revenue: '₹98 Cr.' },
    { id: 'timeline2025', year: '2024-25', barHeight: '100%', revenue: '₹148 Cr. 🚀', isLatest: true },
  ];

  const milestones = [
    { icon: '🏭', num: '1990', label: 'Est. Since' },
    { icon: '🌍', num: '7+', label: 'Cities' },
    { icon: '🏢', num: '2', label: 'Business Arms' },
    { icon: '📦', num: '24hr', label: 'Dispatch' },
  ];

  return (
    <section className="journey-section section" id="journey">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Our Journey</div>
          <h2 className="section-title">Growing Year <span className="text-accent">After Year</span></h2>
          <p className="section-desc">
            Step by step, with innovation and trust, Aggarwal Steels has grown into a symbol of strength and reliability in the industry.
          </p>
        </div>

        <div className="journey-timeline" id="journeyTimeline">
          {timeline.map(item => (
            <div
              key={item.id}
              className={`timeline-item ${item.isLatest ? 'timeline-item--latest' : ''}`}
              id={item.id}
            >
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-bar-wrap">
                <div className="timeline-bar" style={{ '--bar-height': item.barHeight }}>
                  <div className="timeline-bar-fill"></div>
                </div>
              </div>
              <div className="timeline-revenue">{item.revenue}</div>
            </div>
          ))}
        </div>

        <div className="milestone-strip" id="milestoneStrip">
          {milestones.map((m, i) => (
            <div className="milestone-item" key={i}>
              <span className="milestone-icon">{m.icon}</span>
              <span className="milestone-num">{m.num}</span>
              <span className="milestone-label">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="subsidiary-card" id="subsidiaryCard">
          <div className="sub-badge">Sister Concern</div>
          <div className="sub-icon">🏗️</div>
          <div className="sub-info">
            <h3>Majestic AR Technology Pvt. Ltd.</h3>
            <p>
              Racking Manufacturing &amp; Storage Solutions — Heavy Duty Storage Racks, Mezzanine Floor Systems, PEB Structures, SS Kitchen Equipment, and more industrial storage solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
