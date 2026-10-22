export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img
          src="/images/hero_steel_background.jpg"
          alt="Aggarwal Steels Factory"
          className="hero-bg-img"
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-badge" id="heroBadge">
          <span className="badge-dot"></span>
          <span>Decades of Reliability</span>
        </div>
        <h1 className="hero-title" id="heroTitle">
          Strong Foundations,<br />
          <span className="hero-highlight">Stronger Relations</span>
        </h1>
        <p className="hero-subtitle" id="heroSubtitle">
          Supplying superior Iron &amp; Steel products — TMT Bars, Plates, Angles,
          Channels, Beams &amp; more. PAN India presence. Trusted by builders &amp;
          industries across the nation since 1990.
        </p>
        <div className="hero-actions" id="heroActions">
          <a href="#products" className="btn-primary" id="btnBrowseProducts">Browse Products →</a>
          <a href="#contact" className="btn-secondary" id="btnGetQuote">Get a Quote</a>
        </div>
        <div className="hero-stats" id="heroStats">
          <div className="stat-item">
            <span className="stat-number">148<span className="stat-cr">Cr+</span></span>
            <span className="stat-label">Revenue 2024-25</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">7<span className="stat-plus">+</span></span>
            <span className="stat-label">Cities Presence</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">24<span className="stat-plus">hr</span></span>
            <span className="stat-label">Fast Dispatch</span>
          </div>
        </div>
      </div>
      <div className="hero-scroll" id="heroScroll">
        <div className="scroll-indicator">
          <div className="scroll-dot"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
