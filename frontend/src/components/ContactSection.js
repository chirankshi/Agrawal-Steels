'use client';
import { useState } from 'react';

const PRODUCTS_LIST = [
  'MS TMT Bars',
  'HR Plates & Coils',
  'MS Angles',
  'MS Channel',
  'MS Beam (I & H)',
  'MS Square & Round Pipes',
  'CR Coils & Slit Coils',
  'GP Coils & Sheets',
  'SS Sheets (202 & 304)',
  'Chequered Plate',
  'Rail Lines (New & Old)',
  'Multiple Products',
];

export default function ContactSection({ selectedProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: selectedProduct || '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Reset form after delay or leave success
    }, 600);
  };

  return (
    <section className="contact-section section" id="contact">
      <div className="container">
        <div className="section-header section-header-light">
          <div className="section-label label-gold">Get In Touch</div>
          <h2 className="section-title text-white">Request a <span className="text-accent">Quote</span></h2>
          <p className="section-desc text-gray">
            Send us your requirements and we'll get back to you within 24 hours with the best pricing.
          </p>
        </div>

        <div className="contact-grid" id="contactGrid">
          <div className="contact-form-wrap" id="contactFormWrap">
            {submitted ? (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  padding: '2.5rem',
                  borderRadius: '16px',
                  textAlign: 'center',
                  color: '#86efac',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Enquiry Received!</h3>
                <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Thank you, <strong>{formData.name || 'Valued Customer'}</strong>! Our team is reviewing your requirement for{' '}
                  <strong>{formData.product || 'Steel Products'}</strong> and will call you back within 24 hours at{' '}
                  <strong>{formData.phone}</strong>.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', product: '', message: '' });
                  }}
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactName">Full Name *</label>
                    <input
                      type="text"
                      id="contactName"
                      name="name"
                      placeholder="Your full name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactPhone">Phone Number *</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="phone"
                      placeholder="+91 XXXXX XXXXX"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contactEmail">Email Address</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactProduct">Product Required *</label>
                  <select
                    id="contactProduct"
                    name="product"
                    required
                    value={formData.product || selectedProduct || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select a product...</option>
                    {PRODUCTS_LIST.map((prod) => (
                      <option key={prod} value={prod}>{prod}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contactMessage">Requirements / Quantity</label>
                  <textarea
                    id="contactMessage"
                    name="message"
                    rows="4"
                    placeholder="Describe your requirements — size, grade, quantity, delivery location..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary btn-full" id="btnSubmitForm" disabled={loading}>
                  {loading ? 'Submitting...' : 'Send Enquiry →'}
                </button>
              </form>
            )}
          </div>

          <div className="contact-info-wrap" id="contactInfoWrap">
            <div className="contact-info-card" id="contactInfoCard">
              <h3>Contact Details</h3>
              <div className="contact-item" id="contactAddress">
                <div className="contact-item-icon">📍</div>
                <div>
                  <strong>Head Office</strong>
                  <p>Plot No. 680, Sector 59,<br />Faridabad, Haryana – 121004</p>
                </div>
              </div>
              <div className="contact-item" id="contactPhone2">
                <div className="contact-item-icon">📞</div>
                <div>
                  <strong>Phone</strong>
                  <p><a href="tel:+918800885185">+91 8800885185</a></p>
                </div>
              </div>
              <div className="contact-item" id="contactEmailInfo">
                <div className="contact-item-icon">✉️</div>
                <div>
                  <strong>Email</strong>
                  <p><a href="mailto:info@aggarwalsteels.com">info@aggarwalsteels.com</a></p>
                </div>
              </div>
              <div className="contact-item" id="contactHours">
                <div className="contact-item-icon">🕐</div>
                <div>
                  <strong>Business Hours</strong>
                  <p>Mon – Sat: 9:00 AM – 6:00 PM</p>
                </div>
              </div>
              <div className="gst-info" id="gstInfo">
                <span className="gst-badge">GST Reg.</span>
                <code>06AAFPA0415LI2G</code>
              </div>
            </div>

            <div className="whatsapp-card" id="whatsappCard">
              <div className="wa-icon">💬</div>
              <div>
                <strong>WhatsApp Us</strong>
                <p>Quick enquiries &amp; quotes on WhatsApp</p>
              </div>
              <a
                href="https://wa.me/918800885185?text=Hello%20Aggarwal%20Steels,%20I%20would%20like%20to%20get%20a%20quote%20for%20steel%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn"
                id="btnWhatsapp"
              >
                Chat Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
