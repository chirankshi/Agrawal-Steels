export default function TickerStrip() {
  const items = [
    '🏭 SAIL Authorized Dealer',
    '⚡ Tata Steel Partner',
    '🔩 JSPL Certified',
    '📦 24-Hour Fast Dispatch',
    '🌍 PAN India Delivery',
    '✅ ISI Certified Materials',
  ];

  // Repeat for continuous marquee effect
  const repeated = [...items, ...items, ...items];

  return (
    <div className="ticker-strip" id="tickerStrip">
      <div className="ticker-label">
        <span className="ticker-dot"></span>
        Live Updates
      </div>
      <div className="ticker-track">
        <div className="ticker-content">
          {repeated.map((text, idx) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span>{text}</span>
              <span className="ticker-sep">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
