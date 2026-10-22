export default function About() {
  return (
    <section className="about-section section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content" id="aboutContent">
            <div className="section-label">About Us</div>
            <h2 className="section-title">
              Strong Foundations,<br />
              <span className="text-accent">Stronger Relations</span>
            </h2>
            <p className="about-text">
              Since its inception, <strong>Aggarwal Steels</strong> has been dedicated to providing superior iron and steel products — including TMT Bars, Plates, Angles, Channels, Beams, and more — to meet the dynamic needs of the construction and industrial sectors.
            </p>
            <p className="about-text">
              With a strong <strong>PAN India presence</strong>, our advanced infrastructure, modern processing units, and skilled teams ensure every product reflects precision, durability, and consistency.
            </p>
            <div className="about-values" id="aboutValues">
              <div className="value-pill">🏆 Integrity</div>
              <div className="value-pill">⭐ Excellence</div>
              <div className="value-pill">💡 Innovation</div>
              <div className="value-pill">🤝 Empowerment</div>
            </div>
            <a href="#contact" className="btn-primary" id="btnAboutContact">Connect With Us →</a>
          </div>

          <div className="about-visual" id="aboutVisual">
            <div className="founder-card" id="founderCard">
              <div className="founder-avatar">
                <div className="avatar-placeholder" id="avatarPlaceholder">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="30" r="18" stroke="#f59e0b" strokeWidth="2.5" fill="rgba(245,158,11,0.1)"/>
                    <path d="M10 72 Q40 54 70 72" stroke="#f59e0b" strokeWidth="2.5" fill="none"/>
                  </svg>
                </div>
              </div>
              <div className="founder-info">
                <h3 className="founder-name" id="founderName">Mr. Aakash Goyal</h3>
                <span className="founder-title">Founder &amp; CEO</span>
                <blockquote className="founder-quote">
                  "Steel is not just a product — it is the strength that builds foundations and the trust that builds relationships."
                </blockquote>
              </div>
            </div>

            <div className="mission-vision-grid" id="mvGrid">
              <div className="mv-card" id="missionCard">
                <div className="mv-icon">🎯</div>
                <h4>Our Mission</h4>
                <p>Deliver strength with purpose — providing high-quality steel products that empower builders and infrastructure projects with reliability.</p>
              </div>
              <div className="mv-card" id="visionCard">
                <div className="mv-icon">🔭</div>
                <h4>Our Vision</h4>
                <p>Become a globally recognized brand in iron and steel, setting new benchmarks in strength, sustainability, and innovation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
