// Unified Admin API & Persistent Storage Layer for Aggarwal Steels
// Reads public data from Supabase; every change and every enquiry read goes through the
// FastAPI backend with the admin's login token (see adminRequest.js).

import { supabase } from './supabase.js';
import { SEED_PRODUCTS, normalizeProduct } from './productsApi';
import { adminRequest } from './adminRequest';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const STORAGE_KEYS = {
  AUTH: 'aggarwal_admin_auth',
  ENQUIRIES: 'aggarwal_admin_enquiries',
  PRODUCTS: 'aggarwal_admin_products',
  SETTINGS: 'aggarwal_admin_settings',
};

const INITIAL_PRODUCTS = SEED_PRODUCTS;

// Helper: FastAPI backend call (returns parsed JSON, or null when offline / error)
async function apiJson(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/v1${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
      ...options,
    });
    if (!res.ok) return null;
    return res.status === 204 ? true : await res.json();
  } catch {
    return null;
  }
}

// Helper: Local Storage wrapper
function getLocal(key, defaultVal) {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    console.warn('Storage read failed:', e);
    return defaultVal;
  }
}

function setLocal(key, val) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage set failed:', e);
  }
}


export const adminApi = {
  // Check whether Supabase or backend is online
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/v1/health`, { signal: AbortSignal.timeout(8000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // -------------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------------
  // Admin sign-in goes through the FastAPI backend, which checks the email +
  // password configured in its environment (ADMIN_EMAIL / ADMIN_PASSWORD).
  async login(email, password) {
    const identifier = (email || '').trim();
    if (!identifier || !password) {
      return { success: false, message: 'Enter your email and password.' };
    }

    let res;
    try {
      // Generous timeout: a sleeping free-tier backend can take ~30-60s to wake.
      res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
        signal: AbortSignal.timeout(60000),
      });
    } catch {
      return { success: false, message: 'Could not reach the server. Please try again in a moment.' };
    }

    let data = {};
    try { data = await res.json(); } catch {}

    if (res.ok && data.access_token) {
      const session = {
        token: data.access_token,
        user: {
          username: data.user?.username || identifier.split('@')[0],
          email: data.user?.email || identifier,
          role: data.user?.role || 'Owner',
          role_key: data.user?.role_key || 'owner',
          desk: data.user?.desk || 'Corporate Faridabad Desk',
        },
        loginTime: Date.now(),
        expiresAt: Date.now() + (data.expires_in || 43200) * 1000,
        mode: 'authenticated',
      };
      setLocal(STORAGE_KEYS.AUTH, session);
      return { success: true, session };
    }

    return { success: false, message: data.detail || 'Invalid email or password.' };
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  },

  getCurrentUser() {
    const session = getLocal(STORAGE_KEYS.AUTH, null);
    if (session?.expiresAt && session.expiresAt < Date.now()) {
      this.logout();
      return null;
    }
    return session;
  },

  isAuthenticated() {
    const session = this.getCurrentUser();
    return Boolean(session && session.token);
  },

  // Re-validates the stored token with the backend. Returns the session, or
  // null (and clears local state) when the server rejects it.
  async refreshSession() {
    const local = this.getCurrentUser();
    if (!local) return null;
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/verify`, {
        headers: { Authorization: `Bearer ${local.token}` },
        signal: AbortSignal.timeout(8000),
      });
      if (res.status === 401) {
        this.logout();
        return null;
      }
      return local;
    } catch {
      return local; // server asleep / offline: keep the cached session
    }
  },

  // -------------------------------------------------------------
  // ENQUIRIES / RFQ DESK
  // -------------------------------------------------------------
  // Enquiries hold customer contact details, so they are only readable through
  // the backend with the admin token. On failure these return null / false and
  // the admin message bar explains why.
  async getEnquiries(filters = {}) {
    const params = new URLSearchParams({ limit: '500' });
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    const res = await adminRequest(`/enquiries?${params.toString()}`);
    return res.ok && Array.isArray(res.data) ? res.data : null;
  },

  async createEnquiry(enquiryData) {
    const res = await adminRequest('/enquiries', {
      method: 'POST',
      body: {
        name: enquiryData.name,
        phone: enquiryData.phone,
        email: enquiryData.email || null,
        product: enquiryData.product || 'General Steel Inquiry',
        message: enquiryData.message || null,
        source: enquiryData.source || 'admin_manual',
        notes: enquiryData.notes || '',
      },
    });
    return res.ok ? res.data : null;
  },

  async updateEnquiryStatus(id, newStatus) {
    return (await adminRequest(`/enquiries/${id}/status`, { method: 'PATCH', body: { status: newStatus } })).ok;
  },

  async updateEnquiry(id, data) {
    return (await adminRequest(`/enquiries/${id}`, { method: 'PUT', body: data })).ok;
  },

  async deleteEnquiry(id) {
    return (await adminRequest(`/enquiries/${id}`, { method: 'DELETE' })).ok;
  },

  async getEnquiryStats({ quiet = false } = {}) {
    const res = await adminRequest('/enquiries/stats', { quiet });
    return res.ok ? res.data : null;
  },

  // -------------------------------------------------------------
  // PRODUCTS & CATALOGUE  (Supabase -> FastAPI -> localStorage)
  // -------------------------------------------------------------
  _productsLocal() {
    return getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS).map(normalizeProduct);
  },

  _productPayload(productData) {
    const slug =
      productData.slug ||
      (productData.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    const list = (v) => (Array.isArray(v) ? v : String(v || '').split(',').map((t) => t.trim()).filter(Boolean));
    return {
      name: productData.name,
      slug,
      category: productData.category || 'Primary Steel Supply & Trading',
      category_slug: productData.category_slug || null,
      subcategory: productData.subcategory || '',
      subcategory_slug: productData.subcategory_slug || null,
      tagline: productData.tagline || '',
      grade: productData.grade || '',
      description: productData.description || '',
      specs: productData.specs || '',
      sizes: productData.sizes || '',
      dispatch: productData.dispatch || '',
      applications: list(productData.applications),
      badge: productData.badge || '',
      image_url: productData.image_url || '/images/product_tmt_bars.jpg',
      gallery: list(productData.gallery),
      tags: list(productData.tags),
      estimated_price_per_ton: parseFloat(productData.estimated_price_per_ton || 0) || 0,
      sort_order: parseInt(productData.sort_order ?? 100, 10) || 0,
      show_on_home: Boolean(productData.show_on_home),
      catalogue_page: productData.catalogue_page === '' || productData.catalogue_page == null ? null : Number(productData.catalogue_page),
      is_active: productData.is_active ?? true,
    };
  },

  async getProducts(filters = {}) {
    // 1. Supabase
    try {
      let query = supabase.from('products').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true });
      if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,grade.ilike.%${filters.search}%,specs.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%`
        );
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        const list = data.map(normalizeProduct);
        setLocal(STORAGE_KEYS.PRODUCTS, list);
        return list;
      }
    } catch {}

    // 2. FastAPI backend
    const params = new URLSearchParams({ limit: '500' });
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    const apiList = await apiJson(`/products?${params.toString()}`);
    if (Array.isArray(apiList)) {
      const list = apiList.map(normalizeProduct);
      setLocal(STORAGE_KEYS.PRODUCTS, list);
      return list;
    }

    // 3. Local fallback
    let list = this._productsLocal();
    if (filters.category && filters.category !== 'all') list = list.filter((i) => i.category === filters.category);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter((i) =>
        [i.name, i.grade, i.specs, i.description, i.tagline].some((v) => v?.toLowerCase().includes(s))
      );
    }
    return list.sort((a, b) => a.sort_order - b.sort_order || (Number(a.id) || 0) - (Number(b.id) || 0));
  },

  // Product changes: backend only, with the admin token. Return the saved row / true,
  // or null / false when the server refused or could not be reached.
  async createProduct(productData) {
    const res = await adminRequest('/products', { method: 'POST', body: this._productPayload(productData) });
    return res.ok ? res.data : null;
  },

  async updateProduct(id, productData) {
    const payload = this._productPayload({ ...this._productsLocal().find((p) => String(p.id) === String(id)), ...productData });
    return (await adminRequest(`/products/${id}`, { method: 'PUT', body: payload })).ok;
  },

  async toggleProductActive(id) {
    return (await adminRequest(`/products/${id}/toggle-active`, { method: 'PATCH' })).ok;
  },

  async deleteProduct(id) {
    return (await adminRequest(`/products/${id}`, { method: 'DELETE' })).ok;
  },

  // -------------------------------------------------------------
  // EXPORT UTILITY
  // -------------------------------------------------------------
  exportCsv(filename, rows) {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map((row) =>
          keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              if (Array.isArray(cell)) cell = cell.join('; ');
              cell = String(cell).replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
              return cell;
            })
            .join(separator)
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
