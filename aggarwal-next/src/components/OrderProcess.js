export default function OrderProcess() {
  return (
    <section className="order-section section" id="order">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Simple Process</div>
          <h2 className="section-title">Order in <span className="text-accent">3 Easy Steps</span></h2>
        </div>
        <div className="steps-grid" id="stepsGrid">
          <div className="step-card" id="step1">
            <div className="step-number">01</div>
            <div className="step-icon">📋</div>
            <h3>Browse &amp; Enquire</h3>
            <p>Select your required steel product category, grade, size, and quantity. Call us or fill the enquiry form.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card" id="step2">
            <div className="step-number">02</div>
            <div className="step-icon">💬</div>
            <h3>Get Quotation</h3>
            <p>Receive competitive pricing with GST breakdown, mill test certificates and delivery timeline confirmation.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card" id="step3">
            <div className="step-number">03</div>
            <div className="step-icon">🚚</div>
            <h3>Confirm &amp; Dispatch</h3>
            <p>Place your order — our team confirms within 24 hours and dispatches to your location across India.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
