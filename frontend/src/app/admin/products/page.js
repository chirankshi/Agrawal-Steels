'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';

const DEFAULT_CATEGORIES = [
  'All',
  'Steel Supply & Trading',
  'Industrial Storage Solutions',
  'Heavy Fabrication',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Steel Supply & Trading',
    grade: '',
    specs: '',
    badge: '',
    estimated_price_per_ton: 55000,
    tags: 'SAIL, TATA Steel, JSPL',
    description: '',
    is_active: true,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts({
        category: selectedCategory === 'All' ? null : selectedCategory,
        search: searchTerm,
      });
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Steel Supply & Trading',
      grade: 'Fe 550D / IS 2062',
      specs: 'Standard Mill Specifications',
      badge: 'Popular',
      estimated_price_per_ton: 55000,
      tags: 'SAIL, TATA Steel, JSPL',
      description: 'Manufactured and supplied with mill test certificate (MTC).',
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    const tagsString = Array.isArray(prod.tags) ? prod.tags.join(', ') : prod.tags || '';
    setFormData({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      grade: prod.grade || '',
      specs: prod.specs || '',
      badge: prod.badge || '',
      estimated_price_per_ton: prod.estimated_price_per_ton || 0,
      tags: tagsString,
      description: prod.description || '',
      is_active: prod.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editingProduct) {
      await adminApi.updateProduct(editingProduct.id, payload);
    } else {
      await adminApi.createProduct(payload);
    }
    setModalOpen(false);
    loadProducts();
  };

  const handleToggleActive = async (id) => {
    await adminApi.toggleProductActive(id);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this steel product from the catalog?')) {
      await adminApi.deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div>
      <div className="panel-card">
        {/* Header */}
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">
              Steel Product Inventory &amp; Catalog Management
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              Manage TMT bars, structural beams, HR plates, warehouse racks and custom fabrication specs
            </p>
          </div>

          <div className="panel-card-actions">
            <button
              type="button"
              className="btn-primary-adm"
              onClick={handleOpenCreate}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Steel Product</span>
            </button>
            <button
              type="button"
              className="btn-secondary-adm"
              onClick={loadProducts}
              title="Refresh"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--adm-border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="filter-tabs">
            {DEFAULT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search product, grade, specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Grade / Standards</th>
                <th>Technical Specs</th>
                <th>Est. Price / MT</th>
                <th>Mill Tags</th>
                <th>Catalog Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    {loading ? 'Loading catalog products...' : 'No products found.'}
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: '#f8fafc' }}>{prod.name}</strong>
                        {prod.badge && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              padding: '1px 6px',
                              borderRadius: '3px',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#f59e0b',
                              fontWeight: 700,
                            }}
                          >
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <code style={{ fontSize: '0.7rem', color: '#64748b' }}>/{prod.slug}</code>
                    </td>
                    <td>
                      <span className="badge-category">{prod.category}</span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      {prod.grade || '—'}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '200px' }}>
                      {prod.specs || 'Standard Mill Lot'}
                    </td>
                    <td>
                      {prod.estimated_price_per_ton ? (
                        <strong style={{ color: '#10b981', fontSize: '0.85rem' }}>
                          ₹{prod.estimated_price_per_ton.toLocaleString('en-IN')}
                        </strong>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>On RFQ</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {prod.tags &&
                          (Array.isArray(prod.tags) ? prod.tags : prod.tags.split(',')).map((t, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.65rem',
                                background: 'rgba(255,255,255,0.05)',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                color: '#94a3b8',
                              }}
                            >
                              {t.trim()}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(prod.id)}
                        className={`status-badge ${prod.is_active ? 'badge-closed' : 'badge-pending'}`}
                        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                        title="Click to toggle catalog visibility"
                      >
                        {prod.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleOpenEdit(prod)}
                          title="Edit Product"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="btn-icon del"
                          onClick={() => handleDelete(prod.id)}
                          title="Delete Product"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Steel Specification' : 'Add New Steel Product'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="form-group-adm">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MS Beams (ISMB 400)"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                  <div className="form-group-adm">
                    <label>URL Slug *</label>
                    <input
                      type="text"
                      required
                      placeholder="ms-beams-ismb-400"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group-adm">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Steel Supply & Trading">Steel Supply &amp; Trading</option>
                      <option value="Industrial Storage Solutions">Industrial Storage Solutions</option>
                      <option value="Heavy Fabrication">Heavy Fabrication</option>
                    </select>
                  </div>
                  <div className="form-group-adm">
                    <label>Grade / IS Standard</label>
                    <input
                      type="text"
                      placeholder="e.g. Fe 550D / IS 2062 E250"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="form-group-adm">
                    <label>Dimensions / Specs</label>
                    <input
                      type="text"
                      placeholder="e.g. 8mm to 32mm | Length 12m"
                      value={formData.specs}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                    />
                  </div>
                  <div className="form-group-adm">
                    <label>Est. Price / Ton (₹)</label>
                    <input
                      type="number"
                      step="500"
                      placeholder="54000"
                      value={formData.estimated_price_per_ton}
                      onChange={(e) => setFormData({ ...formData, estimated_price_per_ton: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group-adm">
                    <label>Highlight Badge (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. High Demand, Heavy Duty"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    />
                  </div>
                  <div className="form-group-adm">
                    <label>Mill Brands (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="SAIL, TATA Steel, JSPL"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-adm">
                  <label>Technical Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter industrial grade description, applications, and MTC standards..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isActiveCheck" style={{ fontSize: '0.85rem', color: '#f8fafc', cursor: 'pointer' }}>
                    Publish as Active in Live Steel Catalog
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary-adm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-adm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

