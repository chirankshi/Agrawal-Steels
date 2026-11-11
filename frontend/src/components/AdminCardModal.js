'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '../lib/adminApi';
import Link from 'next/link';
import './AdminCardModal.css';

export default function AdminCardModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'orders' | 'products'

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data states
  const [enquiries, setEnquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setMounted(true);
    const authed = adminApi.isAuthenticated();
    setIsAuth(authed);
    if (authed) {
      setUser(adminApi.getCurrentUser());
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAuth && isOpen) {
      loadData();
    }
  }, [isAuth, isOpen, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'enquiries') {
        const data = await adminApi.getEnquiries();
        setEnquiries(data || []);
      } else if (activeTab === 'orders') {
        const data = await adminApi.getOrders();
        setOrders(data || []);
      } else if (activeTab === 'products') {
        const data = await adminApi.getProducts();
        setProducts(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await adminApi.login(username, password);
      if (res.success) {
        setIsAuth(true);
        setUser(adminApi.getCurrentUser());
        setPassword('');
        loadData();
      } else {
        setLoginError(res.message || 'Invalid username or password');
      }
    } catch {
      setLoginError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminApi.logout();
    setIsAuth(false);
    setUser(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    await adminApi.updateEnquiryStatus(id, newStatus);
    setEnquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const handleDeleteEnquiry = async (id) => {
    if (confirm('Delete this enquiry record?')) {
      await adminApi.deleteEnquiry(id);
      setEnquiries(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleToggleProduct = async (id) => {
    await adminApi.toggleProductActive(id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  if (!isOpen || !mounted) return null;

  const filteredEnquiries = enquiries.filter(item => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch = !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.toLowerCase().includes(search.toLowerCase()) ||
      item.product?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="admin-card-overlay" onClick={onClose}>
      <div className="admin-card-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-card-header">
          <div className="admin-card-brand">
            <div className="admin-card-logo">AS</div>
            <div>
              <h3>AGGARWAL STEELS</h3>
              <span className="admin-card-subtitle">Staff Command Desk</span>
            </div>
          </div>
          <div className="admin-card-actions">
            <span className="admin-live-badge">
              <span className="admin-live-dot"></span> Supabase Cloud
            </span>
            <button type="button" className="admin-card-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        {!isAuth ? (
          /* Single Card Login */
          <div className="admin-card-body admin-login-card-body">
            <div className="admin-login-lock-icon">🔒</div>
            <h4>Staff Portal Authentication</h4>
            <p>Access live enquiries, RFQ responses, and dispatches.</p>

            <form onSubmit={handleLogin} className="admin-card-form">
              {loginError && <div className="admin-card-alert">{loginError}</div>}
              
              <div className="admin-card-field">
                <label>Admin Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin or aakash"
                  required
                />
              </div>

              <div className="admin-card-field">
                <label>Staff Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  required
                />
              </div>

              <button type="submit" className="admin-card-submit-btn" disabled={loading}>
                {loading ? 'Authenticating...' : 'Unlock Staff Desk →'}
              </button>

              <div className="admin-login-hint">
                Default: <code>admin</code> / <code>AggarwalSteel@2026</code>
              </div>
            </form>
          </div>
        ) : (
          /* Single Card Dashboard View */
          <div className="admin-card-body admin-dash-card-body">
            {/* Top Toolbar */}
            <div className="admin-card-nav-row">
              <div className="admin-card-tabs">
                <button
                  type="button"
                  className={`admin-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
                  onClick={() => setActiveTab('enquiries')}
                >
                  📋 Enquiries ({enquiries.length})
                </button>
                <button
                  type="button"
                  className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  🚚 Dispatches ({orders.length})
                </button>
                <button
                  type="button"
                  className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  📦 Products ({products.length})
                </button>
              </div>

              <div className="admin-user-pill">
                <span>{user?.user?.username || 'admin'}</span>
                <button type="button" onClick={handleLogout} className="admin-btn-logout-mini" title="Sign Out">
                  Sign Out
                </button>
              </div>
            </div>

            {/* Tab: Enquiries */}
            {activeTab === 'enquiries' && (
              <div className="admin-tab-content">
                <div className="admin-tab-filter-bar">
                  <input
                    type="text"
                    placeholder="Search client, phone, or product..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="admin-card-search"
                  />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="admin-card-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="admin-card-list">
                  {loading ? (
                    <div className="admin-loading-state">Loading enquiries from Supabase...</div>
                  ) : filteredEnquiries.length === 0 ? (
                    <div className="admin-empty-state">No enquiries found.</div>
                  ) : (
                    filteredEnquiries.map(item => (
                      <div key={item.id} className="admin-enquiry-card">
                        <div className="admin-enquiry-header">
                          <div>
                            <strong>{item.name}</strong>
                            <span className="admin-enquiry-phone">{item.phone}</span>
                          </div>
                          <select
                            value={item.status || 'pending'}
                            onChange={e => handleStatusChange(item.id, e.target.value)}
                            className={`admin-status-badge status-${item.status || 'pending'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_review">In Review</option>
                            <option value="quoted">Quoted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                        <div className="admin-enquiry-product">📦 {item.product}</div>
                        {item.message && <div className="admin-enquiry-msg">{item.message}</div>}
                        <div className="admin-enquiry-footer">
                          <span className="admin-enquiry-time">
                            {new Date(item.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <div className="admin-enquiry-actions">
                            <a
                              href={`https://wa.me/${(item.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${item.name}, thank you for reaching out to Aggarwal Steels regarding "${item.product}".`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-btn-action whatsapp"
                            >
                              WhatsApp
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteEnquiry(item.id)}
                              className="admin-btn-action delete"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="admin-tab-content">
                <div className="admin-card-list">
                  {orders.map(order => (
                    <div key={order.id} className="admin-enquiry-card">
                      <div className="admin-enquiry-header">
                        <div>
                          <strong>{order.client_name}</strong>
                          <span className="admin-enquiry-phone">#{order.tracking_number}</span>
                        </div>
                        <span className="admin-status-badge status-quoted">{order.stage}</span>
                      </div>
                      <div className="admin-enquiry-product">📦 {order.product} ({order.quantity_metric_tons} MT)</div>
                      <div className="admin-enquiry-msg">📍 {order.delivery_destination} | 🚚 {order.vehicle_number || 'Unassigned'}</div>
                      <div className="admin-enquiry-footer">
                        <span>ETA: {order.estimated_delivery_date || 'TBD'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Products */}
            {activeTab === 'products' && (
              <div className="admin-tab-content">
                <div className="admin-card-list">
                  {products.map(product => (
                    <div key={product.id} className="admin-enquiry-card">
                      <div className="admin-enquiry-header">
                        <div>
                          <strong>{product.name}</strong>
                          <span className="admin-enquiry-phone">{product.category}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleProduct(product.id)}
                          className={`admin-status-badge ${product.is_active ? 'status-closed' : 'status-pending'}`}
                        >
                          {product.is_active ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                      <div className="admin-enquiry-msg">Price: ₹{product.estimated_price_per_ton?.toLocaleString('en-IN') || 0} / MT</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card Footer */}
            <div className="admin-card-bottom-bar">
              <Link href="/admin" target="_blank" className="admin-full-page-link">
                Open Full Screen Dashboard ↗
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
