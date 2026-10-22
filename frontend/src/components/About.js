import { IconShieldCheck, IconAward, IconZap, IconGlobe, IconTarget, IconCompass, IconArrowRight } from './Icons';

export default function About() {
  const values = [
    { title: 'Quality Integrity', desc: '100% prime tested material', icon: <IconShieldCheck size={18} /> },
    { title: 'Operational Speed', desc: '24-hour rapid dispatch', icon: <IconZap size={18} /> },
    { title: 'National Scale', desc: 'PAN India logistics network', icon: <IconGlobe size={18} /> },
    { title: 'Client Trust', desc: '3+ decades of client partnership', icon: <IconAward size={18} /> },
  ];

  return (
    <section className="section about-modern-section" id="about">
      <div className="container">
        <div className="about-modern-grid">
          {/* Left Column: Narrative */}
          <div className="about-modern-content">
            <div className="section-label label-amber">
              <IconAward size={15} /> CORPORATE BACKGROUND
            </div>
            <h2 className="section-title text-white">
              Strong Foundations.<br />
              <span className="text-gradient">Enduring Relationships.</span>
            </h2>
            <p className="about-lead">
              Founded in 1990 in Faridabad, Haryana, <strong>Aggarwal Steels</strong> has established itself as one of Northern India's foremost independent steel distributors, stockists, and structural fabricators.
            </p>
            <p className="about-sub">
              By combining wholesale primary steel sourcing (SAIL, Tata, JSPL) with in-house processing capabilities via sister concern <strong>Majestic AR Technology</strong>, we deliver an integrated steel supply chain — from raw plates and coils to finished storage racking and structural frames.
            </p>

            {/* Core Values Bento Grid */}
            <div className="about-values-grid">
              {values.map((v, i) => (
                <div className="value-modern-card" key={i}>
                  <div className="value-icon-box">{v.icon}</div>
                  <div>
                    <h4 className="value-title">{v.title}</h4>
                    <span className="value-desc">{v.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-actions-row">
              <a href="#contact" className="btn-modern-primary">
                <span>Partner With Us</span>
                <IconArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Right Column: Founder Quote & Strategic Pillars */}
          <div className="about-modern-cards">
            {/* Leadership Statement Card */}
            <div className="founder-modern-card">
              <div className="founder-header">
                <div className="founder-initials">AG</div>
                <div>
                  <h3 className="founder-name">Mr. Aakash Goyal</h3>
                  <span className="founder-role">Founder &amp; Managing Director</span>
                </div>
              </div>
              <blockquote className="founder-quote-text">
                "Steel is the bedrock of industrial civilization. For us, every ton of steel delivered is a contract of trust with the engineers and builders constructing India's tomorrow."
              </blockquote>
              <div className="founder-meta">
                <span>ESTABLISHED 1990 &bull; FARIDABAD, HARYANA</span>
              </div>
            </div>

            {/* Mission & Vision Split */}
            <div className="mission-vision-modern-grid">
              <div className="mv-modern-card">
                <div className="mv-icon-wrap">
                  <IconTarget size={20} />
                </div>
                <h4 className="mv-heading">Our Mission</h4>
                <p className="mv-text">
                  To eliminate industrial procurement friction by providing authentic, certified steel and precision processing within 24 hours anywhere in India.
                </p>
              </div>

              <div className="mv-modern-card">
                <div className="mv-icon-wrap">
                  <IconCompass size={20} />
                </div>
                <h4 className="mv-heading">Our Vision</h4>
                <p className="mv-text">
                  To emerge as India's most agile and tech-integrated iron &amp; steel infrastructure partner, upholding world-class reliability and sustainability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
