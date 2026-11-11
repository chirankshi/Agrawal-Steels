import Link from 'next/link';
import { IconMapPin, IconGlobe, IconPhone, IconMail, IconArrowRight, IconShieldCheck } from './Icons';

export default function Presence() {
  const locations = [
    {
      type: 'HEAD OFFICE',
      name: 'Corporate Headquarters & Manufacturing',
      address: 'Block C, Plot No. E-372, RIICO Industrial Area, Bhiwadi 301019, Rajasthan',
      badge: 'Head Office',
      iconColor: '#f59e0b',
    },
    {
      type: 'UNIT 02',
      name: 'Heavy Manufacturing & Powder Coating Facility',
      address: 'G1-385, RIICO Industrial Area, Bhiwadi 301019, Rajasthan',
      badge: 'Manufacturing Unit 02',
      iconColor: '#00e5ff',
    },
  ];

  const contactPersons = [
    {
      name: 'Mr. Aakash Goyal',
      role: 'Managing Director',
      phone: '+91 7300070778',
      email: 'md@aggarwalsteel.com',
    },
    {
      name: 'Pankaj S Sharma',
      role: 'Director – Business Development & Operations',
      phone: '+91 7300096120',
      email: 'sales@aggarwalsteel.com',
    },
  ];

  const states = [
    'Delhi NCR',
    'Haryana',
    'Rajasthan',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Maharashtra',
    'Gujarat',
    'Karnataka',
    'Tamil Nadu',
    'West Bengal',
  ];

  return (
    <section className="section presence-modern-section" id="presence">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-cyan">
            <IconGlobe size={15} /> OFFICIAL LOCATIONS &bull; 2026 CATALOGUE
          </div>
          <h2 className="section-title text-white">
            Our Locations &amp; <span className="text-gradient">Key Leadership</span>
          </h2>
          <p className="section-desc text-gray">
            Operating our Head Office and high-capacity manufacturing facilities in RIICO Industrial Area, Bhiwadi, Rajasthan.
          </p>
        </div>

        {/* 2 Official Location Cards from Catalogue */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '2rem',
          }}
        >
          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="hub-modern-card"
              style={{
                borderLeft: `4px solid ${loc.iconColor}`,
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7))',
                borderRadius: '14px',
                padding: '1.4rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: loc.iconColor,
                  padding: '12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconMapPin size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: loc.iconColor,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {loc.type}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {loc.badge}
                  </span>
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 6px 0', fontWeight: 700 }}>
                  {loc.name}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                  {loc.address}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Key Contact Persons from Catalogue Page 32 */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <h4 style={{ color: '#f59e0b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.2px', margin: 0, fontWeight: 700 }}>
              Key Contact Persons &bull; Direct Connect
            </h4>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {contactPersons.map((person, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1.1rem 1.3rem',
                }}
              >
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.05rem' }}>{person.name}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px', marginBottom: '10px' }}>{person.role}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
                  <a
                    href={`tel:${person.phone.replace(/[^0-9+]/g, '')}`}
                    style={{ color: '#00e5ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                  >
                    <IconPhone size={14} />
                    <span>{person.phone}</span>
                  </a>
                  <a
                    href={`mailto:${person.email}`}
                    style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <IconMail size={14} />
                    <span>{person.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* National Presence Banner (Catalogue Page 31: 25+ Cities) */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <h4 style={{ color: '#94a3b8', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Supply Reach Across India (25+ Cities &bull; 100+ Satisfied Clients):
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {states.map((st, i) => (
              <span
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  color: '#e2e8f0',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                ✓ {st}
              </span>
            ))}
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '20px',
                padding: '5px 14px',
                color: '#f59e0b',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              + Pan India Logistics
            </span>
          </div>
        </div>

        <div className="section-cta-wrap" style={{ marginTop: '2rem' }}>
          <Link href="/contact" className="btn-modern-primary" id="btnConnectLocations">
            <span>Contact Corporate Sales Desk</span>
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
