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
    const { ok, storage, error } = await saveSiteSettings(settings);
    if (ok) setSource(storage);
    setNotice(ok ? 'Saved. The website now shows these values.' : error || 'Not saved. Please try again.');
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
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
              Phone numbers, emails, company figures and addresses shown across the website.
            </p>
          </div>
          <span className={`status-badge ${source === 'supabase' || source === 'api' ? 'badge-closed' : 'badge-pending'}`} title={SOURCE_LABEL[source]}>
            {SOURCE_LABEL[source]}
          </span>
        </div>

        <form onSubmit={handleSave}>
          <div className="settings-grid">
            {notice && (
              <div className="span-2" style={{ background: notice.startsWith('Saved.') ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: notice.startsWith('Saved.') ? 'var(--adm-emerald)' : 'var(--adm-amber)', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600 }}>
                {notice}
              </div>
            )}

            {SETTING_FIELDS.map((f) =>
              f.section ? (
                <h4 key={f.section} className="span-2 settings-section-title">{f.section}</h4>
              ) : f.type === 'checkbox' ? (
                <label key={f.key} className="span-2" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: 'var(--adm-text-main)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={Boolean(settings[f.key])} onChange={(e) => set(f.key, e.target.checked)} style={{ width: 18, height: 18 }} />
                  {f.label}
                </label>
              ) : (
                <div className={`form-group-adm ${f.wide ? 'span-2' : ''}`} key={f.key}>
                  <label>{f.label}</label>
                  <input type={f.type} value={settings[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
                </div>
              )
            )}

            <div className="span-2" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
              <button type="submit" className="btn-primary-adm" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
              <button type="button" className="btn-secondary-adm" onClick={handleReset}>Restore Defaults</button>
            </div>
            <p className="span-2" style={{ fontSize: '0.72rem', color: 'var(--adm-text-dim)', margin: 0 }}>
              Where these appear: footer, contact page, home contact section, Instant Quote popup, Manufacturing page call button, and the figures in the home page hero and About page.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
