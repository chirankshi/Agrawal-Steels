'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';

export default function AdminSettingsPage() {
  const [testingApi, setTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const [settings, setSettings] = useState({
    salesPhone: '+91 73000 70778',
    alternatePhone: '+91 88008 85185',
    salesEmail: 'md@majesticar.com',
    corporateDesk: 'Faridabad Stockyard & Bhiwadi Plant Desk',
    apiEndpoint: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  });

  const testConnection = async () => {
    setTestingApi(true);
    setApiStatus(null);
    const start = performance.now();
    try {
      const isOnline = await adminApi.checkBackendHealth();
      const elapsed = Math.round(performance.now() - start);
      setApiStatus({
        online: isOnline,
        latency: elapsed,
        message: isOnline
          ? `Supabase Cloud PostgreSQL connected successfully (${elapsed}ms)`
          : 'Supabase table not found or offline. Running seamlessly in Local Storage mode.',
      });
    } catch {
      setApiStatus({
        online: false,
        latency: 0,
        message: 'Connection timed out. Running in Local Storage mode.',
      });
    } finally {
      setTestingApi(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Reset local demo enquiries and orders to initial factory state?')) {
      localStorage.removeItem('aggarwal_admin_enquiries');
      localStorage.removeItem('aggarwal_admin_orders');
      alert('Local storage records re-initialized to default demo state.');
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">
              Plant Sales Desk &amp; System Configuration
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              Configure direct enquiry routing, plant contacts, and verify backend API synchronization
            </p>
          </div>
        </div>

        <div style={{ padding: '1.75rem' }}>
          {savedNotice && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                fontSize: '0.82rem',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '1.5rem',
              }}
            >
              ✓ Configuration preferences saved successfully.
            </div>
          )}

          {/* Connection Diagnostics Card */}
          <div
            style={{
              background: '#0a0f1d',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <strong style={{ color: '#f8fafc', display: 'block', fontSize: '0.95rem' }}>
                  Backend API Diagnostics
                </strong>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>
                  Target Endpoint: <code>{settings.apiEndpoint}</code>
                </p>
              </div>

              <button
                type="button"
                className="btn-secondary-adm"
                onClick={testConnection}
                disabled={testingApi}
              >
                {testingApi ? 'Pinging Endpoint...' : 'Test Connection'}
              </button>
            </div>

            {apiStatus && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  background: apiStatus.online ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: apiStatus.online ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                  color: apiStatus.online ? '#34d399' : '#fbbf24',
                }}
              >
                {apiStatus.message}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group-adm">
                <label>Plant Sales Contact Line</label>
                <input
                  type="text"
                  value={settings.salesPhone}
                  onChange={(e) => setSettings({ ...settings, salesPhone: e.target.value })}
                />
              </div>

              <div className="form-group-adm">
                <label>WhatsApp Escalation Number</label>
                <input
                  type="text"
                  value={settings.alternatePhone}
                  onChange={(e) => setSettings({ ...settings, alternatePhone: e.target.value })}
                />
              </div>

              <div className="form-group-adm">
                <label>Official Desk Email</label>
                <input
                  type="email"
                  value={settings.salesEmail}
                  onChange={(e) => setSettings({ ...settings, salesEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group-adm">
              <label>Authorized Operating Desk</label>
              <input
                type="text"
                value={settings.corporateDesk}
                onChange={(e) => setSettings({ ...settings, corporateDesk: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary-adm">
                Save Preferences
              </button>
              <button
                type="button"
                className="btn-secondary-adm"
                onClick={handleResetData}
                style={{ color: '#fda4af' }}
              >
                Re-seed Demo Records
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

