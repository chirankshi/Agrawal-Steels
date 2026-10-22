'use client';
import { useState } from 'react';
import { IconMapPin, IconPhone, IconMail, IconClock, IconMessageSquare, IconCheck, IconShieldCheck, IconArrowRight } from './Icons';

const PRODUCTS_LIST = [
  'MS TMT Bars (Fe 500D / 550D)',
  'HR Plates & Coils (IS 2062)',
  'MS Structural Angles',
  'MS Channels (ISMC)',
  'MS Beams (ISMB / Joists)',
  'Hollow Sections & MS Pipes',
  'CR Coils & Precision Slit',
  'GP Coils & Galvanized Sheets',
  'Stainless Steel Sheets (304 / 202)',
  'Custom CNC Bending & Fabrication',
  'Heavy-Duty Storage Racking',
  'Multiple Steel Categories',
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
    }, 600);
  };

  return (
    <section className="section contact-modern-section" id="contact">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-amber">
            <IconMessageSquare size={15} /> DIRECT ENQUIRY
          </div>
          <h2 className="section-title text-white">
            Request an <span className="text-gradient">Instant Quotation</span>
          </h2>
          <p className="section-desc text-gray">
            Share your requirements and receiving site details. Our technical sales desk will furnish a formal quotation within 24 business hours.
          </p>
        </div>

        <div className="contact-modern-grid" id="contactGrid">
          {/* Left Column: Interactive Form */}
          <div className="contact-form-container" id="contactFormWrap">
            {submitted ? (
              <div className="contact-success-box">
                <div className="success-icon-wrap">
                  <IconCheck size={36} />
                </div>
                <h3 className="success-title">Enquiry Successfully Logged</h3>
                <p className="success-message">
                  Thank you, <strong>{formData.name || 'Valued Client'}</strong>! Your procurement request for{' '}
                  <strong>{formData.product || 'Steel Products'}</strong> has been assigned to our Faridabad sales desk. Our executive will call you shortly at{' '}
                  <strong>{formData.phone}</strong> with pricing and delivery terms.
                </p>
                <button
                  type="button"
                  className="btn-modern-primary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', product: '', message: '' });
                  }}
                >
                  <span>Submit Another Requirement</span>
                  <IconArrowRight size={16} />
                </button>
              </div>
            ) : (
              <form className="contact-modern-form" id="contactForm" onSubmit={handleSubmit}>
                <div className="form-fields-grid">
                  <div className="modern-field">
                    <label htmlFor="contactName">Full Name / Company Name *</label>
                    <input
                      type="text"
                      id="contactName"
                      name="name"
                      placeholder="e.g. Ramesh Kumar / Infra Corp"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="modern-field">
                    <label htmlFor="contactPhone">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="phone"
                      placeholder="+91 98765 43210"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="modern-field">
                  <label htmlFor="contactEmail">Work Email Address</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="email"
                    placeholder="procurement@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="modern-field">
                  <label htmlFor="contactProduct">Primary Steel Product *</label>
                  <select
                    id="contactProduct"
                    name="product"
                    required
                    value={formData.product || selectedProduct || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select product category...</option>
                    {PRODUCTS_LIST.map((prod) => (
                      <option key={prod} value={prod}>{prod}</option>
                    ))}
                  </select>
                </div>

                <div className="modern-field">
                  <label htmlFor="contactMessage">Quantity, Size Specifications &amp; Delivery Destination</label>
                  <textarea
                    id="contactMessage"
                    name="message"
                    rows="4"
                    placeholder="Specify tonnage, size, grade (e.g. 50 MT Fe 550D TMT, 16mm & 20mm to Greater Noida site)..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-submit-modern"
                  id="btnSubmitForm"
                  disabled={loading}
                >
                  <span>{loading ? 'Processing...' : 'Send Quotation Request'}</span>
                  <IconArrowRight size={18} />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Corporate Contacts */}
          <div className="contact-sidebar" id="contactInfoWrap">
            <div className="corporate-details-card" id="contactInfoCard">
              <h3 className="sidebar-heading">Corporate Office</h3>

              <div className="detail-entry">
                <div className="detail-icon">
                  <IconMapPin size={18} />
                </div>
                <div>
                  <strong>Registered Address &amp; Stockyard</strong>
                  <p>Plot No. 680, Sector 59, Faridabad, Haryana – 121004, India</p>
                </div>
              </div>

              <div className="detail-entry">
                <div className="detail-icon">
                  <IconPhone size={18} />
                </div>
                <div>
                  <strong>Sales Desk &amp; Direct Enquiries</strong>
                  <p><a href="tel:+918800885185">+91 8800885185</a></p>
                </div>
              </div>

              <div className="detail-entry">
                <div className="detail-icon">
                  <IconMail size={18} />
                </div>
                <div>
                  <strong>Official Correspondence</strong>
                  <p><a href="mailto:info@aggarwalsteels.com">info@aggarwalsteels.com</a></p>
                </div>
              </div>

              <div className="detail-entry">
                <div className="detail-icon">
                  <IconClock size={18} />
                </div>
                <div>
                  <strong>Commercial Working Hours</strong>
                  <p>Monday – Saturday: 09:00 AM – 06:00 PM IST</p>
                </div>
              </div>

              <div className="gst-compliance-badge">
                <IconShieldCheck size={16} />
                <span>GST REGISTRATION: <code>06AAFPA0415LI2G</code></span>
              </div>
            </div>

            {/* Direct WhatsApp Chat Action */}
            <div className="whatsapp-action-card" id="whatsappCard">
              <div className="wa-icon-box">
                <IconMessageSquare size={24} />
              </div>
              <div className="wa-meta">
                <strong>Instant WhatsApp Desk</strong>
                <p>Chat directly with technical sales for real-time mill rates</p>
              </div>
              <a
                href="https://wa.me/918800885185?text=Hello%20Aggarwal%20Steels,%20I%20would%20like%20to%20enquire%20about%20steel%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="wa-action-btn"
                id="btnWhatsapp"
              >
                <span>Chat Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
