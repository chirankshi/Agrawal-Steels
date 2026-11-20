'use client';
import { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/adminApi';
import { adminRequest, adminMessage, AUTH_STORAGE_KEY } from '../../../lib/adminRequest';

const ROLE_LABEL = { staff: 'Sales Staff', manager: 'Manager' };
const EMPTY = { name: '', email: '', role: 'staff', password: '' };

/** A readable temporary password, e.g. "Steel-4821-Kite". */
function tempPassword() {
  const words = ['Steel', 'Rack', 'Beam', 'Plate', 'Coil', 'Forge', 'Kite', 'River', 'Stone', 'Tower'];
  const pick = () => words[Math.floor(Math.random() * words.length)];
  return `${pick()}-${1000 + Math.floor(Math.random() * 9000)}-${pick()}`;
}

function fmt(d) {
  return d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never';
}

/** Owner: add, reset, disable and remove staff logins. Staff: change their own password. */
export default function TeamView() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [shown, setShown] = useState(null); // { email, password } after create / reset
  const [pw, setPw] = useState({ current_password: '', new_password: '', confirm: '' });

  const isOwner = (me?.user?.role_key || 'owner') === 'owner';

  const load = async () => {
    setLoading(true);
    const res = await adminRequest('/auth/users');
    if (res.ok) setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    const session = adminApi.getCurrentUser();
    setMe(session);
    if ((session?.user?.role_key || 'owner') === 'owner') load();
    else setLoading(false);
  }, []);

  const create = async (e) => {
    e.preventDefault();
    const res = await adminRequest('/auth/users', { method: 'POST', body: { ...form, email: form.email.trim() } });
    if (!res.ok) return;
    setShown({ email: res.data.email, password: form.password });
    setForm(null);
    load();
  };

  const update = async (u, patch, message) => {
    const res = await adminRequest(`/auth/users/${u.id}`, { method: 'PUT', body: patch });
    if (res.ok) {
      if (message) adminMessage(message, 'success');
      load();
    }
    return res.ok;
  };

  const reset = async (u) => {
    const password = tempPassword();
    if (await update(u, { password })) setShown({ email: u.email, password });
  };

  const remove = async (u) => {
    if (!confirm(`Remove ${u.name}'s login? Their notes stay in the enquiry history.`)) return;
    const res = await adminRequest(`/auth/users/${u.id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  const changeOwn = async (e) => {
    e.preventDefault();
    if (pw.new_password !== pw.confirm) { adminMessage('The two new passwords do not match.'); return; }
    const res = await adminRequest('/auth/password', { method: 'POST', body: { current_password: pw.current_password, new_password: pw.new_password } });
    if (!res.ok) return;
    try {
      const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
      session.token = res.data.access_token;
      session.expiresAt = Date.now() + res.data.expires_in * 1000;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch { /* ignore */ }
    setPw({ current_password: '', new_password: '', confirm: '' });
    adminMessage('Password changed. Other devices signed in with the old password are now signed out.', 'success');
  };

  if (!isOwner) {
    return (
      <div className="panel-card" style={{ maxWidth: 560 }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">My Account</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
              Signed in as <strong>{me?.user?.email}</strong> ({me?.user?.role}).
            </p>
          </div>
        </div>
        <form onSubmit={changeOwn} className="settings-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-group-adm"><label htmlFor="pwCur">Current password</label><input id="pwCur" type="password" required value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} autoComplete="current-password" /></div>
          <div className="form-group-adm"><label htmlFor="pwNew">New password (8+ characters)</label><input id="pwNew" type="password" required minLength={8} value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} autoComplete="new-password" /></div>
          <div className="form-group-adm"><label htmlFor="pwNew2">Repeat new password</label><input id="pwNew2" type="password" required minLength={8} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" /></div>
          <div><button type="submit" className="btn-primary-adm">Change password</button></div>
        </form>
      </div>
    );
  }

  return (
    <div>
      {shown && (
        <div className="panel-card team-credentials">
          <div>
            <strong>Login details for {shown.email}</strong>
            <p>Share these privately. This password is shown only once; they can change it under My Account.</p>
          </div>
          <code>{shown.email}<br />{shown.password}</code>
          <div className="action-btn-group">
            <button type="button" className="btn-secondary-adm" onClick={() => { navigator.clipboard?.writeText(`Admin: ${window.location.origin}/admin/login\nEmail: ${shown.email}\nPassword: ${shown.password}`).then(() => adminMessage('Copied.', 'success'), () => {}); }}>Copy</button>
            <button type="button" className="btn-secondary-adm" onClick={() => setShown(null)}>Done</button>
          </div>
        </div>
      )}

      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-card-title">Team &amp; Logins</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
              Each person gets their own login, so enquiry notes and status changes show who made them.
              Team members can use every admin screen except this one.
            </p>
          </div>
          <div className="panel-card-actions">
            <button type="button" className="btn-primary-adm" onClick={() => setForm({ ...EMPTY, password: tempPassword() })}>+ Add team member</button>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table compact">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Last sign-in</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <tr>
                <td><strong style={{ color: 'var(--adm-text-main)' }}>{me?.user?.username || 'Owner'}</strong></td>
                <td>{me?.user?.email}</td>
                <td><span className="badge-category">Owner</span></td>
                <td style={{ color: 'var(--adm-text-muted)' }}>This session</td>
                <td><span className="status-badge badge-closed">Live</span></td>
                <td style={{ fontSize: '0.72rem', color: 'var(--adm-text-dim)' }}>Password is set on the server</td>
              </tr>
              {users.map((u) => (
                <tr key={u.id} style={u.is_active ? undefined : { opacity: 0.55 }}>
                  <td><strong style={{ color: 'var(--adm-text-main)' }}>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => update(u, { role: e.target.value })} className="enq-assignee-filter">
                      <option value="staff">Sales Staff</option>
                      <option value="manager">Manager</option>
                    </select>
                  </td>
                  <td style={{ color: 'var(--adm-text-muted)', whiteSpace: 'nowrap' }}>{fmt(u.last_login_at)}</td>
                  <td>
                    <button type="button" className={`status-badge ${u.is_active ? 'badge-closed' : 'badge-pending'}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => update(u, { is_active: !u.is_active }, u.is_active ? `${u.name} can no longer sign in.` : `${u.name} can sign in again.`)}>
                      {u.is_active ? 'Live' : 'Disabled'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btn-group">
                      <button type="button" className="btn-secondary-adm" style={{ padding: '4px 10px', fontSize: '0.72rem' }} onClick={() => reset(u)}>Reset password</button>
                      <button type="button" className="btn-icon del" title="Remove login" onClick={() => remove(u)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--adm-text-muted)' }}>No team members yet. Add your sales staff so each person signs in with their own login.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-dialog" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Add team member</h3><button type="button" className="modal-close-btn" onClick={() => setForm(null)}>&times;</button></div>
            <form onSubmit={create}>
              <div className="modal-body">
                <div className="form-group-adm"><label htmlFor="tmName">Name</label><input id="tmName" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma" /></div>
                <div className="form-group-adm"><label htmlFor="tmEmail">Email (their login)</label><input id="tmEmail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter work email" /></div>
                <div className="form-group-adm"><label htmlFor="tmRole">Role</label>
                  <select id="tmRole" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group-adm"><label htmlFor="tmPw">Temporary password</label><input id="tmPw" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-adm" onClick={() => setForm(null)}>Cancel</button>
                <button type="submit" className="btn-primary-adm">Create login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
