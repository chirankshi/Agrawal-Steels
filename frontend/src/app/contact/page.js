'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ScrollAnimations from '../../components/ScrollAnimations';
import { submitEnquiry, buildEnquiryNotes } from '../../lib/enquiries';
import { useSiteSettings, telHref } from '../../lib/siteSettings';
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconShieldCheck,
  IconCheck,
  IconArrowRight
} from '../../components/Icons';

const PRODUCTS_LIST = [
  'HR Plates & Coils (IS 2062)',
  'CR Sheets & Precision Coils (IS 513)',
  'MS Chequered Plates & Tear Sheets',
  'MS Beams & Heavy Joists (ISMB / NPB)',
  'MS Channels (ISMC) & Angles',
  'Hollow Sections (SHS/RHS) & MS Pipes',
  'MS TMT Rebars (Fe 500D / 550D)',
  'Heavy Duty Warehouse Pallet Racks',
  'Drive-In & Double Deep High-Bay Racks',
  'Heavy-Duty Cantilever Racking Systems',
  'Multi-Tier Mezzanine Floor Systems',
  'Industrial Slotted Angle Shelving Units',
  '520ft Automated Powder Coating Services',
  'Commercial Stainless Steel Kitchen Equipment',
];

function ContactContent() {
  const { settings } = useSiteSettings();
  const searchParams = useSearchParams();
  const preSelectedProduct = searchParams.get('product') || '';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    product: preSelectedProduct,
    quantity: '',
    location: '',
    message: '',
  });

  useEffect(() => {
    if (preSelectedProduct) {
      setFormData(prev => ({ ...prev, product: preSelectedProduct }));
    }
  }, [preSelectedProduct]);

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
    const { ref } = await submitEnquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      product: formData.product,
      message: buildEnquiryNotes(formData),
      source: 'contact_page_rfq',
    });
    setEnquiryRef(ref);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="dedicated-page-container">
      {/* Page Hero */}
      <section className="dedicated-page-hero">
        <div className="section-container">
          <div className="dedicated-hero-badge">
            <IconMapPin size={14} />
            <span>DIRECT CONNECT • 4 UNITS ACROSS RAJASTHAN & HARYANA</span>
          </div>
          <h1 className="dedicated-hero-title">
            Request an Instant <span className="text-gradient">Tonnage &amp; Racking Quote</span>
          </h1>
          <p className="dedicated-hero-subtitle">
            Connect directly with our corporate sales desk and plant heads. 
            Receive mill-direct competitive pricing, Mill Test Certificates, and guaranteed dispatch schedules within 2 hours.
          </p>
        </div>
      </section>

      {/* Contact Grid Section */}
      <section className="contact-deep-section">
        <div className="section-container">
          <div className="contact-modern-grid">
            {/* Left Column: Office & Plant Addresses */}
            <div className="contact-info-col">
              <span className="section-tag">LOCATIONS &amp; REACH</span>
              <h2 className="section-title">Head Office &amp; Manufacturing Plants</h2>
              <p className="contact-lead-desc">
                We welcome client audits, third-party inspections, and warehouse site visits.
              </p>

              <div className="locations-directory">
                <div className="location-card">
                  <div className="location-header">
                    <IconMapPin size={20} className="loc-icon" />
                    <div>
                      <h4>Head Office &amp; Main Plant</h4>
                      <span className="loc-badge">Head Office &bull; Bhiwadi</span>
                    </div>
                  </div>
                  <p className="loc-address">
                    Block C, Plot No. E-372, RIICO Industrial Area, Bhiwadi – 301019, Rajasthan
                    <br /><strong>Facilities:</strong> 520ft Automated Powder Coating Line, Heavy CNC Press Brakes, Roll Forming Lines.
                  </p>
                </div>

                <div className="location-card">
                  <div className="location-header">
                    <IconMapPin size={20} className="loc-icon" />
                    <div>
                      <h4>Manufacturing Unit 02</h4>
                      <span className="loc-badge">Unit 02 &bull; Bhiwadi</span>
                    </div>
                  </div>
                  <p className="loc-address">
                    G1-385, RIICO Industrial Area, Bhiwadi – 301019, Rajasthan
                    <br /><strong>Facilities:</strong> Heavy Structural Fabrication, High-Capacity EOT Cranes, Primary Steel Stockyard.
                  </p>
                </div>

                <div className="location-card">
                  <div className="location-header">
                    <IconMapPin size={20} className="loc-icon" />
                    <div>
                      <h4>Majestic AR Technology – Unit 01</h4>
                      <span className="loc-badge">Unit 01 &bull; IMT Manesar</span>
                    </div>
                  </div>
                  <p className="loc-address">
                    89, Sector 3, IMT Manesar, Gurugram, Haryana
                    <br /><strong>Facilities:</strong> Precision Sheet Metal Components, Storage Racking Assembly, Trading Stockyard.
                  </p>
                </div>

                <div className="location-card">
                  <div className="location-header">
                    <IconMapPin size={20} className="loc-icon" />
                    <div>
                      <h4>Majestic AR Technology – Unit 03</h4>
                      <span className="loc-badge">Unit 03 &bull; Bawal</span>
                    </div>
                  </div>
                  <p className="loc-address">
                    81, Phase IV, Sector 15, Bawal, Haryana
                    <br /><strong>Facilities:</strong> Sheet Metal Fabrication, Material Handling Equipment, Trolleys &amp; Conveyors.
                  </p>
                </div>
              </div>

              {/* Quick Communication Box */}
              <div className="quick-reach-box">
                <div className="reach-row">
                  <IconPhone size={18} className="reach-icon" />
                  <div>
                    <span className="reach-lbl">Direct Sales Hotlines:</span>
                    <a href={telHref(settings.sales_phone)} className="reach-val">{settings.sales_phone}</a> / <a href={telHref(settings.alternate_phone)} className="reach-val">{settings.alternate_phone}</a>
                  </div>
                </div>

                <div className="reach-row">
                  <IconMail size={18} className="reach-icon" />
                  <div>
                    <span className="reach-lbl">Official Email Inquiries:</span>
                    <a href={`mailto:${settings.md_email}`} className="reach-val">{settings.md_email}</a> / <a href={`mailto:${settings.sales_email}`} className="reach-val">{settings.sales_email}</a>
                  </div>
                </div>

                <div className="reach-row">
                  <IconShieldCheck size={18} className="reach-icon" />
                  <div>
                    <span className="reach-lbl">Quality &amp; Compliance Desk:</span>
                    <span className="reach-val">ISO 9001:2015 &amp; MTC Verification Cell</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive RFQ Form */}
            <div className="contact-form-col" id="quote">
              <div className="rfq-form-card">
                <div className="rfq-card-header">
                  <span className="rfq-tag">OFFICIAL B2B QUOTATION DESK</span>
                  <h3>Submit Request for Quotation (RFQ)</h3>
                  <p>Guaranteed response with pricing &amp; MTC specs within 2 business hours.</p>
                </div>

                {submitted ? (
                  <div className="rfq-success-box">
                    <div className="success-icon-wrap">
                      <IconCheck size={36} />
                    </div>
                    <h3>Quotation Request Dispatched!</h3>
                    <p>
                      Thank you, <strong>{formData.name}</strong>. Your inquiry has been routed to our senior technical sales engineer.
                    </p>
                    <div className="reference-code-box">
                      <span>Inquiry Reference ID:</span>
                      <strong>{enquiryRef}</strong>
                    </div>
                    <p className="dispatch-note">
                      A copy has been recorded. Our team will contact you at <strong>{formData.phone}</strong> shortly.
                    </p>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ marginTop: '1.5rem', width: '100%' }}
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '', company: '', phone: '', email: '',
                          product: '', quantity: '', location: '', message: ''
                        });
                      }}
                    >
                      Submit Another Requirement
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="rfq-form">
                    <div className="form-fields-grid">
                      <div className="form-field-group">
                        <label>Your Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Rajesh Kumar"
                          className="rfq-input"
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Company / Enterprise Name</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="e.g. Apex Infra Pvt Ltd"
                          className="rfq-input"
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Mobile / WhatsApp Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="rfq-input"
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Official Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="rajesh@company.com"
                          className="rfq-input"
                        />
                      </div>
                    </div>

                    <div className="form-field-group" style={{ marginTop: '1rem' }}>
                      <label>Required Product Category *</label>
                      <select
                        name="product"
                        required
                        value={formData.product}
                        onChange={handleChange}
                        className="rfq-input rfq-select"
                      >
                        <option value="">Select Steel Grade or Storage System...</option>
                        {PRODUCTS_LIST.map((prod, idx) => (
                          <option key={idx} value={prod}>{prod}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-fields-grid" style={{ marginTop: '1rem' }}>
                      <div className="form-field-group">
                        <label>Estimated Tonnage / Quantity</label>
                        <input
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="e.g. 25 Metric Tonnes / 500 Bays"
                          className="rfq-input"
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Delivery City &amp; State</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. Manesar, Haryana"
                          className="rfq-input"
                        />
                      </div>
                    </div>

                    <div className="form-field-group" style={{ marginTop: '1rem' }}>
                      <label>Technical Specifications / Custom Dimensions</label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Specify thickness, length, IS standard, or warehouse clear height..."
                        className="rfq-input rfq-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary rfq-submit-btn"
                    >
                      {loading ? 'Transmitting RFQ...' : 'Submit Quotation Request'}
                      <IconArrowRight size={16} />
                    </button>

                    <p className="form-privacy-note">
                      🔒 Your commercial requirements are treated under strict confidentiality. We never share RFQ data with unauthorized third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <>
      <ScrollAnimations />
      <Navbar />
      <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>Loading Contact Desk...</div>}>
        <ContactContent />
      </Suspense>
      <Footer />
      <ScrollToTop />
    </>
  );
}
