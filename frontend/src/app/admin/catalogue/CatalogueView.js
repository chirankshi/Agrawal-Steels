'use client';
import { useEffect, useRef, useState } from 'react';
import { catalogueAdmin } from '../../../lib/catalogueApi';
import { uploadProductImage } from '../../../lib/productsApi';
import { slugify } from '../../../data/catalogue';
import { FilterCards } from '../_components/AdminWidgets';

const EMPTY_CATEGORY = { name: '', slug: '', company: '', description: '', partners: '', capacity: '', catalogue_page: '', image_url: '', sort_order: 100, is_active: true };
const EMPTY_SUB = { category_slug: '', name: '', slug: '', description: '', items: '', catalogue_page: '', image_url: '', sort_order: 100, is_active: true };

const listToText = (v) => (Array.isArray(v) ? v.join(', ') : v || '');
const textToList = (v) => String(v || '').split(/[,\n]/).map((t) => t.trim()).filter(Boolean);
const linesToList = (v) => String(v || '').split('\n').map((t) => t.trim()).filter(Boolean);

function ImageField({ value, onChange, slug, label = 'IMAGE' }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (file) => {
    if (!file) return;
    setBusy(true);
    try { const { url } = await uploadProductImage(file, slug || 'catalogue'); onChange(url); } finally { setBusy(false); }
  };
  return (
    <div>
      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>{label}</label>
      <div
        onClick={() => !busy && ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
        style={{ width: '100%', height: 120, borderRadius: 10, border: '2px dashed var(--adm-border)', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
      >
        {value ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Click or drop a photo</span>}
        {busy && <span style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.75)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>Uploading...</span>}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
      <input type="text" placeholder="...or paste an image URL" value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ marginTop: 6, width: '100%', fontSize: '0.72rem' }} />
    </div>
  );
}

export default function CatalogueView() {
  const [tree, setTree] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({});
  const [modal, setModal] = useState(null); // { kind: 'category'|'subcategory', row }
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [view, setView] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const c = await catalogueAdmin.load();
      setTree(c.tree);
      setSource(c.source);
      setOpen((prev) => (Object.keys(prev).length ? prev : Object.fromEntries(c.tree.slice(0, 1).map((x) => [x.slug, true]))));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const allSubs = tree.flatMap((c) => c.subcategories);
  const visibleTree = tree
    .filter((c) => (view === 'live' ? c.is_active : view === 'hidden' ? !c.is_active || c.subcategories.some((s) => !s.is_active) : true))
    .map((c) => (view === 'hidden' ? { ...c, subcategories: c.subcategories.filter((s) => !s.is_active || !c.is_active) } : c));
  const expandAll = view === 'subcategories' || view === 'hidden';
  const statCards = [
    { key: 'all', label: 'Categories', value: tree.length, accent: '#38bdf8' },
    { key: 'subcategories', label: 'Sub-categories (expand all)', value: allSubs.length, accent: '#a78bfa' },
    { key: 'items', label: 'Catalogue items', value: allSubs.reduce((n, s) => n + s.items.length, 0), accent: '#10b981' },
    { key: 'live', label: 'Live categories', value: tree.filter((c) => c.is_active).length, accent: '#34d399' },
    { key: 'hidden', label: 'Hidden (cat. or sub)', value: tree.filter((c) => !c.is_active).length + allSubs.filter((s) => !s.is_active).length, accent: '#f59e0b' },
  ];

  const openCategory = (row) => {
    const maxSort = tree.reduce((m, c) => Math.max(m, Number(c.sort_order) || 0), 0);
    setForm(row ? { ...EMPTY_CATEGORY, ...row, partners: listToText(row.partners), catalogue_page: row.catalogue_page ?? '' } : { ...EMPTY_CATEGORY, sort_order: maxSort + 10 });
    setModal({ kind: 'category', row });
    setNotice('');
  };
  const openSub = (category, row) => {
    const maxSort = category.subcategories.reduce((m, s) => Math.max(m, Number(s.sort_order) || 0), 0);
    setForm(row ? { ...EMPTY_SUB, ...row, items: (row.items || []).join('\n'), catalogue_page: row.catalogue_page ?? '' } : { ...EMPTY_SUB, category_slug: category.slug, sort_order: maxSort + 10, catalogue_page: category.catalogue_page ?? '' });
    setModal({ kind: 'subcategory', row, category });
    setNotice('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const base = { ...form, slug: form.slug || slugify(form.name), sort_order: Number(form.sort_order) || 0, catalogue_page: form.catalogue_page === '' ? null : Number(form.catalogue_page) };
      const res = modal.kind === 'category'
        ? await catalogueAdmin.saveCategory({ ...base, partners: textToList(form.partners) })
        : await catalogueAdmin.saveSubcategory({ ...base, items: linesToList(form.items) });
      if (!res.ok) { setNotice('Save failed: ' + (res.error || 'unknown error')); return; }
      setModal(null);
      await load();
    } finally { setSaving(false); }
  };

  const removeCategory = async (c) => {
    if (!confirm(`Delete "${c.name}" and its ${c.subcategories.length} sub-categories? Products keep their data but lose this grouping.`)) return;
    await catalogueAdmin.deleteCategory(c.id);
    load();
  };
  const removeSub = async (s) => {
    if (!confirm(`Delete sub-category "${s.name}"?`)) return;
    await catalogueAdmin.deleteSubcategory(s.id);
    load();
  };
  const toggle = async (kind, row) => {
    const fn = kind === 'category' ? catalogueAdmin.saveCategory : catalogueAdmin.saveSubcategory;
    await fn({ ...row, is_active: !row.is_active });
    load();
  };

  const f = (label, key, props = {}) => (
    <div className="form-group-adm">
      <label>{label}</label>
      {props.textarea
        ? <textarea rows={props.rows || 3} placeholder={props.placeholder} value={form[key] ?? ''} onChange={(e) => set({ [key]: e.target.value })} />
        : <input type={props.type || 'text'} min={props.min} placeholder={props.placeholder} value={form[key] ?? ''} onChange={(e) => set({ [key]: e.target.value })} required={props.required} />}
    </div>
  );

  return (
    <div>
      <FilterCards cards={statCards} active={view} onSelect={setView} />
      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">Catalogue Categories &amp; Sub-categories</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              The hierarchy behind the Products page and the product form. {source && <span>Source: <strong>{source}</strong>.</span>}
            </p>
          </div>
          <div className="panel-card-actions">
            <button type="button" className="btn-primary-adm" onClick={() => openCategory(null)}>+ Add Category</button>
            <button type="button" className="btn-secondary-adm" onClick={load} title="Refresh">↻</button>
          </div>
        </div>

        <div className="catalogue-admin-list">
          {loading && !tree.length && <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading catalogue…</div>}
          {visibleTree.map((c) => (
            <div key={c.slug} className={`cat-admin-row ${c.is_active ? '' : 'inactive'}`}>
              <div className="cat-admin-head">
                <button type="button" className="cat-admin-toggle" onClick={() => setOpen((o) => ({ ...o, [c.slug]: !o[c.slug] }))} aria-label="Expand">
                  {open[c.slug] ? '▾' : '▸'}
                </button>
                {c.image_url ? <img src={c.image_url} alt="" className="cat-admin-thumb" /> : <div className="cat-admin-thumb placeholder">{c.name.slice(0, 2).toUpperCase()}</div>}
                <div className="cat-admin-text">
                  <strong>{c.name}</strong>
                  <span>
                    <code>{c.slug}</code> · {c.subcategories.length} sub-categories · {c.company || '—'}{c.catalogue_page ? ` · p.${c.catalogue_page}` : ''} · order {c.sort_order}
                  </span>
                </div>
                <div className="action-btn-group">
                  <button type="button" onClick={() => toggle('category', c)} className={`status-badge ${c.is_active ? 'badge-closed' : 'badge-pending'}`} style={{ border: 'none', cursor: 'pointer' }}>{c.is_active ? 'Live' : 'Hidden'}</button>
                  <button type="button" className="btn-secondary-adm" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={() => openSub(c, null)}>+ Sub-category</button>
                  <button type="button" className="btn-icon" title="Edit" onClick={() => openCategory(c)}>✎</button>
                  <button type="button" className="btn-icon del" title="Delete" onClick={() => removeCategory(c)}>🗑</button>
                </div>
              </div>

              {(open[c.slug] || expandAll) && (
                <div className="sub-admin-list">
                  {c.subcategories.length === 0 && <div style={{ padding: '0.6rem 1rem', color: '#64748b', fontSize: '0.75rem' }}>No sub-categories yet.</div>}
                  {c.subcategories.map((s) => (
                    <div key={s.slug} className={`sub-admin-row ${s.is_active ? '' : 'inactive'}`}>
                      {s.image_url ? <img src={s.image_url} alt="" className="cat-admin-thumb small" /> : <div className="cat-admin-thumb small placeholder" />}
                      <div className="cat-admin-text">
                        <strong>{s.name}</strong>
                        <span><code>{s.slug}</code> · {s.items.length} catalogue items · order {s.sort_order}</span>
                        {s.items.length > 0 && <em>{s.items.slice(0, 5).join(', ')}{s.items.length > 5 ? ` +${s.items.length - 5} more` : ''}</em>}
                      </div>
                      <div className="action-btn-group">
                        <button type="button" onClick={() => toggle('subcategory', s)} className={`status-badge ${s.is_active ? 'badge-closed' : 'badge-pending'}`} style={{ border: 'none', cursor: 'pointer' }}>{s.is_active ? 'Live' : 'Hidden'}</button>
                        <button type="button" className="btn-icon" title="Edit" onClick={() => openSub(c, s)}>✎</button>
                        <button type="button" className="btn-icon del" title="Delete" onClick={() => removeSub(s)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="modal-dialog" style={{ maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.row ? 'Edit' : 'Add'} {modal.kind === 'category' ? 'Category' : `Sub-category of ${modal.category?.name || ''}`}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setModal(null)}>&times;</button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }}>
                  <ImageField value={form.image_url} onChange={(url) => set({ image_url: url })} slug={`${modal.kind === 'category' ? 'categories' : 'subcategories'}/${form.slug || slugify(form.name)}`} label={modal.kind === 'category' ? 'CATEGORY IMAGE' : 'SUB-CATEGORY IMAGE'} />
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                      <div className="form-group-adm">
                        <label>Name *</label>
                        <input type="text" required value={form.name} onChange={(e) => set({ name: e.target.value, slug: modal.row ? form.slug : slugify(e.target.value) })} />
                      </div>
                      <div className="form-group-adm">
                        <label>Slug *</label>
                        <input type="text" required value={form.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} />
                      </div>
                    </div>
                    {modal.kind === 'category' ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {f('Company / Unit', 'company', { placeholder: 'e.g. Majestic AR Technology' })}
                        {f('Capacity line (optional)', 'capacity', { placeholder: 'e.g. 700 to 1,000 MT per month' })}
                      </div>
                    ) : (
                      <div className="form-group-adm">
                        <label>Parent category</label>
                        <select value={form.category_slug} onChange={(e) => set({ category_slug: e.target.value })}>
                          {tree.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {f('Short description (shown on the Products page)', 'description', { textarea: true, rows: 2 })}
                {modal.kind === 'category'
                  ? f('Partner mills / brands (comma-separated)', 'partners', { placeholder: 'Tata Steel, Jindal Steel, SAIL' })
                  : f('Catalogue items, one per line (shown as tiles and as product-name suggestions)', 'items', { textarea: true, rows: 8, placeholder: 'Selective pallet racks\nDouble-deep pallet racks' })}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {f('Display order (lower first)', 'sort_order', { type: 'number' })}
                  {f('Catalogue page no.', 'catalogue_page', { type: 'number', min: 1 })}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#f8fafc', cursor: 'pointer' }}>
                  <input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => set({ is_active: e.target.checked })} style={{ width: 18, height: 18 }} />
                  Live on website
                </label>
                {notice && <p style={{ marginTop: 10, fontSize: '0.75rem', color: '#fbbf24' }}>{notice}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-adm" onClick={() => setModal(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary-adm" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
