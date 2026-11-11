'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '../../lib/adminApi';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    enquiries: { total: 0, pending: 0, in_review: 0, quoted: 0, closed: 0 },
    orders: { total: 0, total_tonnage: 0, in_transit: 0, processing: 0, ready_dispatch: 0, delivered: 0 },
    productsTotal: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [enqStats, ordStats, enqList, ordList, prodList] = await Promise.all([
        adminApi.getEnquiryStats(),
        adminApi.getOrderStats(),
        adminApi.getEnquiries({ limit: 5 }),
        adminApi.getOrders({ limit: 5 }),
        adminApi.getProducts(),
      ]);

      setStats({
        enquiries: enqStats,
        orders: ordStats,
        productsTotal: prodList.length,
      });
      setRecentEnquiries(enqList.slice(0, 5));
      setActiveOrders(ordList.slice(0, 5));
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await adminApi.updateEnquiryStatus(id, newStatus);
    loadData();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'in_review': return 'badge-in_review';
      case 'quoted': return 'badge-quoted';
      case 'closed': return 'badge-closed';
      default: return '';
    }
  };

  const getStageBadgeClass = (stage) => {
    switch (stage) {
      case 'In Transit': return 'badge-in_transit';
      case 'Ready for Dispatch': return 'badge-quoted';
      case 'Processing at Stockyard / Mill': return 'badge-in_review';
      case 'Delivered': return 'badge-closed';
      default: return 'badge-pending';
    }
  };

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Quotation Requests</span>
            <div className="stat-card-icon icon-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats.enquiries.total}</div>
          <div className="stat-card-footer">
            <strong>{stats.enquiries.pending} Pending</strong> action &bull; {stats.enquiries.quoted} Quoted
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Active Tonnage</span>
            <div className="stat-card-icon icon-cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="m17 5-5-3-5 3" />
                <path d="m17 19-5 3-5-3" />
                <path d="M2 12h20" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats.orders.total_tonnage} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>MT</span></div>
          <div className="stat-card-footer">
            Across <strong>{stats.orders.total}</strong> active dispatches &amp; contracts
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Live Dispatches</span>
            <div className="stat-card-icon icon-emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18.5" r="2.5" />
                <circle cx="6.5" cy="18.5" r="2.5" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats.orders.in_transit}</div>
          <div className="stat-card-footer">
            <strong>{stats.orders.ready_dispatch} Ready</strong> for loading &bull; {stats.orders.delivered} Delivered
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Catalog Inventory</span>
            <div className="stat-card-icon icon-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats.productsTotal}</div>
          <div className="stat-card-footer">
            Raw Steel, TMT &amp; Heavy Racking lines
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Link href="/admin/enquiries" className="btn-primary-adm">
          <span>Manage RFQs</span>
          {stats.enquiries.pending > 0 && (
            <span style={{ background: '#050811', color: '#f59e0b', padding: '1px 6px', borderRadius: '99px', fontSize: '0.7rem' }}>
              {stats.enquiries.pending} New
            </span>
          )}
        </Link>
        <Link href="/admin/orders" className="btn-secondary-adm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Log New Dispatch</span>
        </Link>
        <Link href="/admin/products" className="btn-secondary-adm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Steel Product</span>
        </Link>
        <Link href="/admin/reports" className="btn-secondary-adm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          <span>Download Reports (CSV)</span>
        </Link>
      </div>

      {/* Recent Enquiries Table */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h3 className="panel-card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Recent Quotation Requests &amp; Inquiries
          </h3>
          <Link href="/admin/enquiries" className="btn-header-link">
            <span>View All ({stats.enquiries.total})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client / Company</th>
                <th>Contact</th>
                <th>Product Requested</th>
                <th>Status</th>
                <th>Logged At</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    {loading ? 'Fetching inquiries...' : 'No inquiries logged yet.'}
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>{enq.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Ref #{enq.id}</span>
                    </td>
                    <td>
                      <div style={{ color: '#cbd5e1' }}>{enq.phone}</div>
                      {enq.email && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{enq.email}</div>}
                    </td>
                    <td>
                      <span className="badge-category">{enq.product}</span>
                    </td>
                    <td>
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`status-badge ${getStatusBadgeClass(enq.status)}`}
                        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_review">In Review</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(enq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20regarding%20your%20quotation%20request%20for%20${encodeURIComponent(enq.product)}%20at%20Aggarwal%20Steels...`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon wa"
                          title="WhatsApp Client"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="btn-icon"
                          title="Direct Call"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Dispatches Table */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h3 className="panel-card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
              <path d="M15 18H9" />
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
              <circle cx="17" cy="18.5" r="2.5" />
              <circle cx="6.5" cy="18.5" r="2.5" />
            </svg>
            Active Order Dispatches &amp; Mill Tracking
          </h3>
          <Link href="/admin/orders" className="btn-header-link">
            <span>View All Dispatches ({stats.orders.total})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>Client / Project</th>
                <th>Product &amp; Tonnage</th>
                <th>Destination Site</th>
                <th>Vehicle No</th>
                <th>Fulfillment Stage</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    {loading ? 'Fetching dispatches...' : 'No orders logged yet.'}
                  </td>
                </tr>
              ) : (
                activeOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <code style={{ color: '#f59e0b', fontWeight: 800 }}>{ord.tracking_number}</code>
                    </td>
                    <td>
                      <strong style={{ color: '#f8fafc' }}>{ord.client_name}</strong>
                    </td>
                    <td>
                      <div>{ord.product}</div>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                        {ord.quantity_metric_tons} Metric Tonnes
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      {ord.delivery_destination}
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                        {ord.vehicle_number || 'Pending Assignment'}
                      </code>
                    </td>
                    <td>
                      <span className={`status-badge ${getStageBadgeClass(ord.stage)}`}>
                        {ord.stage}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

