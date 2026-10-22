import { IconMapPin, IconGlobe } from './Icons';

export default function Presence() {
  const hubs = [
    { id: 'presenceFbd', city: 'Faridabad', state: 'Haryana', type: 'Central Corporate Office & Stockyard' },
    { id: 'presenceBhiwadi', city: 'Bhiwadi', state: 'Rajasthan', type: 'Industrial Processing & Sourcing Hub' },
    { id: 'presenceRaipur', city: 'Raipur', state: 'Chhattisgarh', type: 'Primary Steel Sourcing Channel' },
    { id: 'presenceNagpur', city: 'Nagpur', state: 'Maharashtra', type: 'Central India Transit Depot' },
    { id: 'presenceRourkela', city: 'Rourkela', state: 'Odisha', type: 'Eastern Steel Belt Depot' },
    { id: 'presencePune', city: 'Pune', state: 'Maharashtra', type: 'Western Manufacturing Hub' },
    { id: 'presenceMumbai', city: 'Mumbai', state: 'Maharashtra', type: 'Financial & Port Logistics Depot' },
  ];

  return (
    <section className="section presence-modern-section" id="presence">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-cyan">
            <IconGlobe size={15} /> DISTRIBUTION INFRASTRUCTURE
          </div>
          <h2 className="section-title text-white">
            Strategic <span className="text-gradient">PAN India Network</span>
          </h2>
          <p className="section-desc text-gray">
            Direct access to major steel production clusters and industrial consumption corridors guarantees consistent availability and optimal freight costs.
          </p>
        </div>

        <div className="presence-modern-grid" id="presenceGrid">
          {hubs.map((hub) => (
            <div className="hub-modern-card" id={hub.id} key={hub.id}>
              <div className="hub-icon-wrap">
                <IconMapPin size={22} />
              </div>
              <div className="hub-info">
                <h4 className="hub-city">{hub.city}</h4>
                <span className="hub-state">{hub.state}</span>
                <p className="hub-type">{hub.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
