'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

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
};

export const SETTING_FIELDS = [
  { key: 'announcement_enabled', label: 'Show top announcement bar', type: 'checkbox' },
  { key: 'announcement_text', label: 'Announcement bar text', type: 'text' },
  { key: 'sales_phone', label: 'Primary sales phone', type: 'text' },
  { key: 'alternate_phone', label: 'Second phone', type: 'text' },
  { key: 'whatsapp_number', label: 'WhatsApp number (for the Chat buttons)', type: 'text' },
  { key: 'sales_email', label: 'Sales email', type: 'email' },
  { key: 'md_email', label: 'Director / MD email', type: 'email' },
  { key: 'working_hours', label: 'Working hours line', type: 'text' },
];

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

/** Saves settings through the same chain. Always keeps a browser copy. */
export async function saveSiteSettings(settings) {
  const payload = merge(settings);
  try { localStorage.setItem(LS_KEY, JSON.stringify(payload)); } catch { /* ignore */ }
  cached = null; // next read sees the new values

  try {
    const { error } = await supabase.from('site_settings').upsert({ id: 1, data: payload, updated_at: new Date().toISOString() });
    if (!error) return { ok: true, storage: 'supabase' };
  } catch { /* unreachable */ }

  try {
    const res = await fetch(`${API_BASE}/api/v1/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) return { ok: true, storage: 'api' };
  } catch { /* offline */ }

  return { ok: true, storage: 'local' };
}

/** React hook for public pages: defaults first, live values once loaded. */
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
