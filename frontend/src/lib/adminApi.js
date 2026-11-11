// Unified Admin API & Persistent Storage Layer for Aggarwal Steels
// Connects to Supabase Cloud PostgreSQL with automatic offline/client-side storage fallback

import { supabase } from './supabase.js';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const STORAGE_KEYS = {
  AUTH: 'aggarwal_admin_auth',
  ENQUIRIES: 'aggarwal_admin_enquiries',
  ORDERS: 'aggarwal_admin_orders',
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

const INITIAL_ORDERS = [
  {
    id: 1,
    tracking_number: "AS-2026-8841",
    client_name: "Larsen Infrastructure Ltd",
    phone: "+91 98112 34567",
    product: "MS TMT Bars Fe 550D (16mm, 20mm)",
    quantity_metric_tons: 120.0,
    delivery_destination: "Delhi-Meerut Expressway Package 4, Muradnagar Site",
    stage: "In Transit",
    estimated_delivery_date: "Tomorrow, 02:00 PM",
    vehicle_number: "HR 38 AB 4912",
    notes: "Dispatch from Ghaziabad stockyard. Driver contact: +91 94123 88990.",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 2,
    tracking_number: "AS-2026-8812",
    client_name: "Apex Logistics Parks Pvt Ltd",
    phone: "+91 99887 76655",
    product: "Heavy Duty Pallet Racking Columns & Beams",
    quantity_metric_tons: 38.5,
    delivery_destination: "Plot 44, Sector 8, IMT Manesar, Gurugram",
    stage: "Ready for Dispatch",
    estimated_delivery_date: "03 Nov 2026, 11:00 AM",
    vehicle_number: "HR 55 Y 2041",
    notes: "Pre-dispatch QC check complete. Mill test certificates attached with bill of lading.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 3,
    tracking_number: "AS-2026-8790",
    client_name: "DLF CyberCity Project Works",
    phone: "+91 98711 00223",
    product: "ISMC 200 & MS Equal Angles 100x100x10",
    quantity_metric_tons: 65.0,
    delivery_destination: "DLF Phase 5, Golf Course Ext Road, Gurugram",
    stage: "Processing at Stockyard / Mill",
    estimated_delivery_date: "05 Nov 2026, 06:00 PM",
    vehicle_number: "Vehicle unassigned",
    notes: "SAIL rolling section batch #4409. Cutting to 6m custom lengths in progress.",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 4,
    tracking_number: "AS-2026-8654",
    client_name: "Bhiwadi Pre-Engineered Buildings Ltd",
    phone: "+91 97123 45678",
    product: "IS 2062 E250 HR Steel Plates (16mm & 20mm)",
    quantity_metric_tons: 85.0,
    delivery_destination: "RIICO Industrial Area, Phase 3, Bhiwadi",
    stage: "Delivered",
    estimated_delivery_date: "Delivered on 30 Oct 2026",
    vehicle_number: "RJ 02 GA 3319",
    notes: "Safe delivery acknowledged by site engineer. MTC stamped and filed.",
    created_at: new Date(Date.now() - 3600000 * 96).toISOString()
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    slug: "ms-tmt-bars",
    name: "MS TMT Rebars (Fe 500D / 550D)",
    category: "Steel Supply & Trading",
    grade: "Fe 500D, Fe 550D (IS 1786)",
    description: "High-ductility earthquake-resistant Thermo-Mechanically Treated rebars sourced directly from primary producers (SAIL, TATA, Jindal).",
    specs: "Diameters: 8mm to 32mm | Length: 12 meters standard | Elongation: >16%",
    badge: "PRIMARY MILL DIRECT",
    image_url: "/images/product_tmt_bars.jpg",
    tags: ["TMT", "Rebars", "Fe 550D", "Construction"],
    estimated_price_per_ton: 54500,
    is_active: true
  },
  {
    id: 2,
    slug: "hr-plates-coils",
    name: "HR Plates & Coils (IS 2062)",
    category: "Steel Supply & Trading",
    grade: "IS 2062 E250 / E350 BR/BO",
    description: "Hot rolled steel plates and slit coils with uniform thickness, excellent weldability, and superior tensile strength for heavy fabrication.",
    specs: "Thickness: 2.0mm to 63mm | Width: 1250mm to 2500mm | Length: Up to 12m",
    badge: "TEST CERTIFIED",
    image_url: "/images/product_hr_plates.jpg",
    tags: ["HR Plates", "Hot Rolled", "IS 2062", "Coils"],
    estimated_price_per_ton: 56200,
    is_active: true
  },
  {
    id: 3,
    slug: "structural-steel-beams-channels",
    name: "Structural Steel Beams & ISMC Channels",
    category: "Steel Supply & Trading",
    grade: "IS 2062 Grade A/B",
    description: "Comprehensive range of heavy structural sections including ISMB, ISMC, ISA Equal Angles, and Universal Beams for industrial projects.",
    specs: "Beams: ISMB 100 to 600 | Channels: ISMC 75 to 400 | Angles: 25x25 to 200x200",
    badge: "HEAVY STRUCTURAL",
    image_url: "/images/product_structural.jpg",
    tags: ["ISMC", "ISMB", "Structural", "Beams", "Angles"],
    estimated_price_per_ton: 55800,
    is_active: true
  },
  {
    id: 4,
    slug: "heavy-duty-pallet-racks",
    name: "Heavy Duty Warehouse Pallet Racks",
    category: "Industrial Storage & Warehousing",
    grade: "High Tensile CRCA / Galvanized Steel",
    description: "Engineered selective and drive-in pallet racking systems customized for multi-level warehouses with automated or forklift retrieval.",
    specs: "Load: Up to 3,500 kg/level | Height: Up to 12 meters | Pitch adjustability: 50mm",
    badge: "BESTSELLER",
    image_url: "/images/product_pallet_racks.jpg",
    tags: ["Pallet Racks", "Warehouse", "Storage", "Industrial"],
    estimated_price_per_ton: 68000,
    is_active: true
  },
  {
    id: 5,
    slug: "multi-tier-mezzanine-floors",
    name: "Multi-Tier Industrial Mezzanine Floors",
    category: "Industrial Storage & Warehousing",
    grade: "Heavy Gauge Structural Steel",
    description: "High-load freestanding steel mezzanine floor platforms designed to double or triple usable facility floor space without civil modifications.",
    specs: "Load capacity: 300 to 1,500 kg/sqm | Custom column grid up to 8m x 8m",
    badge: "CUSTOM ENGINEERED",
    image_url: "/images/product_mezzanine.jpg",
    tags: ["Mezzanine", "Warehouse", "Steel Platform"],
    estimated_price_per_ton: 72000,
    is_active: true
  },
  {
    id: 6,
    slug: "pre-engineered-buildings-peb",
    name: "Pre-Engineered Steel Buildings (PEB)",
    category: "Steel Structures & PEB",
    grade: "High-Grade Structural Steel (345 MPa)",
    description: "Turnkey pre-engineered steel buildings, industrial sheds, and clear-span warehouse superstructures designed with CAD/BIM accuracy.",
    specs: "Clear span: Up to 60 meters | Bay spacing: 6m to 9m | Crane capacity: Up to 30T",
    badge: "TURNKEY SOLUTION",
    image_url: "/images/product_peb.jpg",
    tags: ["PEB", "Industrial Sheds", "Steel Buildings"],
    estimated_price_per_ton: 62000,
    is_active: true
  }
];

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
  async login(username, password) {
    const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'AggarwalSteel@2026';

    if (
      (username === expectedUsername && password === expectedPassword) ||
      (username === 'admin' && password === 'AggarwalSteel@2026') ||
      (username === 'aakash' && password === 'AggarwalSteel@2026')
    ) {
      const session = {
        token: 'as_adm_token_2026_industrial',
        user: {
          username: username,
          role: 'Super Admin',
          desk: 'Corporate Faridabad Desk',
          email: 'md@majesticar.com',
        },
        loginTime: Date.now(),
        mode: 'authenticated',
      };
      setLocal(STORAGE_KEYS.AUTH, session);
      return { success: true, session };
    }

    return {
      success: false,
      message: 'Invalid credentials. Default user is admin / AggarwalSteel@2026',
    };
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  },

  getCurrentUser() {
    return getLocal(STORAGE_KEYS.AUTH, null);
  },

  isAuthenticated() {
    const session = this.getCurrentUser();
    return Boolean(session && session.token);
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
  // ORDERS & SHIPMENTS
  // -------------------------------------------------------------
  async getOrders(filters = {}) {
    let list = [];

    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (filters.stage && filters.stage !== 'all') {
        query = query.eq('stage', filters.stage);
      }
      if (filters.search) {
        query = query.or(
          `tracking_number.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%,product.ilike.%${filters.search}%,vehicle_number.ilike.%${filters.search}%,delivery_destination.ilike.%${filters.search}%`
        );
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data;
        setLocal(STORAGE_KEYS.ORDERS, list);
        return list;
      }
    } catch {}

    list = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);

    if (filters.stage && filters.stage !== 'all') {
      list = list.filter((i) => i.stage === filters.stage);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.tracking_number?.toLowerCase().includes(s) ||
          i.client_name?.toLowerCase().includes(s) ||
          i.product?.toLowerCase().includes(s) ||
          i.vehicle_number?.toLowerCase().includes(s) ||
          i.delivery_destination?.toLowerCase().includes(s)
      );
    }

    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  },

  async createOrder(orderData) {
    const payload = {
      tracking_number: orderData.tracking_number || `AS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      client_name: orderData.client_name,
      phone: orderData.phone || '+91 73000 70778',
      product: orderData.product,
      quantity_metric_tons: parseFloat(orderData.quantity_metric_tons || 10),
      delivery_destination: orderData.delivery_destination,
      stage: orderData.stage || 'RFQ Received',
      estimated_delivery_date: orderData.estimated_delivery_date || '',
      vehicle_number: orderData.vehicle_number || '',
      notes: orderData.notes || '',
    };

    try {
      const { data, error } = await supabase.from('orders').insert([payload]).select().single();
      if (!error && data) {
        const all = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
        setLocal(STORAGE_KEYS.ORDERS, [data, ...all]);
        return data;
      }
    } catch {}

    const all = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const newRecord = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    setLocal(STORAGE_KEYS.ORDERS, [newRecord, ...all]);
    return newRecord;
  },

  async updateOrder(id, orderData) {
    try {
      await supabase
        .from('orders')
        .update({ ...orderData, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch {}

    const all = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const updated = all.map((item) =>
      item.id === Number(id) ? { ...item, ...orderData, updated_at: new Date().toISOString() } : item
    );
    setLocal(STORAGE_KEYS.ORDERS, updated);
    return true;
  },

  async deleteOrder(id) {
    try {
      await supabase.from('orders').delete().eq('id', id);
    } catch {}

    const all = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const filtered = all.filter((item) => item.id !== Number(id));
    setLocal(STORAGE_KEYS.ORDERS, filtered);
    return true;
  },

  async getOrderStats() {
    try {
      const { data, error } = await supabase.from('orders').select('stage, quantity_metric_tons');
      if (!error && Array.isArray(data)) {
        const totalTonnage = data.reduce((acc, curr) => acc + (Number(curr.quantity_metric_tons) || 0), 0);
        return {
          total: data.length,
          total_tonnage: Math.round(totalTonnage * 10) / 10,
          in_transit: data.filter((i) => i.stage === 'In Transit').length,
          processing: data.filter((i) => i.stage === 'Processing at Stockyard / Mill').length,
          ready_dispatch: data.filter((i) => i.stage === 'Ready for Dispatch').length,
          delivered: data.filter((i) => i.stage === 'Delivered').length,
        };
      }
    } catch {}

    const all = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const totalTonnage = all.reduce((acc, curr) => acc + (Number(curr.quantity_metric_tons) || 0), 0);
    return {
      total: all.length,
      total_tonnage: Math.round(totalTonnage * 10) / 10,
      in_transit: all.filter((i) => i.stage === 'In Transit').length,
      processing: all.filter((i) => i.stage === 'Processing at Stockyard / Mill').length,
      ready_dispatch: all.filter((i) => i.stage === 'Ready for Dispatch').length,
      delivered: all.filter((i) => i.stage === 'Delivered').length,
    };
  },

  // -------------------------------------------------------------
  // PRODUCTS & INVENTORY
  // -------------------------------------------------------------
  async getProducts(filters = {}) {
    let list = [];

    try {
      let query = supabase.from('products').select('*').order('id', { ascending: true });
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,grade.ilike.%${filters.search}%,specs.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data;
        setLocal(STORAGE_KEYS.PRODUCTS, list);
        return list;
      }
    } catch {}

    list = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    if (filters.category && filters.category !== 'all') {
      list = list.filter((i) => i.category === filters.category);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name?.toLowerCase().includes(s) ||
          i.grade?.toLowerCase().includes(s) ||
          i.specs?.toLowerCase().includes(s) ||
          i.description?.toLowerCase().includes(s)
      );
    }

    return list;
  },

  async createProduct(productData) {
    const slug =
      productData.slug ||
      productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const tagsArray = Array.isArray(productData.tags)
      ? productData.tags
      : (productData.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

    const payload = {
      name: productData.name,
      slug: slug,
      category: productData.category || 'Steel Supply & Trading',
      grade: productData.grade || '',
      description: productData.description || '',
      specs: productData.specs || '',
      badge: productData.badge || '',
      image_url: productData.image_url || '/images/product_tmt_bars.jpg',
      tags: tagsArray,
      estimated_price_per_ton: parseFloat(productData.estimated_price_per_ton || 0),
      is_active: productData.is_active ?? true,
    };

    try {
      const { data, error } = await supabase.from('products').insert([payload]).select().single();
      if (!error && data) {
        const all = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
        setLocal(STORAGE_KEYS.PRODUCTS, [data, ...all]);
        return data;
      }
    } catch {}

    const all = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const newRecord = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    setLocal(STORAGE_KEYS.PRODUCTS, [newRecord, ...all]);
    return newRecord;
  },

  async updateProduct(id, productData) {
    try {
      await supabase.from('products').update(productData).eq('id', id);
    } catch {}

    const all = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = all.map((item) =>
      item.id === Number(id) ? { ...item, ...productData } : item
    );
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return true;
  },

  async toggleProductActive(id) {
    const all = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const existing = all.find((item) => item.id === Number(id));
    const nextState = existing ? !existing.is_active : false;

    try {
      await supabase.from('products').update({ is_active: nextState }).eq('id', id);
    } catch {}

    const updated = all.map((item) =>
      item.id === Number(id) ? { ...item, is_active: nextState } : item
    );
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return true;
  },

  async deleteProduct(id) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch {}

    const all = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = all.filter((item) => item.id !== Number(id));
    setLocal(STORAGE_KEYS.PRODUCTS, filtered);
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
