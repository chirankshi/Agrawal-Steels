'use client';
import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../../lib/adminApi';
import { uploadProductImage } from '../../../lib/productsApi';
import { useCatalogue } from '../../../lib/catalogueApi';
import { resolveProductPlacement } from '../../../data/catalogue';
import { FilterCards, Pagination, usePaged } from '../_components/AdminWidgets';

const EMPTY_FORM = {
  name: '',
  slug: '',
  category: '',
  category_slug: '',
  subcategory: '',
  subcategory_slug: '',
  tagline: '',
  description: '',
  grade: '',
  specs: '',
  sizes: '',
  dispatch: '',
  applications: '',
  badge: '',
  image_url: '',
  gallery: [],
  tags: '',
  estimated_price_per_ton: 0,
  sort_order: 100,
  catalogue_page: '',
  show_on_home: false,
  is_active: true,
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const listToText = (v) => (Array.isArray(v) ? v.join(', ') : v || '');
const textToList = (v) => String(v || '').split(',').map((t) => t.trim()).filter(Boolean);

export default function AdminProductsPage() {
  const { tree } = useCatalogue();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const mainFileRef = useRef(null);
  const galleryFileRef = useRef(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      setAllProducts(await adminApi.getProducts({ search: searchTerm }));
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const STATUS_MATCH = {
    all: () => true,
    live: (p) => p.is_active,
    hidden: (p) => !p.is_active,
    home: (p) => p.show_on_home && p.is_active,
    nophoto: (p) => !p.image_url || p.image_url === '/images/product_tmt_bars.jpg',
  };
  const inCategory = selectedCategory === 'All' ? allProducts : allProducts.filter((p) => resolveProductPlacement(p, tree).category?.slug === selectedCategory);
  const products = inCategory.filter(STATUS_MATCH[statusFilter] || STATUS_MATCH.all);
  const paged = usePaged(products, 10);
  const statCards = [
    { key: 'all', label: 'All products', value: inCategory.length, accent: '#38bdf8' },
    { key: 'live', label: 'Live on site', value: inCategory.filter(STATUS_MATCH.live).length, accent: 'var(--adm-emerald)' },
    { key: 'home', label: 'On home page', value: inCategory.filter(STATUS_MATCH.home).length, accent: '#a78bfa' },
    { key: 'hidden', label: 'Hidden', value: inCategory.filter(STATUS_MATCH.hidden).length, accent: '#f59e0b' },
    { key: 'nophoto', label: 'Without own photo', value: inCategory.filter(STATUS_MATCH.nophoto).length, accent: '#fb7185' },
  ];

  const formCategory = tree.find((c) => c.slug === formData.category_slug) || null;
  const formSubcategory = formCategory?.subcategories.find((sc) => sc.slug === formData.subcategory_slug) || null;
  const nameSuggestions = formSubcategory ? formSubcategory.items : formCategory ? formCategory.subcategories.flatMap((sc) => sc.items) : [];

  const chooseCategory = (slug) => {
    const c = tree.find((x) => x.slug === slug);
    set({ category_slug: slug, category: c?.name || '', subcategory_slug: '', subcategory: '' });
  };
  const chooseSubcategory = (slug) => {
    const sc = formCategory?.subcategories.find((x) => x.slug === slug);
    set({ subcategory_slug: slug, subcategory: sc?.name || '' });
  };

  const set = (patch) => setFormData((prev) => ({ ...prev, ...patch }));

  const handleOpenCreate = () => {
    setEditingProduct(null);
    const maxSort = products.reduce((m, p) => Math.max(m, Number(p.sort_order) || 0), 0);
    const first = tree[0];
    setFormData({ ...EMPTY_FORM, sort_order: maxSort + 10, category_slug: first?.slug || '', category: first?.name || '' });
    setNotice('');
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    const placement = resolveProductPlacement(prod, tree);
    setFormData({
      ...EMPTY_FORM,
      ...prod,
      category_slug: placement.category?.slug || '',
      category: placement.category?.name || prod.category || '',
      subcategory_slug: placement.subcategory?.slug || '',
      subcategory: placement.subcategory?.name || prod.subcategory || '',
      tags: listToText(prod.tags),
      applications: listToText(prod.applications),
      gallery: Array.isArray(prod.gallery) ? prod.gallery : [],
      estimated_price_per_ton: prod.estimated_price_per_ton || 0,
      sort_order: prod.sort_order ?? 100,
      catalogue_page: prod.catalogue_page ?? '',
      show_on_home: Boolean(prod.show_on_home),
      is_active: prod.is_active ?? true,
    });
    setNotice('');
    setModalOpen(true);
  };

  const handleNameChange = (name) => set({ name, slug: editingProduct ? formData.slug : slugify(name) });

  const handleImageFile = async (file, target = 'main') => {
    if (!file) return;
    setUploading(true);
    setNotice('');
    try {
      const { url, storage } = await uploadProductImage(file, formData.slug || slugify(formData.name) || 'product');
      if (target === 'main') set({ image_url: url });
      else set({ gallery: [...formData.gallery, url].slice(0, 6) });
      if (storage === 'inline') setNotice('Image stored inside this browser only (no cloud storage reachable). It will not appear for other visitors until Supabase or the API is online.');
      else setNotice(`Image uploaded to ${storage === 'supabase' ? 'Supabase Storage' : 'the API server'}.`);
    } catch (e) {
      setNotice('Image upload failed: ' + (e?.message || e));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      slug: formData.slug || slugify(formData.name),
      tags: textToList(formData.tags),
      applications: textToList(formData.applications),
      gallery: formData.gallery,
      estimated_price_per_ton: Number(formData.estimated_price_per_ton) || 0,
      sort_order: Number(formData.sort_order) || 0,
      catalogue_page: formData.catalogue_page === '' ? null : Number(formData.catalogue_page),
    };
    try {
      const saved = editingProduct ? await adminApi.updateProduct(editingProduct.id, payload) : await adminApi.createProduct(payload);
      if (!saved) return; // the message bar explains why; keep the form open
      setModalOpen(false);
      loadProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id) => { await adminApi.toggleProductActive(id); loadProducts(); };
  const handleDelete = async (id) => {
    if (confirm('Delete this product from the catalogue? This cannot be undone.')) {
      await adminApi.deleteProduct(id);
      loadProducts();
    }
  };

  const field = (label, key, props = {}) => (
    <div className="form-group-adm">
      <label>{label}</label>
      {props.textarea ? (
        <textarea rows={props.rows || 3} placeholder={props.placeholder} value={formData[key]} onChange={(e) => set({ [key]: e.target.value })} required={props.required} />
      ) : (
        <input type={props.type || 'text'} step={props.step} min={props.min} placeholder={props.placeholder} value={formData[key]} onChange={(e) => set({ [key]: e.target.value })} required={props.required} />
      )}
    </div>
  );

  return (
    <div>
      <FilterCards cards={statCards} active={statusFilter} onSelect={setStatusFilter} />
      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">Product Catalogue &amp; Images</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
              Add products, assign categories, upload photos and choose what appears on the home page. Changes go live on the website.
            </p>
          </div>
          <div className="panel-card-actions">
            <button type="button" className="btn-primary-adm" onClick={handleOpenCreate}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              <span>Add Product</span>
            </button>
            <button type="button" className="btn-secondary-adm" onClick={loadProducts} title="Refresh">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--adm-border)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="filter-tabs">
            {[{ slug: 'All', name: 'All' }, ...tree].map((cat) => (
              <button key={cat.slug} type="button" className={`filter-tab ${selectedCategory === cat.slug ? 'active' : ''}`} onClick={() => setSelectedCategory(cat.slug)}>
                {cat.name}
              </button>
            ))}
          </div>
          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search product, grade, specs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Grade / Specs</th>
                <th>Order</th>
                <th>Home</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>{loading ? 'Loading catalogue products...' : 'No products found.'}</td></tr>
              ) : (
                paged.slice.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <img src={prod.image_url || '/images/product_tmt_bars.jpg'} alt={prod.name} className="thumb" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ color: 'var(--adm-text-main)' }} className="cell-nowrap" title={prod.name}>{prod.name}</strong>
                        {prod.badge && <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '3px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--adm-amber)', fontWeight: 700 }}>{prod.badge}</span>}
                      </div>
                      <code style={{ fontSize: '0.7rem', color: 'var(--adm-text-dim)' }}>/{prod.slug}</code>
                      {prod.subcategory && <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)' }}>{prod.subcategory}</div>}
                    </td>
                    <td><span className="badge-category">{resolveProductPlacement(prod, tree).category?.name || prod.category}</span></td>
                    <td style={{ color: 'var(--adm-text-silver)' }}>
                      <div className="cell-nowrap" title={prod.grade || ''}>{prod.grade || '—'}</div>
                      <div className="cell-nowrap" style={{ color: 'var(--adm-text-muted)' }} title={prod.specs || ''}>{prod.specs || ''}</div>
                    </td>
                    <td style={{ color: 'var(--adm-text-silver)', fontSize: '0.8rem' }}>{prod.sort_order ?? '—'}</td>
                    <td>{prod.show_on_home ? <span className="status-badge badge-quoted">Home</span> : <span style={{ color: 'var(--adm-text-dim)', fontSize: '0.75rem' }}>—</span>}</td>
                    <td>
                      <button type="button" onClick={() => handleToggleActive(prod.id)} className={`status-badge ${prod.is_active ? 'badge-closed' : 'badge-pending'}`} style={{ border: 'none', cursor: 'pointer', outline: 'none' }} title="Click to toggle visibility on the website">
                        {prod.is_active ? 'Live' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button type="button" className="btn-icon" onClick={() => handleOpenEdit(prod)} title="Edit product">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                        </button>
                        <button type="button" className="btn-icon del" onClick={() => handleDelete(prod.id)} title="Delete product">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={paged.page} pages={paged.pages} total={paged.total} pageSize={paged.pageSize} onPage={paged.setPage} noun="products" />
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div className="modal-dialog" style={{ maxWidth: 860 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Images */}
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', alignItems: 'start' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--adm-text-muted)', display: 'block', marginBottom: 6 }}>MAIN PRODUCT PHOTO</label>
                    <div
                      onClick={() => !uploading && mainFileRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); handleImageFile(e.dataTransfer.files?.[0], 'main'); }}
                      style={{ width: 220, height: 150, borderRadius: 10, border: '2px dashed var(--adm-border)', background: 'var(--adm-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                      title="Click or drop an image"
                    >
                      {formData.image_url ? (
                        <img src={formData.image_url} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ color: 'var(--adm-text-dim)', fontSize: '0.75rem', textAlign: 'center', padding: 10 }}>Click or drop a photo<br />JPG / PNG, auto-resized</span>
                      )}
                      {uploading && <span style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.82)', color: 'var(--adm-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>Uploading...</span>}
                    </div>
                    <input ref={mainFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { handleImageFile(e.target.files?.[0], 'main'); e.target.value = ''; }} />
                    <input type="text" placeholder="...or paste an image URL" value={formData.image_url} onChange={(e) => set({ image_url: e.target.value })} style={{ marginTop: 8, width: '100%', fontSize: '0.72rem' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--adm-text-muted)', display: 'block', marginBottom: 6 }}>GALLERY (OPTIONAL, UP TO 6)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {formData.gallery.map((url, i) => (
                        <div key={i} style={{ position: 'relative', width: 84, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--adm-border)' }}>
                          <img src={url} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button type="button" onClick={() => set({ gallery: formData.gallery.filter((_, j) => j !== i) })} title="Remove" style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', border: 'none', background: 'rgba(239,68,68,0.9)', color: '#fff', fontSize: 11, cursor: 'pointer', lineHeight: '18px', padding: 0 }}>×</button>
                        </div>
                      ))}
                      {formData.gallery.length < 6 && (
                        <button type="button" onClick={() => galleryFileRef.current?.click()} disabled={uploading} style={{ width: 84, height: 60, borderRadius: 6, border: '2px dashed var(--adm-border)', background: 'transparent', color: 'var(--adm-text-muted)', cursor: 'pointer', fontSize: '0.7rem' }}>+ Add</button>
                      )}
                      <input ref={galleryFileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={async (e) => { for (const f of Array.from(e.target.files || [])) await handleImageFile(f, 'gallery'); e.target.value = ''; }} />
                    </div>
                    {notice && <p style={{ marginTop: 10, fontSize: '0.72rem', color: notice.includes('failed') || notice.includes('only') ? 'var(--adm-amber)' : 'var(--adm-emerald)' }}>{notice}</p>}
                  </div>
                </div>

                {/* Identity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px', marginTop: 16 }}>
                  <div className="form-group-adm">
                    <label>Product Name *</label>
                    <input type="text" required list="product-name-suggestions" placeholder="e.g. Heavy-Duty Pallet Racking Systems" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} />
                    <datalist id="product-name-suggestions">
                      {nameSuggestions.map((n) => <option key={n} value={n} />)}
                    </datalist>
                  </div>
                  <div className="form-group-adm">
                    <label>URL Slug *</label>
                    <input type="text" required placeholder="heavy-duty-pallet-racks" value={formData.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group-adm">
                    <label>Category * <small style={{ color: 'var(--adm-text-dim)', fontWeight: 400 }}>(from the catalogue)</small></label>
                    <select value={formData.category_slug} onChange={(e) => chooseCategory(e.target.value)} required>
                      <option value="" disabled>Select a category…</option>
                      {tree.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group-adm">
                    <label>Sub-category</label>
                    <select value={formData.subcategory_slug} onChange={(e) => chooseSubcategory(e.target.value)} disabled={!formCategory}>
                      <option value="">— none —</option>
                      {(formCategory?.subcategories || []).map((sc) => <option key={sc.slug} value={sc.slug}>{sc.name}</option>)}
                    </select>
                    {formSubcategory && formSubcategory.items.length > 0 && (
                      <small style={{ display: 'block', marginTop: 4, fontSize: '0.68rem', color: 'var(--adm-text-dim)' }}>
                        Catalogue items: {formSubcategory.items.slice(0, 6).join(', ')}{formSubcategory.items.length > 6 ? '…' : ''}
                      </small>
                    )}
                  </div>
                </div>

                {field('Tagline (one line under the name)', 'tagline', { placeholder: 'e.g. Selective, Double-Deep, Drive-In & Narrow Aisle High-Bay Racks' })}
                {field('Description *', 'description', { textarea: true, required: true, placeholder: 'What it is, how it is made, where it is used...' })}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {field('Grade / IS Standard', 'grade', { placeholder: 'e.g. IS 2062 E250 / Fe 550D' })}
                  {field('Thickness / Capacity / Specs', 'specs', { placeholder: 'e.g. Up to 4,000 kg per level' })}
                  {field('Available Sizes', 'sizes', { placeholder: 'e.g. Heights up to 12.5 m' })}
                  {field('Dispatch / Delivery Mode', 'dispatch', { placeholder: 'e.g. 24-hour dispatch from stock' })}
                </div>

                {field('Applications (comma-separated)', 'applications', { placeholder: 'Warehouses, Cold Storage, PEB Columns' })}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {field('Highlight Badge', 'badge', { placeholder: 'e.g. Flagship System' })}
                  {field('Tags / Mill Brands (comma-separated)', 'tags', { placeholder: 'SAIL, TATA Steel, JSPL' })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {field('Est. Price / Ton (₹, 0 = on request)', 'estimated_price_per_ton', { type: 'number', step: '500', min: 0 })}
                  {field('Display Order (lower shows first)', 'sort_order', { type: 'number', step: '1' })}
                  {field('Catalogue Page No.', 'catalogue_page', { type: 'number', step: '1', min: 1, placeholder: 'e.g. 12' })}
                </div>

                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--adm-text-main)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.show_on_home} onChange={(e) => set({ show_on_home: e.target.checked })} style={{ width: 18, height: 18 }} />
                    Show in home-page best sellers
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--adm-text-main)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => set({ is_active: e.target.checked })} style={{ width: 18, height: 18 }} />
                    Live on website
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary-adm" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary-adm" disabled={saving || uploading}>
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
