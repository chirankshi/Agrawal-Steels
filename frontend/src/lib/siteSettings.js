'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { adminRequest } from './adminRequest';
import { CLIENTS } from '../data/clients';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const LS_KEY = 'aggarwal_site_settings';

/** Editable site-wide values. Everything the public pages read from here can be changed in Admin > Site Settings. */
export const DEFAULT_SETTINGS = {
  announcement_enabled: true,
  announcement_text: 'MS Material dispatched within 24 hours • PAN India logistics • 100% BIS / ISI certified mill test certificates',
  sales_phone: '+91 73000 70778',
  alternate_phone: '+91 73000 96120',
  whatsapp_number: '+91 73000 70778',
  sales_email: 'sales@aggarwalsteel.com',
  md_email: 'md@aggarwalsteel.com',
  working_hours: 'Mon – Sat: 09:00 AM – 06:00 PM IST',
  // Company figures (hero, About)
  founded_year: '2015',
  turnover_cr: '230',
  turnover_year: 'FY 2025-26',
  staff_count: '250',
  trading_years: '11',
  manufacturing_years: '4',
  units_count: '5',
  units_breakdown: '2 Mfg Plants • 3 Trading Hubs',
  // Addresses (footer, contact page, home contact section)
  address_head_office: 'Block C, Plot No. E-372, RIICO Industrial Area, Bhiwadi – 301019, Rajasthan',
  address_unit_02: 'G1-385, RIICO Industrial Area, Bhiwadi – 301019, Rajasthan',
  // Client list (Admin -> Clients). Empty means the built-in list.
  clients: [],
};

export const SETTING_FIELDS = [
  { section: 'Contact details' },
  { key: 'sales_phone', label: 'Primary sales phone', type: 'text' },
  { key: 'alternate_phone', label: 'Second phone', type: 'text' },
  { key: 'whatsapp_number', label: 'WhatsApp number (for the Chat buttons)', type: 'text' },
  { key: 'sales_email', label: 'Sales email', type: 'email' },
  { key: 'md_email', label: 'Director / MD email', type: 'email' },
  { key: 'working_hours', label: 'Working hours line', type: 'text' },
  { section: 'Company figures (home page hero and About page)' },
  { key: 'founded_year', label: 'Year established', type: 'number' },
  { key: 'turnover_cr', label: 'Group turnover (₹ crore; shown on site as ₹ billion, e.g. 230 → 2.3 Billion)', type: 'number' },
  { key: 'turnover_year', label: 'Turnover year label', type: 'text' },
  { key: 'staff_count', label: 'Workforce (number of people)', type: 'number' },
  { key: 'trading_years', label: 'Years of trading experience', type: 'number' },
  { key: 'manufacturing_years', label: 'Years of in-house manufacturing', type: 'number' },
  { key: 'units_count', label: 'Operating units', type: 'number' },
  { key: 'units_breakdown', label: 'Units breakdown line', type: 'text' },
  { section: 'Addresses' },
  { key: 'address_head_office', label: 'Head office (Bhiwadi)', type: 'text', wide: true },
  { key: 'address_unit_02', label: 'Manufacturing unit 02 (Bhiwadi)', type: 'text', wide: true },
];

/** Number setting with a safe fallback, for CountUp targets. */
export const num = (settings, key) => Number(settings?.[key]) || Number(DEFAULT_SETTINGS[key]) || 0;

// Group turnover is stored in ₹ crore (as in the catalogue's admin field) but
// displayed in ₹ billion, matching catalogue page 4 (230 Cr -> 2.3 Billion).
export const turnoverBillion = (settings) => num(settings, 'turnover_cr') / 100;
export const turnoverBillionText = (settings) =>
  turnoverBillion(settings).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

const digits = (phone) => String(phone || '').replace(/[^\d]/g, '');
/** "+91 73000 70778" -> "tel:+917300070778" */
export const telHref = (phone) => `tel:+${digits(phone)}`;
/** WhatsApp deep link with optional prefilled text. */
export const waHref = (phone, text = '') => `https://wa.me/${digits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

const merge = (data) => ({ ...DEFAULT_SETTINGS, ...(data && typeof data === 'object' ? data : {}) });

/** Reads settings: Supabase -> FastAPI -> this browser -> defaults. */
// One request per page load: every component that calls useSiteSettings shares
// this promise for a short while instead of each hitting Supabase.
const CACHE_TTL_MS = 30_000;
let cached = null; // { promise, at }

export function loadSiteSettings({ fresh = false } = {}) {
  const now = Date.now();
  if (!fresh && cached && now - cached.at < CACHE_TTL_MS) return cached.promise;
  const promise = fetchSiteSettings();
  cached = { promise, at: now };
  promise.catch(() => { cached = null; });
  return promise;
}

async function fetchSiteSettings() {
  try {
    const { data, error } = await supabase.from('site_settings').select('data').eq('id', 1).single();
    if (!error && data?.data) return { settings: merge(data.data), source: 'supabase' };
  } catch { /* unreachable */ }

  try {
    const res = await fetch(`${API_BASE}/api/v1/settings`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return { settings: merge(await res.json()), source: 'api' };
  } catch { /* offline */ }

  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
    if (raw) return { settings: merge(JSON.parse(raw)), source: 'local' };
  } catch { /* ignore */ }

  return { settings: { ...DEFAULT_SETTINGS }, source: 'defaults' };
}

/** Saves settings through the backend with the admin login token. */
export async function saveSiteSettings(settings) {
  const payload = merge(settings);
  cached = null; // next read sees the new values
  const res = await adminRequest('/settings', { method: 'PUT', body: payload });
  if (res.ok) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(payload)); } catch { /* ignore */ }
    return { ok: true, storage: 'api' };
  }
  return { ok: false, storage: null, error: res.error };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [source, setSource] = useState('defaults');
  useEffect(() => {
    let alive = true;
    loadSiteSettings().then((r) => { if (alive) { setSettings(r.settings); setSource(r.source); } });
    return () => { alive = false; };
  }, []);
  return { settings, source };
}

/**
 * Client roster for the logo strip and the Clients page. Edited in Admin -> Clients
 * (stored in site settings); falls back to the built-in list in data/clients.js.
 */
export function useClients() {
  const { settings } = useSiteSettings();
  const list = Array.isArray(settings.clients) && settings.clients.length ? settings.clients : CLIENTS;
  return list.filter((c) => c && c.name && c.is_active !== false);
}
