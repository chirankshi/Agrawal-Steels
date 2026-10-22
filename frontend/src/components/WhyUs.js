import { IconShieldCheck, IconZap, IconGlobe, IconLayers, IconAward, IconCheck } from './Icons';

export default function WhyUs() {
  const differentiators = [
    {
      id: 'whyQuality',
      icon: <IconShieldCheck size={24} />,
      title: 'In-House Quality Inspection',
      desc: 'Dedicated metallurgical and dimension testing on incoming and outgoing consignments with mill test certificates.',
    },
    {
      id: 'whyDispatch',
      icon: <IconZap size={24} />,
      title: '24-Hour Expedited Dispatch',
      desc: 'Strategic ready-stock inventory in Faridabad and regional hubs ensures project timelines never face downtime.',
    },
    {
      id: 'whyIndia',
      icon: <IconGlobe size={24} />,
      title: 'Multi-City Logistics Fleet',
      desc: 'Seamless transit access across Faridabad, Bhiwadi, Raipur, Nagpur, Rourkela, Pune, and Mumbai.',
    },
    {
      id: 'whyProducts',
      icon: <IconLayers size={24} />,
      title: 'Complete Structural Spectrum',
      desc: 'One-stop procurement spanning TMT rebars, heavy structural sections, flat coils, hollow pipes, and SS sheets.',
    },
    {
      id: 'whyExperience',
      icon: <IconAward size={24} />,
      title: '30+ Years Industry Legacy',
      desc: 'Three decades of transparent pricing, ethical commercial practices, and deep tier-1 steel mill relationships.',
    },
    {
      id: 'whyIsi',
      icon: <IconCheck size={24} />,
      title: '100% BIS & ISI Standard',
      desc: 'All supplies strictly conform to Bureau of Indian Standards (BIS) specifications with guaranteed chemical traceability.',
    },
  ];

  return (
    <section className="section why-modern-section" id="why-us">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-cyan">
            <IconShieldCheck size={15} /> COMPETITIVE ADVANTAGE
          </div>
          <h2 className="section-title text-white">
            Why Contractors &amp; Industries <span className="text-gradient">Choose Us</span>
          </h2>
          <p className="section-desc text-gray">
            Built on engineering excellence, guaranteed authenticity, and clockwork delivery precision since 1990.
          </p>
        </div>

        <div className="why-modern-grid" id="whyGrid">
          {differentiators.map(d => (
            <div className="why-modern-card" id={d.id} key={d.id}>
              <div className="why-icon-box">{d.icon}</div>
              <h3 className="why-card-title">{d.title}</h3>
              <p className="why-card-desc">{d.desc}</p>
            </div>
          ))}
        </div>

        {/* Industrial Principle Banner */}
        <div className="principle-banner">
          <div className="principle-content">
            <span className="principle-tag">INDUSTRY BENCHMARK</span>
            <p className="principle-quote">
              "Structural steel is the unseen skeleton of the nation's progress — we treat every beam and plate with the uncompromising standard it demands."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
