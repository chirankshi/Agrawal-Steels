'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';

const ORDER_STAGES = [
  'RFQ Received',
  'Quotation Sent',
  'PO Confirmed',
  'Processing at Stockyard / Mill',
  'Ready for Dispatch',
  'In Transit',
  'Delivered',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    tracking_number: '',
    client_name: '',
    phone: '',
    product: '',
    quantity_metric_tons: 25,
    delivery_destination: '',
    stage: 'RFQ Received',
    estimated_delivery_date: '',
    vehicle_number: '',
    notes: '',
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOrders({
        stage: filterStage,
        search: searchTerm,
      });
      setOrders(data);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterStage, searchTerm]);

  const generateTrackingId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `AS-2026-${random}`;
  };

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setFormData({
      tracking_number: generateTrackingId(),
      client_name: '',
      phone: '+91 73000 70778',
      product: 'MS TMT Bars (Fe 550D)',
      quantity_metric_tons: 25,
      delivery_destination: 'Greater Noida Site, Uttar Pradesh',
      stage: 'RFQ Received',
      estimated_delivery_date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      vehicle_number: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ord) => {
    setEditingOrder(ord);
    setFormData({
      tracking_number: ord.tracking_number,
      client_name: ord.client_name,
      phone: ord.phone,
      product: ord.product,
      quantity_metric_tons: ord.quantity_metric_tons,
      delivery_destination: ord.delivery_destination,
      stage: ord.stage,
      estimated_delivery_date: ord.estimated_delivery_date || '',
      vehicle_number: ord.vehicle_number || '',
      notes: ord.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingOrder) {
      await adminApi.updateOrder(editingOrder.id, formData);
    } else {
      await adminApi.createOrder(formData);
    }
    setModalOpen(false);
    loadOrders();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this dispatch tracking record?')) {
      await adminApi.deleteOrder(id);
      loadOrders();
    }
  };

  const handleStageQuickChange = async (id, newStage) => {
    await adminApi.updateOrder(id, { stage: newStage });
    loadOrders();
  };

  const handleExport = () => {
    adminApi.exportCsv('aggarwal_steels_orders_dispatches', orders);
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
      <div className="panel-card">
        {/* Header */}
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">
              Order Dispatches &amp; Real-time Mill Tracking Hub
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              Track shipment milestones, vehicle assignments, weighbridge slips &amp; delivery destinations
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
              <span>Log New Dispatch</span>
            </button>
            <button
              type="button"
              className="btn-secondary-adm"
              onClick={handleExport}
              title="Download CSV"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Strip */}
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
            <button
              type="button"
              className={`filter-tab ${filterStage === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStage('all')}
            >
              All Stages
            </button>
            {ORDER_STAGES.map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-tab ${filterStage === st ? 'active' : ''}`}
                onClick={() => setFilterStage(st)}
              >
                {st}
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
              placeholder="Search tracking #, client, vehicle..."
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
                <th>Tracking Reference</th>
                <th>Client / Project</th>
                <th>Product &amp; Volume</th>
                <th>Destination Site</th>
                <th>Vehicle No</th>
                <th>Delivery Date</th>
                <th>Current Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    {loading ? 'Loading order dispatches...' : 'No orders found matching criteria.'}
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <code style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 800 }}>
                        {ord.tracking_number}
                      </code>
                    </td>
                    <td>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>{ord.client_name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{ord.phone}</span>
                    </td>
                    <td>
                      <div>{ord.product}</div>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                        {ord.quantity_metric_tons} Metric Tonnes
                      </span>
                    </td>
                    <td style={{ maxWidth: '220px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                      {ord.delivery_destination}
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                        {ord.vehicle_number || 'Pending'}
                      </code>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {ord.estimated_delivery_date || 'TBD'}
                    </td>
                    <td>
                      <select
                        value={ord.stage}
                        onChange={(e) => handleStageQuickChange(ord.id, e.target.value)}
                        className={`status-badge ${getStageBadgeClass(ord.stage)}`}
                        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                      >
                        {ORDER_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleOpenEdit(ord)}
                          title="Edit Dispatch Details"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="btn-icon del"
                          onClick={() => handleDelete(ord.id)}
                          title="Delete Order"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingOrder ? 'Edit Dispatch Record' : 'Log New Dispatch Record'}</h3>
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
                    <label>Tracking Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.tracking_number}
                      onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                    />
                  </div>
                  <div className="form-group-adm">
                    <label>&nbsp;</label>
                    <button
                      type="button"
                      className="btn-secondary-adm"
                      onClick={() => setFormData({ ...formData, tracking_number: generateTrackingId() })}
                      style={{ height: '42px', justifyContent: 'center' }}
                    >
                      Regenerate ID
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group-adm">
                    <label>Client / Enterprise Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DLF Cyber City Ltd"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group-adm">
                    <label>Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="form-group-adm">
                    <label>Product *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fe 550D TMT & ISMB Beams"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    />
                  </div>
                  <div className="form-group-adm">
                    <label>Tonnage (MT) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="25"
                      value={formData.quantity_metric_tons}
                      onChange={(e) => setFormData({ ...formData, quantity_metric_tons: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-adm">
                  <label>Receiving Site / Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 65, Golf Course Ext Road, Gurugram"
                    value={formData.delivery_destination}
                    onChange={(e) => setFormData({ ...formData, delivery_destination: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group-adm">
                    <label>Vehicle / Truck Number</label>
                    <input
                      type="text"
                      placeholder="e.g. HR 38 AB 4912"
                      value={formData.vehicle_number}
                      onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                    />
                  </div>
                  <div className="form-group-adm">
                    <label>Estimated Delivery Date</label>
                    <input
                      type="date"
                      value={formData.estimated_delivery_date}
                      onChange={(e) => setFormData({ ...formData, estimated_delivery_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-adm">
                  <label>Fulfillment Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  >
                    {ORDER_STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-adm">
                  <label>Dispatch Notes / MTC References</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Dispatched from Faridabad stockyard with SAIL mill test certificate (MTC)..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
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
                  {editingOrder ? 'Update Dispatch Record' : 'Save & Track Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

