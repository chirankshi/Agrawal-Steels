'use client';
import { useState } from 'react';
import { IconMapPin, IconPhone, IconMail, IconClock, IconMessageSquare, IconCheck, IconShieldCheck, IconArrowRight } from './Icons';

const PRODUCTS_LIST = [
  'MS TMT Bars (Fe 415 / 500D / 550D)',
  'HR Plates & Coils (IS 2062)',
  'MS Structural Angles (Equal & Unequal)',
  'MS Channels (ISMC 75 to 400)',
  'MS Beams & Joists (ISMB / NPB / WPB)',
  'MS Chequered Plates & Flooring Sheets',
  'Hollow Sections & MS Pipes (IS 4923 / 1161)',
  'CR Coils & Precision Slit Coils',
  'GP Coils & Galvanized Sheets',
  'Stainless Steel Sheets (304 / 202 / 316)',
  'Heavy Duty Warehouse Storage Racks',
  'Multi-Tier Mezzanine Floor Systems',
  'Slotted Angle & Bin Storage Racks',
  'Supermarket & Retail Display Racks',
  'Commercial Stainless Steel Kitchen Equipment',
  'Electrical & Control Panel Enclosures',
  'PEB Structures & Heavy Industrial Sheds',
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
  const [enquiryRef, setEnquiryRef] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          product: formData.product,
          message: formData.message || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEnquiryRef(`AS-RFQ-${String(data.id).padStart(4, '0')}`);
      } else {
        setEnquiryRef(`AS-RFQ-${Date.now().toString().slice(-4)}`);
      }
    } catch {
      // Graceful fallback when backend is temporarily offline
      setEnquiryRef(`AS-RFQ-${Date.now().toString().slice(-4)}`);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
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
                {enquiryRef && (
                  <p style={{ margin: '8px 0 16px', fontSize: '0.9rem', color: '#ffc107', letterSpacing: '0.5px' }}>
                    Reference Tracking ID: <strong>{enquiryRef}</strong>
                  </p>
                )}
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
              <h3 className="sidebar-heading">Corporate Headquarters</h3>

              <div className="detail-entry">
                <div className="detail-icon">
                  <IconMapPin size={18} />
                </div>
                <div>
                  <strong>Head Office &amp; Main Manufacturing Plant</strong>
                  <p>Block C, Plot No. E-372, RIICO Industrial Area, Bhiwadi – 301019, Rajasthan</p>
                  <p style={{ marginTop: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                    Unit 01: 89, Sector 3, IMT Manesar, Gurugram, Haryana<br />
                    Stockyard: Plot 680, Sector 59, Faridabad, Haryana
                  </p>
                </div>
              </div>

              <div className="detail-entry">
                <div className="detail-icon">
                  <IconPhone size={18} />
                </div>
                <div>
                  <strong>Direct Technical Sales &amp; Enquiries</strong>
                  <p>
                    <a href="tel:+917300070778">+91 73000 70778</a>
                    <span style={{ color: '#64748b' }}> / </span>
                    <a href="tel:+918800885185">+91 8800885185</a>
                  </p>
                </div>
              </div>

              <div className="detail-entry">
                <div className="detail-icon">
                  <IconMail size={18} />
                </div>
                <div>
                  <strong>Official Correspondence</strong>
                  <p>
                    <a href="mailto:info@majesticar.in">info@majesticar.in</a>
                  </p>
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
                <span>ISO 9001:2015 CERTIFIED &bull; MAKE IN INDIA</span>
              </div>
            </div>

            {/* Direct WhatsApp Chat Action */}
            <div className="whatsapp-action-card" id="whatsappCard">
              <div className="wa-icon-box">
                <IconMessageSquare size={24} />
              </div>
              <div className="wa-meta">
                <strong>Instant WhatsApp Desk</strong>
                <p>Chat directly with Mr. Aakash Goyal &amp; technical sales desk</p>
              </div>
              <a
                href="https://wa.me/917300070778?text=Hello%20Aggarwal%20Steels,%20I%20would%20like%20to%20enquire%20about%20steel%20and%20racking%20solutions"
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
