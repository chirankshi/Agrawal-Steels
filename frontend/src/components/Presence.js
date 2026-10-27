import Link from 'next/link';
import { IconMapPin, IconGlobe, IconShieldCheck, IconArrowRight } from './Icons';

export default function Presence() {
  const units = [
    {
      title: 'Head Office & Manufacturing',
      location: 'Bhiwadi, Rajasthan',
      address: 'Block C, Plot No. E-372, RIICO Industrial Area, Bhiwadi – 301019, Rajasthan',
      badge: 'Corporate HQ & Plant',
    },
    {
      title: 'Manufacturing Unit 01',
      location: 'IMT Manesar, Gurugram',
      address: '89, Sector 3, IMT Manesar, Gurugram, Haryana',
      badge: 'Production Unit 01',
    },
    {
      title: 'Manufacturing Unit 02',
      location: 'RIICO Bhiwadi, Rajasthan',
      address: 'G1-385, RIICO Industrial Area, Bhiwadi – 301019, Rajasthan',
      badge: 'Production Unit 02',
    },
    {
      title: 'Manufacturing Unit 03',
      location: 'Bawal, Haryana',
      address: '81, Phase IV, Sector 15, Bawal, Haryana',
      badge: 'Production Unit 03',
    },
    {
      title: 'Central Stockyard & Trading Unit',
      location: 'Faridabad, Haryana',
      address: 'Plot No. 680, Sector 59, Faridabad, Haryana – 121004',
      badge: 'Stockyard & Logistics',
    },
  ];

  const regionalHubs = [
    { city: 'Mumbai', state: 'Maharashtra', desc: 'Western Port & Logistics Gateway' },
    { city: 'Pune', state: 'Maharashtra', desc: 'Auto & Heavy Engineering Hub' },
    { city: 'Nagpur', state: 'Maharashtra', desc: 'Central India Transit Center' },
    { city: 'Raipur', state: 'Chhattisgarh', desc: 'Primary Steel Mill Sourcing' },
    { city: 'Rourkela', state: 'Odisha', desc: 'Eastern Steel Belt Depot' },
  ];

  return (
    <section className="section presence-modern-section" id="presence">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-cyan">
            <IconGlobe size={15} /> OPERATIONAL INFRASTRUCTURE &bull; PAN INDIA
          </div>
          <h2 className="section-title text-white">
            Manufacturing Units &amp; <span className="text-gradient">National Network</span>
          </h2>
          <p className="section-desc text-gray">
            Operating 2 specialized manufacturing plants, 3 trading units, and distribution stockyards spanning North, West, and Central India.
          </p>
        </div>

        {/* Major Production Units */}
        <div className="presence-modern-grid" id="presenceUnitsGrid">
          {units.map((unit, idx) => (
            <div className="hub-modern-card" key={idx} style={{ borderLeft: '3px solid #ff9800' }}>
              <div className="hub-icon-wrap">
                <IconMapPin size={22} />
              </div>
              <div className="hub-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="hub-city">{unit.location}</h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(255, 152, 0, 0.15)', color: '#ffb74d', padding: '2px 8px', borderRadius: '4px' }}>
                    {unit.badge}
                  </span>
                </div>
                <strong style={{ color: '#ffffff', fontSize: '0.85rem' }}>{unit.title}</strong>
                <p className="hub-type" style={{ marginTop: '4px', lineHeight: '1.4' }}>{unit.address}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Regional PAN-India Sourcing & Distribution Hubs */}
        <div style={{ marginTop: '1.75rem' }}>
          <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
            Regional Steel Sourcing &amp; Distribution Transit Depots:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {regionalHubs.map((h, i) => (
              <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '10px 14px' }}>
                <div style={{ color: '#00e5ff', fontWeight: '600', fontSize: '0.95rem' }}>{h.city} <span style={{ color: '#64748b', fontSize: '0.78rem' }}>({h.state})</span></div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '3px' }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-cta-wrap">
          <Link href="/about" className="btn-modern-outline" id="btnViewAllLocations">
            <span>View All Locations &amp; Corporate Infrastructure</span>
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
