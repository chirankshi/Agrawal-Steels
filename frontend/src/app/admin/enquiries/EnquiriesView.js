'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';
import { FilterCards, Pagination, usePaged } from '../_components/AdminWidgets';

const SOURCE_LABELS = {
  website_rfq_form: 'Home page form',
  instant_quote_modal: 'Instant Quote popup',
  contact_page_rfq: 'Contact page form',
  direct_contact: 'Direct contact',
};

export default function AdminEnquiriesPage() {
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notesInput, setNotesInput] = useState('');

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      setAllEnquiries(await adminApi.getEnquiries({ search: searchTerm }));
    } catch (e) {
      console.error('Error fetching enquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const enquiries = filterStatus === 'all' ? allEnquiries : allEnquiries.filter((e) => e.status === filterStatus);
  const paged = usePaged(enquiries, 10);
  const countOf = (st) => allEnquiries.filter((e) => e.status === st).length;
  const statCards = [
    { key: 'all', label: 'All enquiries', value: allEnquiries.length, accent: '#38bdf8' },
    { key: 'pending', label: 'Pending', value: countOf('pending'), accent: '#f59e0b' },
    { key: 'in_review', label: 'In review', value: countOf('in_review'), accent: '#a78bfa' },
    { key: 'quoted', label: 'Quoted', value: countOf('quoted'), accent: '#10b981' },
    { key: 'closed', label: 'Closed', value: countOf('closed'), accent: '#64748b' },
  ];

  const handleStatusChange = async (id, newStatus) => {
    await adminApi.updateEnquiryStatus(id, newStatus);
    loadEnquiries();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to permanently delete this quotation inquiry?')) {
      await adminApi.deleteEnquiry(id);
      loadEnquiries();
    }
  };

  const handleOpenModal = (enq) => {
    setSelectedEnquiry(enq);
    setNotesInput(enq.notes || enq.message || '');
    setModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    await adminApi.updateEnquiry(selectedEnquiry.id, { notes: notesInput });
    setModalOpen(false);
    loadEnquiries();
  };

  const handleExport = () => {
    adminApi.exportCsv('aggarwal_steels_rfq_enquiries', enquiries);
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

  return (
    <div>
      <FilterCards cards={statCards} active={filterStatus} onSelect={setFilterStatus} />
      <div className="panel-card">
        {/* Header & Controls */}
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">
              Quotation Requests &amp; RFQ Management Desk
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              Real-time inbound inquiries from website contact desk and quotation modal
            </p>
          </div>

          <div className="panel-card-actions">
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
            <button
              type="button"
              className="btn-secondary-adm"
              onClick={loadEnquiries}
              title="Refresh List"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
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
            {['all', 'pending', 'in_review', 'quoted', 'closed'].map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-tab ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
              >
                {st === 'all'
                  ? 'All Inquiries'
                  : st === 'in_review'
                  ? 'In Review'
                  : st.charAt(0).toUpperCase() + st.slice(1)}
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
              placeholder="Search name, phone, product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table-container">
          <table className="data-table compact">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client / Enterprise</th>
                <th>Phone / WhatsApp</th>
                <th>Email</th>
                <th>Product Category</th>
                <th>Came From</th>
                <th>Requirements / Site</th>
                <th>Status</th>
                <th>Date Logged</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    {loading ? 'Fetching inquiries from sales desk...' : 'No inquiries found matching criteria.'}
                  </td>
                </tr>
              ) : (
                paged.slice.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <code style={{ color: '#f59e0b', fontSize: '0.75rem' }}>#{enq.id}</code>
                    </td>
                    <td>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>{enq.name}</strong>
                    </td>
                    <td>
                      <div style={{ color: '#cbd5e1' }}>{enq.phone}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{enq.email || '—'}</span>
                    </td>
                    <td>
                      <span className="badge-category">{enq.product}</span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{SOURCE_LABELS[enq.source] || enq.source || '—'}</td>
                    <td style={{ maxWidth: '280px' }}>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#cbd5e1',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={enq.message || ''}
                      >
                        {enq.message || 'Standard inquiry'}
                      </div>
                      {enq.notes && (
                        <div style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '2px' }}>
                          Note: {enq.notes}
                        </div>
                      )}
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
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {new Date(enq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleOpenModal(enq)}
                          title="View & Edit Notes"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20this%20is%20Aggarwal%20Steels%20Technical%20Sales%20Desk%20regarding%20your%20quotation%20request%20for%20${encodeURIComponent(enq.product)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon wa"
                          title="Chat on WhatsApp"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="btn-icon"
                          title="Call Client"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </a>
                        <button
                          type="button"
                          className="btn-icon del"
                          onClick={() => handleDelete(enq.id)}
                          title="Delete Enquiry"
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
        <Pagination page={paged.page} pages={paged.pages} total={paged.total} pageSize={paged.pageSize} onPage={paged.setPage} noun="enquiries" />
      </div>

      {/* Detail / Notes Modal */}
      {modalOpen && selectedEnquiry && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enquiry Details #{selectedEnquiry.id}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div style={{ background: '#050811', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Client Name</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{selectedEnquiry.name}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Phone:</span>{' '}
                    <strong style={{ color: '#cbd5e1' }}>{selectedEnquiry.phone}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Email:</span>{' '}
                    <strong style={{ color: '#cbd5e1' }}>{selectedEnquiry.email || 'None'}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Product:</span>{' '}
                  <strong style={{ color: '#f59e0b' }}>{selectedEnquiry.product}</strong>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Came from:</span>{' '}
                  <strong style={{ color: '#cbd5e1' }}>{SOURCE_LABELS[selectedEnquiry.source] || selectedEnquiry.source || '—'}</strong>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Original Customer Requirements &amp; Site Details:
                </label>
                <div style={{ background: '#050811', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {selectedEnquiry.message || 'No additional specifications provided.'}
                </div>
              </div>

              <div className="form-group-adm">
                <label htmlFor="deskNotes">Internal Sales Desk Notes &amp; Follow-up</label>
                <textarea
                  id="deskNotes"
                  rows={4}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record quote references, MTC numbers, site visit dates, or rate discussions..."
                />
              </div>

              <div className="form-group-adm">
                <label>Current Status</label>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => {
                    handleStatusChange(selectedEnquiry.id, e.target.value);
                    setSelectedEnquiry({ ...selectedEnquiry, status: e.target.value });
                  }}
                >
                  <option value="pending">Pending (New)</option>
                  <option value="in_review">In Review (Under Estimator)</option>
                  <option value="quoted">Quoted (Rate Slip Sent)</option>
                  <option value="closed">Closed (PO Won / Finalized)</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary-adm"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary-adm"
                onClick={handleSaveNotes}
              >
                Save Desk Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

