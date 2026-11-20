'use client';
/**
 * Every admin change goes through the FastAPI backend with the admin's login
 * token. The database only lets the public website read products/catalogue and
 * submit enquiries, so nothing here may write to Supabase with the public key.
 *
 * Failures are reported through a window event that AdminShell shows as a
 * message bar, so screens don't need their own error handling to stay honest.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const AUTH_STORAGE_KEY = 'aggarwal_admin_auth';
export const ADMIN_MESSAGE_EVENT = 'aggarwal-admin-message';

export function adminToken() {
  if (typeof window === 'undefined') return null;
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
    if (!session?.token || (session.expiresAt && session.expiresAt < Date.now())) return null;
    return session.token;
  } catch {
    return null;
  }
}

/** Shows a message in the admin message bar. kind: 'error' | 'success'. */
export function adminMessage(text, kind = 'error') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(ADMIN_MESSAGE_EVENT, { detail: { text, kind, at: Date.now() } }));
}

/**
 * Calls the backend as the signed-in admin.
 * @param {string} path  e.g. '/products/3'
 * @param {{method?: string, body?: any, form?: FormData, timeout?: number, quiet?: boolean}} opts
 * @returns {Promise<{ok: boolean, status: number, data: any, error?: string}>}
 */
export async function adminRequest(path, { method = 'GET', body, form, timeout = 60000, quiet = false } = {}) {
  const token = adminToken();
  if (!token) {
    const error = 'Your admin session has ended. Please sign in again.';
    if (!quiet) adminMessage(error);
    return { ok: false, status: 401, data: null, error };
  }

  const headers = { Authorization: `Bearer ${token}` };
  if (body !== undefined && !form) headers['Content-Type'] = 'application/json';

  let res;
  try {
    // Generous timeout: the free-tier backend can take up to a minute to wake up.
    res = await fetch(`${API_BASE}/api/v1${path}`, {
      method,
      headers,
      body: form || (body !== undefined ? JSON.stringify(body) : undefined),
      signal: AbortSignal.timeout(timeout),
    });
  } catch {
    const error = 'Could not reach the server, so nothing was saved. Please try again in a minute.';
    if (!quiet) adminMessage(error);
    return { ok: false, status: 0, data: null, error };
  }

  let data = null;
  if (res.status !== 204) {
    try { data = await res.json(); } catch { /* empty body */ }
  }

  if (res.ok) return { ok: true, status: res.status, data: data ?? true };

  const detail = typeof data?.detail === 'string' ? data.detail : Array.isArray(data?.detail) ? data.detail.map((d) => d.msg).join(', ') : '';
  const error = res.status === 401
    ? 'Your admin session has ended. Please sign in again.'
    : `Not saved: ${detail || `server error ${res.status}`}`;
  if (!quiet) adminMessage(error);
  return { ok: false, status: res.status, data, error };
}
