import { IconShieldCheck, IconZap, IconTruck, IconGlobe } from './Icons';

export default function TickerStrip() {
  const highlights = [
    { text: 'SAIL Authorized Channel Partner', icon: <IconShieldCheck size={14} /> },
    { text: 'Tata Steel Distribution Network', icon: <IconShieldCheck size={14} /> },
    { text: 'JSPL Structural Certified Grades', icon: <IconShieldCheck size={14} /> },
    { text: '24-Hour Guaranteed Dispatch on Stock Items', icon: <IconZap size={14} /> },
    { text: 'PAN India Logistics to 7 Strategic Hubs', icon: <IconGlobe size={14} /> },
    { text: 'Mill Test Certificates (MTC) with Every Batch', icon: <IconShieldCheck size={14} /> },
  ];

  const repeated = [...highlights, ...highlights, ...highlights];

  return (
    <div className="ticker-strip-modern" id="tickerStrip">
      <div className="ticker-badge">
        <span className="ticker-live-dot"></span>
        <span>PARTNERSHIP NETWORK</span>
      </div>
      <div className="ticker-track">
        <div className="ticker-content">
          {repeated.map((item, idx) => (
            <div className="ticker-item" key={idx}>
              <span className="ticker-item-icon">{item.icon}</span>
              <span className="ticker-item-text">{item.text}</span>
              <span className="ticker-divider">&bull;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
