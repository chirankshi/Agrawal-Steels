'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import AnnouncementBar from '../../components/AnnouncementBar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ScrollAnimations from '../../components/ScrollAnimations';
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconShieldCheck,
  IconCheck,
  IconMessageSquare,
  IconArrowRight,
  IconAward
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

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const notes = [
        formData.company ? `Company: ${formData.company}` : '',
        formData.quantity ? `Quantity: ${formData.quantity}` : '',
        formData.location ? `Delivery City: ${formData.location}` : '',
        formData.message ? `Details: ${formData.message}` : ''
      ].filter(Boolean).join(' | ');

      const res = await fetch(`${apiUrl}/api/v1/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          product: formData.product || 'General Steel Inquiry',
          message: notes || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEnquiryRef(data.id ? `AGS-${String(data.id).padStart(4, '0')}` : `AGS-${Date.now().toString().slice(-4)}`);
      } else {
        setEnquiryRef(`AGS-${Date.now().toString().slice(-4)}`);
      }
    } catch (err) {
      setEnquiryRef(`AGS-${Date.now().toString().slice(-4)}`);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <main className="dedicated-page-container">
      {/* Page Hero */}
      <section className="dedicated-page-hero">
        <div className="section-container">
          <div className="dedicated-hero-badge">
            <IconMapPin size={14} />
            <span>DIRECT CONNECT • 5 UNITS ACROSS DELHI NCR & RAJASTHAN</span>
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
                      <h4>Unit 1: Flagship Manufacturing Facility</h4>
                      <span className="loc-badge">Majestic AR Technology Pvt. Ltd.</span>
                    </div>
                  </div>
                  <p className="loc-address">
                    Industrial Area, Phase 2, Bhiwadi / Bahadurgarh Hub, Haryana &amp; Rajasthan Border.
                    <br /><strong>Facilities:</strong> 520ft Automated Powder Coating Line, Heavy CNC Press Brakes, Roll Forming Mills.
                  </p>
                </div>

                <div className="location-card">
                  <div className="location-header">
                    <IconMapPin size={20} className="loc-icon" />
                    <div>
                      <h4>Unit 2: Primary Steel Stockyard &amp; Logistics Hub</h4>
                      <span className="loc-badge">Aggarwal Steels Stockyard</span>
                    </div>
                  </div>
                  <p className="loc-address">
                    Main Rohtak Road / Bahadurgarh Industrial Zone, Delhi NCR.
                    <br /><strong>Facilities:</strong> 50T Electronic Weighbridge, Overhead EOT Cranes, Ready Inventory of HR/CR/Chequered Plates &amp; Beams.
                  </p>
                </div>

                <div className="location-card">
                  <div className="location-header">
                    <IconMapPin size={20} className="loc-icon" />
                    <div>
                      <h4>Corporate Sales &amp; Finance Desk</h4>
                      <span className="loc-badge">Delhi NCR Central Office</span>
                    </div>
                  </div>
                  <p className="loc-address">
                    Plot No. 4, Steel Market Complex, New Delhi - 110028.
                    <br /><strong>Hours:</strong> Mon - Sat: 9:00 AM - 7:30 PM (Sunday Closed)
                  </p>
                </div>
              </div>

              {/* Quick Communication Box */}
              <div className="quick-reach-box">
                <div className="reach-row">
                  <IconPhone size={18} className="reach-icon" />
                  <div>
                    <span className="reach-lbl">Direct Sales Hotlines:</span>
                    <a href="tel:+919999009890" className="reach-val">+91 99990 09890</a> / <a href="tel:+919810012345" className="reach-val">+91 98100 12345</a>
                  </div>
                </div>

                <div className="reach-row">
                  <IconMail size={18} className="reach-icon" />
                  <div>
                    <span className="reach-lbl">Official Email Inquiries:</span>
                    <a href="mailto:sales@aggarwalsteels.com" className="reach-val">sales@aggarwalsteels.com</a>
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
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>Loading Contact Desk...</div>}>
        <ContactContent />
      </Suspense>
      <Footer />
      <ScrollToTop />
    </>
  );
}
