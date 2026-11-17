'use client';
import { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS, SETTING_FIELDS, loadSiteSettings, saveSiteSettings } from '../../../lib/siteSettings';

const SOURCE_LABEL = {
  supabase: 'Saved in Supabase (live for every visitor)',
  api: 'Saved on the API server (live while the backend runs)',
  local: 'Saved in this browser only',
  defaults: 'Built-in defaults (nothing saved yet)',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [source, setSource] = useState('defaults');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    loadSiteSettings({ fresh: true }).then((r) => { setSettings(r.settings); setSource(r.source); });
  }, []);

  const set = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    const { storage } = await saveSiteSettings(settings);
    setSource(storage);
    setNotice(
      storage === 'local'
        ? 'Saved in this browser only. No database was reachable, so other visitors will still see the previous values.'
        : 'Saved. The website now shows these values.'
    );
    setSaving(false);
    setTimeout(() => setNotice(''), 6000);
  };

  const handleReset = () => {
    if (confirm('Restore the built-in default values? You still need to press Save.')) setSettings({ ...DEFAULT_SETTINGS });
  };

  return (
    <div>
      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">Site Settings</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              Announcement bar, phone numbers, emails and working hours shown across the website.
            </p>
          </div>
          <span className={`status-badge ${source === 'supabase' || source === 'api' ? 'badge-closed' : 'badge-pending'}`} title={SOURCE_LABEL[source]}>
            {SOURCE_LABEL[source]}
          </span>
        </div>

        <form onSubmit={handleSave}>
          <div className="settings-grid">
            {notice && (
              <div className="span-2" style={{ background: notice.startsWith('Saved.') ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: notice.startsWith('Saved.') ? '#10b981' : '#fbbf24', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600 }}>
                {notice}
              </div>
            )}

            {SETTING_FIELDS.map((f) =>
              f.type === 'checkbox' ? (
                <label key={f.key} className="span-2" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#f8fafc', cursor: 'pointer' }}>
                  <input type="checkbox" checked={Boolean(settings[f.key])} onChange={(e) => set(f.key, e.target.checked)} style={{ width: 18, height: 18 }} />
                  {f.label}
                </label>
              ) : (
                <div className={`form-group-adm ${f.key === 'announcement_text' ? 'span-2' : ''}`} key={f.key}>
                  <label>{f.label}</label>
                  <input type={f.type} value={settings[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
                </div>
              )
            )}

            <div className="span-2" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
              <button type="submit" className="btn-primary-adm" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
              <button type="button" className="btn-secondary-adm" onClick={handleReset}>Restore Defaults</button>
            </div>
            <p className="span-2" style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
              Where these appear: announcement bar (top of every page), footer, home contact section, contact page, and the Instant Quote popup.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
