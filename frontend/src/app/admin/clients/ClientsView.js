'use client';
import { useEffect, useRef, useState } from 'react';
import { loadSiteSettings, saveSiteSettings } from '../../../lib/siteSettings';
import { uploadProductImage } from '../../../lib/productsApi';
import { slugify } from '../../../data/catalogue';
import { CLIENTS } from '../../../data/clients';
import { FilterCards } from '../_components/AdminWidgets';

const EMPTY = { name: '', logo: '', category: '', project: '', is_active: true };

/** Clients shown in the home page logo strip (first 8 with a logo) and on the Clients page. */
export default function ClientsView() {
  const [settings, setSettings] = useState(null);
  const [rows, setRows] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(null);
  const [view, setView] = useState('all');
  const fileRefs = useRef({});

  useEffect(() => {
    loadSiteSettings({ fresh: true }).then(({ settings: s }) => {
      setSettings(s);
      const list = Array.isArray(s.clients) && s.clients.length ? s.clients : CLIENTS;
      setRows(list.map((c) => ({ ...EMPTY, ...c, logo: c.logo || '' })));
    });
  }, []);

  const change = (next) => { setRows(next); setDirty(true); setNotice(''); };
  const update = (i, patch) => change(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  };
  const upload = async (i, file) => {
    if (!file) return;
    setBusy(i);
    try {
      const { url } = await uploadProductImage(file, `clients/${slugify(rows[i].name) || 'client'}`);
      update(i, { logo: url });
    } catch { /* message bar explains */ } finally { setBusy(null); }
  };

  const save = async () => {
    setSaving(true);
    const clean = rows
      .map((r) => ({ name: r.name.trim(), logo: r.logo.trim() || null, category: r.category.trim(), project: r.project.trim(), is_active: r.is_active !== false }))
      .filter((r) => r.name);
    const res = await saveSiteSettings({ ...settings, clients: clean });
    setSaving(false);
    if (res.ok) {
      setSettings({ ...settings, clients: clean });
      setDirty(false);
      setNotice('Saved. The logo strip and Clients page now show this list.');
    }
  };

  const withLogo = rows.filter((r) => r.logo).length;
  const hidden = rows.filter((r) => r.is_active === false).length;
  const cards = [
    { key: 'all', label: 'All clients', value: rows.length, accent: '#38bdf8' },
    { key: 'logo', label: 'With logo', value: withLogo, accent: 'var(--adm-emerald)' },
    { key: 'nologo', label: 'Name only (no logo)', value: rows.length - withLogo, accent: '#f59e0b' },
    { key: 'hidden', label: 'Hidden', value: hidden, accent: '#94a3b8' },
  ];
  const visible = (r) => view === 'all' || (view === 'logo' && r.logo) || (view === 'nologo' && !r.logo) || (view === 'hidden' && r.is_active === false);

  if (!settings) return <div className="panel-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--adm-text-muted)' }}>Loading clients…</div>;

  return (
    <div>
      <FilterCards cards={cards} active={view} onSelect={setView} />
      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">Clients &amp; Logos</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
              The home page shows the first 8 clients that have a logo. Use the arrows to choose the order.
            </p>
          </div>
          <div className="panel-card-actions">
            <button type="button" className="btn-secondary-adm" onClick={() => change([...rows, { ...EMPTY }])}>+ Add client</button>
            <button type="button" className="btn-primary-adm" onClick={save} disabled={!dirty || saving}>{saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</button>
          </div>
        </div>
        {notice && <p style={{ margin: 0, padding: '10px 1.5rem', background: '#ecfdf5', color: '#065f46', fontSize: '0.82rem', fontWeight: 600 }}>{notice}</p>}

        <div className="client-admin-list">
          {rows.map((r, i) => visible(r) && (
            <div key={i} className={`client-admin-row ${r.is_active === false ? 'inactive' : ''}`}>
              <span className="client-admin-pos">{i + 1}</span>
              <button type="button" className="client-admin-logo" onClick={() => fileRefs.current[i]?.click()} title="Upload logo">
                {r.logo ? <img src={r.logo} alt="" /> : <span>{busy === i ? '…' : '+ Logo'}</span>}
              </button>
              <input ref={(el) => { fileRefs.current[i] = el; }} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { upload(i, e.target.files?.[0]); e.target.value = ''; }} />
              <div className="client-admin-fields">
                <input type="text" placeholder="Client name *" value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
                <input type="text" placeholder="Sector, e.g. E-Commerce Fulfillment" value={r.category} onChange={(e) => update(i, { category: e.target.value })} />
                <input type="text" placeholder="What we supplied, e.g. Pallet racking & mezzanine" value={r.project} onChange={(e) => update(i, { project: e.target.value })} className="wide" />
              </div>
              <div className="action-btn-group">
                <button type="button" onClick={() => update(i, { is_active: r.is_active === false })} className={`status-badge ${r.is_active === false ? 'badge-pending' : 'badge-closed'}`} style={{ border: 'none', cursor: 'pointer' }}>{r.is_active === false ? 'Hidden' : 'Live'}</button>
                <button type="button" className="btn-icon" title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" className="btn-icon" title="Move down" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>↓</button>
                {r.logo && <button type="button" className="btn-icon" title="Remove logo" onClick={() => update(i, { logo: '' })}>⌫</button>}
                <button type="button" className="btn-icon del" title="Delete client" onClick={() => { if (confirm(`Remove "${r.name || 'this client'}"? Press Save to apply.`)) change(rows.filter((_, j) => j !== i)); }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
