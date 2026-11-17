'use client';
/**
 * Catalogue hierarchy data layer: categories -> sub-categories (with catalogue items) and
 * the in-house machine list. Same fallback chain as products:
 *   Supabase -> FastAPI backend -> this browser's admin edits -> bundled seed (src/data/catalogue.js)
 */
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { CATEGORY_DESCRIPTION_SEED, ITEM_DETAILS_SEED, SUBCATEGORY_DESCRIPTION_SEED, TAGLINE_SEED, parseDetails } from './segments';
import {
  CATEGORY_SEED,
  SUBCATEGORY_SEED,
  MACHINE_SEED,
  buildTree,
  groupMachines,
  slugify,
} from '../data/catalogue';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const LS_KEY = 'aggarwal_admin_catalogue';
const CACHE_TTL_MS = 30_000;

const toList = (v) => (Array.isArray(v) ? v.filter(Boolean) : typeof v === 'string' && v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);
const bySort = (a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || (Number(a.id) || 0) - (Number(b.id) || 0);

const normCategory = (c) => ({ ...c, tagline: c.tagline ?? TAGLINE_SEED[c.slug] ?? '', description: c.description || CATEGORY_DESCRIPTION_SEED[c.slug] || '', partners: toList(c.partners), sort_order: Number(c.sort_order) || 0, is_active: c.is_active !== false });
const normSubcategory = (s) => {
  const details = parseDetails(s.item_details);
  return { ...s, description: s.description || SUBCATEGORY_DESCRIPTION_SEED[s.slug] || '', items: toList(s.items), item_details: Object.keys(details).length || 'item_details' in s ? details : ITEM_DETAILS_SEED[s.slug] || {}, sort_order: Number(s.sort_order) || 0, is_active: s.is_active !== false };
};
const normMachine = (m) => ({ ...m, stages: toList(m.stages), qty: m.qty === '' || m.qty == null ? null : Number(m.qty), sort_order: Number(m.sort_order) || 0, is_active: m.is_active !== false });

/** Bundled seed in the flat-row shape (ids are the slugs). */
export const SEED_FLAT = {
  categories: CATEGORY_SEED.map((c) => normCategory({ id: c.slug, ...c })),
  subcategories: SUBCATEGORY_SEED.map((s) => normSubcategory({ id: `${s.category_slug}/${s.slug}`, ...s })),
  machines: MACHINE_SEED.map((m) => normMachine({ id: m.slug, ...m })),
};

/** Turns flat rows into what pages render: nested tree + grouped machines. */
export function shapeCatalogue(flat, source) {
  const categories = flat.categories.map(normCategory).sort(bySort);
  const subcategories = flat.subcategories.map(normSubcategory).sort(bySort);
  const machines = flat.machines.map(normMachine).sort(bySort);
  return { flat: { categories, subcategories, machines }, tree: buildTree(categories, subcategories), machineGroups: groupMachines(machines), source };
}

export const SEED_CATALOGUE = shapeCatalogue(SEED_FLAT, 'seed');

const readLocal = () => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};
const writeLocal = (flat) => { try { localStorage.setItem(LS_KEY, JSON.stringify(flat)); } catch { /* ignore */ } };

async function fetchFlat({ includeInactive = false } = {}) {
  try {
    const [c, s, m] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order').order('id'),
      supabase.from('subcategories').select('*').order('sort_order').order('id'),
      supabase.from('machines').select('*').order('sort_order').order('id'),
    ]);
    if (!c.error && !s.error && !m.error && Array.isArray(c.data) && c.data.length) {
      const flat = { categories: c.data, subcategories: s.data || [], machines: m.data || [] };
      writeLocal(flat);
      return { flat, source: 'supabase' };
    }
  } catch { /* unreachable */ }

  try {
    const res = await fetch(`${API_BASE}/api/v1/catalogue?only_active=${includeInactive ? 'false' : 'true'}`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const flat = await res.json();
      if (Array.isArray(flat.categories) && flat.categories.length) { writeLocal(flat); return { flat, source: 'api' }; }
    }
  } catch { /* offline */ }

  const local = readLocal();
  if (local?.categories?.length) return { flat: local, source: 'local' };
  return { flat: SEED_FLAT, source: 'seed' };
}

const onlyActive = (flat) => ({
  categories: flat.categories.filter((c) => c.is_active !== false),
  subcategories: flat.subcategories.filter((s) => s.is_active !== false),
  machines: flat.machines.filter((m) => m.is_active !== false),
});

let cached = null; // { promise, at }

/** Public read (active rows only). Shared across components for 30 s. */
export function loadCatalogue({ fresh = false } = {}) {
  const now = Date.now();
  if (!fresh && cached && now - cached.at < CACHE_TTL_MS) return cached.promise;
  const promise = fetchFlat().then(({ flat, source }) => shapeCatalogue(onlyActive(flat), source));
  cached = { promise, at: now };
  promise.catch(() => { cached = null; });
  return promise;
}

/** Admin read (includes hidden rows). */
export function loadCatalogueAdmin() {
  return fetchFlat({ includeInactive: true }).then(({ flat, source }) => shapeCatalogue(flat, source));
}

/** React hook: seed first, live data once loaded. */
export function useCatalogue() {
  const [catalogue, setCatalogue] = useState(SEED_CATALOGUE);
  useEffect(() => {
    let alive = true;
    loadCatalogue().then((c) => { if (alive) setCatalogue(c); });
    return () => { alive = false; };
  }, []);
  return catalogue;
}

// -------------------------------------------------------------------
// ADMIN WRITES (Supabase -> FastAPI -> localStorage), one generic helper per table
// -------------------------------------------------------------------
const TABLES = {
  categories: { api: '/categories', norm: normCategory, key: 'categories' },
  subcategories: { api: '/subcategories', norm: normSubcategory, key: 'subcategories' },
  machines: { api: '/machines', norm: normMachine, key: 'machines' },
};

async function apiJson(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/v1${path}`, { headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(4000), ...options });
    if (!res.ok) return null;
    return res.status === 204 ? true : await res.json();
  } catch { return null; }
}

const stripMeta = ({ id, created_at, updated_at, ...rest }) => rest; // eslint-disable-line no-unused-vars

async function saveRow(table, row) {
  const { api, norm, key } = TABLES[table];
  const payload = stripMeta(norm(row));
  const isUpdate = row.id != null && String(row.id).match(/^\d+$/);
  cached = null;

  try {
    const q = isUpdate
      ? supabase.from(table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', row.id).select().single()
      : supabase.from(table).insert([payload]).select().single();
    const { data, error } = await q;
    if (!error && data) return { ok: true, row: norm(data), storage: 'supabase' };
    if (error) return { ok: false, error: error.message };
  } catch { /* unreachable */ }

  const saved = isUpdate
    ? await apiJson(`${api}/${row.id}`, { method: 'PUT', body: JSON.stringify(payload) })
    : await apiJson(api, { method: 'POST', body: JSON.stringify(payload) });
  if (saved && saved.id) return { ok: true, row: norm(saved), storage: 'api' };

  // Browser-only fallback
  const local = readLocal() || JSON.parse(JSON.stringify(SEED_FLAT));
  const list = local[key] || [];
  const id = row.id ?? Date.now();
  const next = norm({ ...payload, id });
  local[key] = list.some((r) => String(r.id) === String(id)) ? list.map((r) => (String(r.id) === String(id) ? next : r)) : [...list, next];
  writeLocal(local);
  return { ok: true, row: next, storage: 'local' };
}

async function deleteRow(table, id) {
  const { api, key } = TABLES[table];
  cached = null;
  let done = false;
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    done = !error;
  } catch { /* unreachable */ }
  if (!done) done = Boolean(await apiJson(`${api}/${id}`, { method: 'DELETE' }));
  const local = readLocal();
  if (local) {
    local[key] = (local[key] || []).filter((r) => String(r.id) !== String(id));
    if (table === 'categories') {
      const slug = (readLocal()?.categories || []).find((c) => String(c.id) === String(id))?.slug;
      if (slug) local.subcategories = (local.subcategories || []).filter((s) => s.category_slug !== slug);
    }
    writeLocal(local);
  }
  return done;
}

export const catalogueAdmin = {
  load: loadCatalogueAdmin,
  saveCategory: (row) => saveRow('categories', { ...row, slug: row.slug || slugify(row.name) }),
  deleteCategory: (id) => deleteRow('categories', id),
  saveSubcategory: (row) => saveRow('subcategories', { ...row, slug: row.slug || slugify(row.name) }),
  deleteSubcategory: (id) => deleteRow('subcategories', id),
  saveMachine: (row) => saveRow('machines', { ...row, slug: row.slug || slugify(row.name) }),
  deleteMachine: (id) => deleteRow('machines', id),
};
