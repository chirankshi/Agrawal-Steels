// Unified Admin API & Persistent Storage Layer for Aggarwal Steels
// Connects to Supabase Cloud PostgreSQL with automatic offline/client-side storage fallback

import { supabase } from './supabase.js';
import { SEED_PRODUCTS, normalizeProduct } from './productsApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const STORAGE_KEYS = {
  AUTH: 'aggarwal_admin_auth',
  ENQUIRIES: 'aggarwal_admin_enquiries',
  PRODUCTS: 'aggarwal_admin_products',
  SETTINGS: 'aggarwal_admin_settings',
};

// Seed initial enquiries if none exist in local storage
const INITIAL_ENQUIRIES = [
  {
    id: 101,
    name: "Ramesh Kumar / Infra Corp",
    phone: "+91 98765 43210",
    email: "ramesh@infracorp.co.in",
    product: "Multi-Tier Mezzanine Floor Systems",
    message: "Requirement for 12,000 sq ft industrial mezzanine floor at Greater Noida site. Load requirement 500 kg/sqm.",
    status: "pending",
    source: "website_rfq_form",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: "Site visit proposed for Wednesday."
  },
  {
    id: 102,
    name: "Sunil Verma / Larsen Infrastructure",
    phone: "+91 98112 34567",
    email: "s.verma@larseninfra.com",
    product: "MS TMT Bars (Fe 415 / 500D / 550D)",
    message: "Urgent quote needed for 120 MT Fe 550D TMT (16mm & 20mm primary mill) for bridge expansion project.",
    status: "in_review",
    source: "instant_quote_modal",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: "SAIL / TATA approved make requested."
  },
  {
    id: 103,
    name: "Vikram Malhotra / Apex Logistics Park",
    phone: "+91 99887 76655",
    email: "vikram@apexlogistics.in",
    product: "Heavy Duty Warehouse Storage Racks",
    message: "Pallet racking system for 3,400 pallet positions, clear height 9.5 meters. Manesar warehouse.",
    status: "quoted",
    source: "website_rfq_form",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    notes: "Quotation ref AS-Q-2026-089 sent via WhatsApp & email. Awaiting client review."
  },
  {
    id: 104,
    name: "Amit Singhania / Singhania Fabrication",
    phone: "+91 97123 45678",
    email: "amit@singhaniafab.com",
    product: "HR Plates & Coils (IS 2062)",
    message: "45 MT IS 2062 E250 HR plates (12mm and 16mm thickness) delivered to Bhiwadi factory.",
    status: "closed",
    source: "direct_contact",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    notes: "PO Confirmed and dispatched on Vehicle HR 38 AB 4912."
  },
  {
    id: 105,
    name: "Deepak Choudhary / Metro Precast Ltd",
    phone: "+91 98223 34455",
    email: "d.choudhary@metroprecast.com",
    product: "MS Channels (ISMC 75 to 400)",
    message: "ISMC 150 & 200 channels 30 MT with test certificates.",
    status: "pending",
    source: "website_rfq_form",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    notes: "Follow up required regarding delivery schedule."
  }
];

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
      const { error } = await supabase.from('enquiries').select('id').limit(1);
      if (!error) return true;
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/api/v1/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(1500),
      });
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
          role: data.user?.role || 'Super Admin',
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
  async getEnquiries(filters = {}) {
    let list = [];

    // 1. Try Supabase Cloud DB
    try {
      let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,product.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data;
        setLocal(STORAGE_KEYS.ENQUIRIES, list);
        return list;
      }
    } catch (e) {
      console.warn('Supabase enquiries fetch failed, trying local fallback:', e);
    }

    // 2. Fallback: LocalStorage
    list = getLocal(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);

    if (filters.status && filters.status !== 'all') {
      list = list.filter((item) => item.status === filters.status);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name?.toLowerCase().includes(s) ||
          i.phone?.toLowerCase().includes(s) ||
          i.email?.toLowerCase().includes(s) ||
          i.product?.toLowerCase().includes(s) ||
          i.message?.toLowerCase().includes(s)
      );
    }

    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  },

  async createEnquiry(enquiryData) {
    const payload = {
      name: enquiryData.name,
      phone: enquiryData.phone,
      email: enquiryData.email || null,
      product: enquiryData.product || 'General Steel Inquiry',
      message: enquiryData.message || null,
      status: enquiryData.status || 'pending',
      source: enquiryData.source || 'website_rfq_form',
      notes: enquiryData.notes || '',
    };

    try {
      const { data, error } = await supabase.from('enquiries').insert([payload]).select().single();
      if (!error && data) {
        const all = getLocal(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
        setLocal(STORAGE_KEYS.ENQUIRIES, [data, ...all]);
        return data;
      }
    } catch {}

    const all = getLocal(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const fallback = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    setLocal(STORAGE_KEYS.ENQUIRIES, [fallback, ...all]);
    return fallback;
  },

  async updateEnquiryStatus(id, newStatus) {
    try {
      await supabase
        .from('enquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch {}

    const all = getLocal(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const updated = all.map((item) =>
      item.id === Number(id) ? { ...item, status: newStatus, updated_at: new Date().toISOString() } : item
    );
    setLocal(STORAGE_KEYS.ENQUIRIES, updated);
    return true;
  },

  async updateEnquiry(id, data) {
    try {
      await supabase
        .from('enquiries')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch {}

    const all = getLocal(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const updated = all.map((item) =>
      item.id === Number(id) ? { ...item, ...data, updated_at: new Date().toISOString() } : item
    );
    setLocal(STORAGE_KEYS.ENQUIRIES, updated);
    return true;
  },

  async deleteEnquiry(id) {
    try {
      await supabase.from('enquiries').delete().eq('id', id);
    } catch {}

    const all = getLocal(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const filtered = all.filter((item) => item.id !== Number(id));
    setLocal(STORAGE_KEYS.ENQUIRIES, filtered);
    return true;
  },

  async getEnquiryStats() {
    try {
      const { data, error } = await supabase.from('enquiries').select('status');
      if (!error && Array.isArray(data)) {
        return {
          total: data.length,
          pending: data.filter((i) => i.status === 'pending').length,
          in_review: data.filter((i) => i.status === 'in_review').length,
          quoted: data.filter((i) => i.status === 'quoted').length,
          closed: data.filter((i) => i.status === 'closed').length,
        };
      }
    } catch {}

    const all = getLocal(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    return {
      total: all.length,
      pending: all.filter((i) => i.status === 'pending').length,
      in_review: all.filter((i) => i.status === 'in_review').length,
      quoted: all.filter((i) => i.status === 'quoted').length,
      closed: all.filter((i) => i.status === 'closed').length,
    };
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

  async createProduct(productData) {
    const payload = this._productPayload(productData);

    try {
      const { data, error } = await supabase.from('products').insert([payload]).select().single();
      if (!error && data) {
        setLocal(STORAGE_KEYS.PRODUCTS, [normalizeProduct(data), ...this._productsLocal()]);
        return data;
      }
    } catch {}

    const created = await apiJson('/products', { method: 'POST', body: JSON.stringify(payload) });
    if (created && created.id) {
      setLocal(STORAGE_KEYS.PRODUCTS, [normalizeProduct(created), ...this._productsLocal()]);
      return created;
    }

    const newRecord = normalizeProduct({ id: Date.now(), ...payload, created_at: new Date().toISOString() });
    setLocal(STORAGE_KEYS.PRODUCTS, [newRecord, ...this._productsLocal()]);
    return newRecord;
  },

  async updateProduct(id, productData) {
    const payload = this._productPayload({ ...this._productsLocal().find((p) => String(p.id) === String(id)), ...productData });

    let saved = false;
    try {
      const { error } = await supabase.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
      saved = !error;
    } catch {}
    if (!saved) saved = Boolean(await apiJson(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }));

    setLocal(
      STORAGE_KEYS.PRODUCTS,
      this._productsLocal().map((item) => (String(item.id) === String(id) ? normalizeProduct({ ...item, ...payload }) : item))
    );
    return true;
  },

  async toggleProductActive(id) {
    const all = this._productsLocal();
    const existing = all.find((item) => String(item.id) === String(id));
    const nextState = existing ? !existing.is_active : false;

    let saved = false;
    try {
      const { error } = await supabase.from('products').update({ is_active: nextState }).eq('id', id);
      saved = !error;
    } catch {}
    if (!saved) await apiJson(`/products/${id}/toggle-active`, { method: 'PATCH' });

    setLocal(STORAGE_KEYS.PRODUCTS, all.map((item) => (String(item.id) === String(id) ? { ...item, is_active: nextState } : item)));
    return true;
  },

  async deleteProduct(id) {
    let saved = false;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      saved = !error;
    } catch {}
    if (!saved) await apiJson(`/products/${id}`, { method: 'DELETE' });

    setLocal(STORAGE_KEYS.PRODUCTS, this._productsLocal().filter((item) => String(item.id) !== String(id)));
    return true;
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
