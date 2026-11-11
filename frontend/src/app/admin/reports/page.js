'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';

export default function AdminReportsPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eData, oData, pData] = await Promise.all([
          adminApi.getEnquiries(),
          adminApi.getOrders(),
          adminApi.getProducts(),
        ]);
        setEnquiries(eData);
        setOrders(oData);
        setProducts(pData);
      } catch (err) {
        console.error('Error fetching report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalTonnage = orders.reduce((sum, o) => sum + (Number(o.quantity_metric_tons) || 0), 0);

  const handleExportEnquiries = () => {
    adminApi.exportCsv('aggarwal_steels_enquiries_master', enquiries);
  };

  const handleExportOrders = () => {
    adminApi.exportCsv('aggarwal_steels_orders_master', orders);
  };

  const handleExportProducts = () => {
    adminApi.exportCsv('aggarwal_steels_products_catalog', products);
  };

  const handleBackupJson = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      plant: 'Aggarwal Steels & Majestic AR Technology',
      enquiries,
      orders,
      products,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aggarwal_steels_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">
              Executive Analytics &amp; Data Export Center
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              Generate structured CSV reports for accounting, plant dispatch registers, and client records
            </p>
          </div>
        </div>

        <div style={{ padding: '1.75rem' }}>
          {/* Export Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {/* Card 1: Enquiries */}
            <div
              style={{
                background: '#0a0f1d',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>Quotation Enquiries Register</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                  Complete record of customer RFQs, requested tonnage, phone numbers, email addresses, and status history.
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <strong>{enquiries.length}</strong> total records logged
                </div>
              </div>

              <button
                type="button"
                className="btn-primary-adm"
                onClick={handleExportEnquiries}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Download Enquiries CSV &darr;
              </button>
            </div>

            {/* Card 2: Orders & Dispatches */}
            <div
              style={{
                background: '#0a0f1d',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                    <path d="M15 18H9" />
                    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                    <circle cx="17" cy="18.5" r="2.5" />
                    <circle cx="6.5" cy="18.5" r="2.5" />
                  </svg>
                  <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>Dispatch &amp; Shipment Register</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                  Mill dispatch logs with tracking numbers, assigned transport vehicles, tonnage breakdown, and destination sites.
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <strong>{orders.length}</strong> orders ({totalTonnage.toFixed(1)} MT total)
                </div>
              </div>

              <button
                type="button"
                className="btn-primary-adm"
                onClick={handleExportOrders}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Download Dispatches CSV &darr;
              </button>
            </div>

            {/* Card 3: Steel Inventory */}
            <div
              style={{
                background: '#0a0f1d',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                  <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>Product Inventory Catalog</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                  Steel grades, dimensional specs, mill supplier tags (SAIL, TATA, JSPL), and estimated pricing matrix.
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <strong>{products.length}</strong> steel items listed
                </div>
              </div>

              <button
                type="button"
                className="btn-primary-adm"
                onClick={handleExportProducts}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Download Catalog CSV &darr;
              </button>
            </div>
          </div>

          {/* Backup Action Bar */}
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <strong style={{ color: '#f8fafc', display: 'block', fontSize: '0.95rem' }}>
                Full System State Backup (JSON)
              </strong>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                Includes all inquiries, active dispatches, and catalog specs in a single unified JSON archive.
              </p>
            </div>

            <button
              type="button"
              className="btn-secondary-adm"
              onClick={handleBackupJson}
            >
              Export Complete Backup (.json)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

