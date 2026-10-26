import { IconShieldCheck, IconZap, IconGlobe, IconLayers, IconAward, IconCheck } from './Icons';

export default function WhyUs() {
  const differentiators = [
    {
      id: 'whyQuality',
      icon: <IconShieldCheck size={24} />,
      title: 'In-House Quality Team',
      desc: 'Skilled metallurgists and technicians ensuring superior quality in every batch with verified Mill Test Certificates (MTC).',
    },
    {
      id: 'whyDispatch',
      icon: <IconZap size={24} />,
      title: 'Fast 24-Hour Dispatch',
      desc: 'MS materials and prime stock dispatched within 24 hours for zero project downtime across PAN India.',
    },
    {
      id: 'whyIndia',
      icon: <IconGlobe size={24} />,
      title: 'PAN India Supply Network',
      desc: 'Reliable supply reach spanning Bhiwadi, Manesar, Bawal, Faridabad, Mumbai, Pune, Nagpur, Raipur, and Rourkela.',
    },
    {
      id: 'whyProducts',
      icon: <IconLayers size={24} />,
      title: 'Comprehensive Product Spectrum',
      desc: 'Complete one-stop range of TMT bars, plates, structural angles, channels, beams, hollow pipes, and SS sheets.',
    },
    {
      id: 'whyExperience',
      icon: <IconAward size={24} />,
      title: '11+ Years Sourcing Mastery',
      desc: 'Over a decade of deep expertise sourcing directly from SAIL, TATA Steel, JSPL, AMNS India, and Apollo Pipes.',
    },
    {
      id: 'whyIsi',
      icon: <IconCheck size={24} />,
      title: 'In-House Advanced Manufacturing',
      desc: 'Sister arm Majestic AR Technology operating 2 manufacturing plants with 3kW CNC Laser, 4 Bending machines & 520ft powder coating.',
    },
  ];

  return (
    <section className="section why-modern-section" id="why-us">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-cyan">
            <IconShieldCheck size={15} /> WHY CHOOSE AGGARWAL STEELS
          </div>
          <h2 className="section-title text-white">
            Proven Strength: <span className="text-gradient">Why Industry Leaders Choose Us</span>
          </h2>
          <p className="section-desc text-gray">
            Delivering quality, speed, and trusted long-term partnerships across construction, warehousing, and infrastructure since 2015.
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
            <span className="principle-tag">OUR CORE PHILOSOPHY</span>
            <p className="principle-quote">
              &ldquo;Iron is the backbone of modern construction – strong, durable, and essential for building infrastructure that lasts generations.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
