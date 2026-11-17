'use client';
import { useEffect, useRef, useState } from 'react';
import { catalogueAdmin } from '../../../lib/catalogueApi';
import { uploadProductImage } from '../../../lib/productsApi';
import { slugify } from '../../../data/catalogue';
import { FilterCards, Pagination, usePaged } from '../_components/AdminWidgets';

const EMPTY = { group_name: '', name: '', slug: '', spec: '', qty: '', stages: '', image_url: '', catalogue_page: '', sort_order: 100, is_active: true };

export default function MachinesView() {
  const [groups, setGroups] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try { const c = await catalogueAdmin.load(); setGroups(c.machineGroups); setSource(c.source); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const groupNames = groups.map((g) => g.group);
  const all = groups.flatMap((g) => g.items);
  const rows = all.filter((m) => groupFilter === 'all' || m.group_name === groupFilter);
  const paged = usePaged(rows, 10);
  const ACCENTS = ['#38bdf8', 'var(--adm-emerald)', '#a78bfa', '#f59e0b', '#fb7185', '#34d399'];
  const statCards = [{ key: 'all', label: 'All machines', value: all.length, accent: 'var(--adm-text-main)' }, ...groups.map((g, i) => ({ key: g.group, label: g.group, value: g.items.length, accent: ACCENTS[i % ACCENTS.length] }))];

  const openModal = (row, group) => {
    const maxSort = all.reduce((m, x) => Math.max(m, Number(x.sort_order) || 0), 0);
    setForm(row
      ? { ...EMPTY, ...row, qty: row.qty ?? '', stages: (row.stages || []).join('\n'), catalogue_page: row.catalogue_page ?? '' }
      : { ...EMPTY, group_name: group || groupNames[0] || '', sort_order: maxSort + 10 });
    setModal({ row });
    setNotice('');
  };

  const pickImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try { const { url } = await uploadProductImage(file, `machines/${form.slug || slugify(form.name) || 'machine'}`); set({ image_url: url }); } finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await catalogueAdmin.saveMachine({
        ...form,
        slug: form.slug || slugify(form.name),
        qty: form.qty === '' ? null : Number(form.qty),
        stages: String(form.stages || '').split('\n').map((s) => s.trim()).filter(Boolean),
        catalogue_page: form.catalogue_page === '' ? null : Number(form.catalogue_page),
        sort_order: Number(form.sort_order) || 0,
      });
      if (!res.ok) { setNotice('Save failed: ' + (res.error || 'unknown error')); return; }
      setModal(null);
      await load();
    } finally { setSaving(false); }
  };

  const remove = async (m) => {
    if (!confirm(`Delete "${m.name}"?`)) return;
    await catalogueAdmin.deleteMachine(m.id);
    load();
  };
  const toggle = async (m) => { await catalogueAdmin.saveMachine({ ...m, is_active: !m.is_active }); load(); };

  const f = (label, key, props = {}) => (
    <div className="form-group-adm">
      <label>{label}</label>
      {props.textarea
        ? <textarea rows={props.rows || 3} placeholder={props.placeholder} value={form[key] ?? ''} onChange={(e) => set({ [key]: e.target.value })} />
        : <input type={props.type || 'text'} min={props.min} list={props.list} placeholder={props.placeholder} value={form[key] ?? ''} onChange={(e) => set({ [key]: e.target.value })} required={props.required} />}
    </div>
  );

  return (
    <div>
      <FilterCards cards={statCards} active={groupFilter} onSelect={setGroupFilter} />
      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">In-House Machines &amp; Plant</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
              Shown on the Manufacturing page, grouped by process. {source && <span>Source: <strong>{source}</strong>.</span>}
            </p>
          </div>
          <div className="panel-card-actions">
            <button type="button" className="btn-primary-adm" onClick={() => openModal(null)}>+ Add Machine</button>
            <button type="button" className="btn-secondary-adm" onClick={load} title="Refresh">↻</button>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table compact">
            <thead>
              <tr><th>Image</th><th>Machine</th><th>Group</th><th>Specification</th><th>Qty</th><th>Order</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {all.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>{loading ? 'Loading machines…' : 'No machines yet.'}</td></tr>
              ) : paged.slice.map((m) => (
                  <tr key={m.slug || m.id}>
                    <td>{m.image_url ? <img src={m.image_url} alt="" className="thumb" /> : <div className="thumb" />}</td>
                    <td><strong style={{ color: 'var(--adm-text-main)' }}>{m.name}</strong><div><code style={{ fontSize: '0.68rem', color: 'var(--adm-text-dim)' }}>{m.slug}</code></div></td>
                    <td><span className="badge-category">{m.group_name}</span></td>
                    <td style={{ color: 'var(--adm-text-silver)' }}><div className="cell-clamp" title={m.spec}>{m.spec}</div>{m.stages.length > 0 && <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.7rem' }}>{m.stages.length} process stages</div>}</td>
                    <td style={{ color: 'var(--adm-text-silver)' }}>{m.qty ?? '—'}</td>
                    <td style={{ color: 'var(--adm-text-silver)', fontSize: '0.8rem' }}>{m.sort_order}</td>
                    <td><button type="button" onClick={() => toggle(m)} className={`status-badge ${m.is_active ? 'badge-closed' : 'badge-pending'}`} style={{ border: 'none', cursor: 'pointer' }}>{m.is_active ? 'Live' : 'Hidden'}</button></td>
                    <td>
                      <div className="action-btn-group">
                        <button type="button" className="btn-icon" title="Edit" onClick={() => openModal(m)}>✎</button>
                        <button type="button" className="btn-icon del" title="Delete" onClick={() => remove(m)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination page={paged.page} pages={paged.pages} total={paged.total} pageSize={paged.pageSize} onPage={paged.setPage} noun="machines" />
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="modal-dialog" style={{ maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.row ? 'Edit Machine' : 'Add Machine'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setModal(null)}>&times;</button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-muted)', display: 'block', marginBottom: 6 }}>MACHINE PHOTO</label>
                    <div onClick={() => !uploading && fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pickImage(e.dataTransfer.files?.[0]); }}
                      style={{ width: '100%', height: 140, borderRadius: 10, border: '2px dashed var(--adm-border)', background: 'var(--adm-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                      {form.image_url ? <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--adm-text-dim)', fontSize: '0.72rem' }}>Click or drop a photo</span>}
                      {uploading && <span style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.82)', color: 'var(--adm-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>Uploading...</span>}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { pickImage(e.target.files?.[0]); e.target.value = ''; }} />
                    <input type="text" placeholder="...or paste an image URL" value={form.image_url} onChange={(e) => set({ image_url: e.target.value })} style={{ marginTop: 6, width: '100%', fontSize: '0.72rem' }} />
                  </div>
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                      <div className="form-group-adm">
                        <label>Machine name *</label>
                        <input type="text" required value={form.name} onChange={(e) => set({ name: e.target.value, slug: modal.row ? form.slug : slugify(e.target.value) })} />
                      </div>
                      <div className="form-group-adm">
                        <label>Slug *</label>
                        <input type="text" required value={form.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {f('Process group *', 'group_name', { required: true, list: 'machine-groups', placeholder: 'e.g. Cutting & Forming' })}
                      {f('Quantity', 'qty', { type: 'number', min: 0 })}
                    </div>
                    <datalist id="machine-groups">{groupNames.map((g) => <option key={g} value={g} />)}</datalist>
                  </div>
                </div>
                {f('Specification (one line)', 'spec', { textarea: true, rows: 2, placeholder: 'e.g. up to 12 mm plate, ±0.2 mm repeatability' })}
                {f('Process stages, one per line (optional, e.g. for the powder coating plant)', 'stages', { textarea: true, rows: 4 })}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {f('Display order (lower first)', 'sort_order', { type: 'number' })}
                  {f('Catalogue page no.', 'catalogue_page', { type: 'number', min: 1 })}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--adm-text-main)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => set({ is_active: e.target.checked })} style={{ width: 18, height: 18 }} />
                  Live on website
                </label>
                {notice && <p style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--adm-amber)' }}>{notice}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-adm" onClick={() => setModal(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary-adm" disabled={saving || uploading}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
