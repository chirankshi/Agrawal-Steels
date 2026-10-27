'use client';
import { useState } from 'react';
import { IconShieldCheck, IconAward, IconDownload, IconArrowRight, IconCheck, IconLayers } from './Icons';

export default function Certificates() {
  const [activeModalCert, setActiveModalCert] = useState(null);

  const certs = [
    {
      id: 'iso-9001',
      code: 'ISO 9001:2015',
      name: 'Quality Management System',
      category: 'Quality Excellence & Traceability',
      certNo: '50OAUTCU20261026INDQM15T',
      body: 'TNV Certification / IAF Accredited',
      validity: 'Valid: 26/10/2026 – 25/10/2029',
      scope: 'Manufacturing & fabrication of MS/SS sheet metal components, laser cutting, sheet bending, powder coating, heavy structural steel fabrication, PEB, EOT cranes, and warehouse storage systems.',
      previewImg: '/certificates/iso_9001_preview.jpg',
      pdfUrl: '/certificates/aggarwal_steels_iso_9001.pdf',
      color: '#feb302',
    },
    {
      id: 'iso-14001',
      code: 'ISO 14001:2015',
      name: 'Environmental Management System',
      category: 'Sustainable Green Manufacturing',
      certNo: '50OAUTCU20261026INDEV1Y0',
      body: 'TNV Certification / IAF Accredited',
      validity: 'Valid: 26/10/2026 – 25/10/2029',
      scope: 'Eco-conscious manufacturing practices, emissions-controlled 520ft powder coating operations, industrial waste recycling, and energy-efficient sheet metal processing.',
      previewImg: '/certificates/iso_14001_preview.jpg',
      pdfUrl: '/certificates/aggarwal_steels_iso_14001.pdf',
      color: '#10b981',
    },
    {
      id: 'iso-45001',
      code: 'ISO 45001:2018',
      name: 'Occupational Health & Safety',
      category: 'Workplace Safety & Hazard Control',
      certNo: '50OAUTCU20261026INDOH18J',
      body: 'TNV Certification / IAF Accredited',
      validity: 'Valid: 26/10/2026 – 25/10/2029',
      scope: 'Zero-harm workshop culture, operator protection across heavy CNC press brakes, overhead EOT cranes, robotic welding booths, and strict plant safety protocols.',
      previewImg: '/certificates/iso_45001_preview.jpg',
      pdfUrl: '/certificates/aggarwal_steels_iso_45001.pdf',
      color: '#38bdf8',
    },
    {
      id: 'iso-3834',
      code: 'ISO 3834-2:2021',
      name: 'Fusion Welding of Metallic Materials',
      category: 'Comprehensive Quality Requirements',
      certNo: '50OAUTVC20261026INDFW1I4',
      body: 'TNV Certification / Verified Standards',
      validity: 'Valid: 26/10/2026 – 25/10/2029',
      scope: 'Manufacturing of heavy PEB structures, structural fabrication, engineering products, storage racking, and tubes/plates through certified fusion welding procedures.',
      previewImg: '/certificates/iso_3834_preview.jpg',
      pdfUrl: '/certificates/aggarwal_steels_iso_3834.pdf',
      color: '#f97316',
    },
  ];

  return (
    <section className="section certificates-modern-section" id="certifications">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-amber">
            <IconShieldCheck size={15} /> ACCREDITED STANDARDS &bull; TNV CERTIFIED
          </div>
          <h2 className="section-title text-white">
            Certified Excellence: <span className="text-gradient">International Standards</span>
          </h2>
          <p className="section-desc text-gray">
            Aggarwal Steels and manufacturing subsidiary Majestic AR Technology operate under internationally audited ISO certifications, ensuring uncompromising quality, environmental compliance, and welder precision.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="cert-cards-grid">
          {certs.map((c) => (
            <div className="cert-compact-card" key={c.id} id={c.id}>
              {/* Certificate Preview Image */}
              <div
                className="cert-card-preview"
                onClick={() => setActiveModalCert(c)}
                title={`Click to inspect ${c.code}`}
              >
                <img
                  src={c.previewImg}
                  alt={`${c.code} - ${c.name} Certificate for Aggarwal Steels`}
                  className="cert-img-thumb"
                  loading="lazy"
                />
                <div className="cert-preview-overlay">
                  <span className="cert-inspect-badge">
                    <IconLayers size={14} /> Click to Inspect
                  </span>
                </div>
                <span className="cert-code-pill" style={{ borderColor: c.color }}>
                  {c.code}
                </span>
              </div>

              {/* Certificate Content */}
              <div className="cert-card-body">
                <div className="cert-meta-row">
                  <span className="cert-badge-body">{c.body}</span>
                  <span className="cert-valid-tag">{c.validity}</span>
                </div>

                <h3 className="cert-card-title">{c.name}</h3>
                <p className="cert-card-category">{c.category}</p>

                <p className="cert-card-scope" title={c.scope}>
                  {c.scope}
                </p>

                <div className="cert-card-footer">
                  <div className="cert-no-box">
                    <span className="cert-no-label">Certificate No:</span>
                    <code className="cert-no-val">{c.certNo}</code>
                  </div>

                  <div className="cert-actions-btns">
                    <button
                      type="button"
                      className="btn-cert-preview"
                      onClick={() => setActiveModalCert(c)}
                    >
                      <span>Preview</span>
                    </button>
                    <a
                      href={c.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cert-download"
                      title="Open Official PDF Certificate"
                    >
                      <IconDownload size={14} />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Footnote Banner */}
        <div className="cert-trust-banner">
          <div className="cert-trust-content">
            <span className="cert-trust-tag">AUDITED &amp; REGISTERED CREDENTIALS</span>
            <p className="cert-trust-text">
              All 4 certificates are formally registered for <strong>Aggarwal Steels</strong> (Plot No. E-372, G1-385, RIICO Industrial Area, Bhiwadi, Alwar-301019, Rajasthan) with 100% Mill Test Certificate (MTC) and heat-number traceability on every batch.
            </p>
          </div>
          <a
            href="#contact"
            className="btn-modern-outline"
            style={{ flexShrink: 0 }}
          >
            <span>Request Compliance Packet</span>
            <IconArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* High-Resolution Certificate Inspection Modal */}
      {activeModalCert && (
        <div
          className="cert-modal-backdrop"
          onClick={() => setActiveModalCert(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="cert-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-modal-header">
              <div>
                <span className="cert-modal-code">{activeModalCert.code}</span>
                <h3 className="cert-modal-title">{activeModalCert.name}</h3>
                <span className="cert-modal-meta">
                  Certificate No: <strong>{activeModalCert.certNo}</strong> &bull; {activeModalCert.validity}
                </span>
              </div>
              <div className="cert-modal-actions">
                <a
                  href={activeModalCert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-modern-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <IconDownload size={15} />
                  <span>Download PDF</span>
                </a>
                <button
                  type="button"
                  className="cert-modal-close"
                  onClick={() => setActiveModalCert(null)}
                  aria-label="Close Certificate Modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="cert-modal-body">
              <img
                src={activeModalCert.previewImg}
                alt={`${activeModalCert.code} Full Certificate`}
                className="cert-modal-img"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
