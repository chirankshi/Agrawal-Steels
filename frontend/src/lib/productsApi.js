'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { adminMessage, adminRequest } from './adminRequest';
import { PRODUCTS } from '../data/products';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const LS_PRODUCTS = 'aggarwal_admin_products';
const BUCKET = 'product-images';

const toList = (v) => {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string') {
    try { const parsed = JSON.parse(v); if (Array.isArray(parsed)) return parsed.filter(Boolean); } catch { /* csv */ }
    return v.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

/** Coerces any stored product (Supabase row, API row, localStorage, seed) into one shape. */
export function normalizeProduct(p) {
  return {
    ...p,
    id: p.id ?? p.slug,
    slug: p.slug || String(p.id || '').toLowerCase(),
    tags: toList(p.tags),
    applications: toList(p.applications),
    gallery: toList(p.gallery),
    image_url: p.image_url || p.img || '/images/product_tmt_bars.jpg',
    description: p.description || p.desc || '',
    subcategory: p.subcategory || p.subcat || '',
    tagline: p.tagline || '',
    sizes: p.sizes || '',
    dispatch: p.dispatch || '',
    estimated_price_per_ton: Number(p.estimated_price_per_ton) || 0,
    sort_order: Number(p.sort_order) || 0,
    show_on_home: Boolean(p.show_on_home),
    is_active: p.is_active !== false,
  };
}

const bySort = (a, b) => (a.sort_order - b.sort_order) || (Number(a.id) || 0) - (Number(b.id) || 0);

/** Seed list in the normalized shape, for first render and offline fallback. */
export const SEED_PRODUCTS = PRODUCTS.map((p, i) => normalizeProduct({ id: i + 1, ...p }));

/**
 * Loads the live, active product list for the public site.
 * Order of preference: Supabase -> FastAPI backend -> this browser's admin edits -> catalogue seed.
 * @returns {Promise<{list: object[], source: 'supabase'|'api'|'local'|'catalogue'}>}
 */
export async function fetchPublicProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });
    if (!error && Array.isArray(data) && data.length) return { list: data.map(normalizeProduct), source: 'supabase' };
  } catch { /* unreachable */ }

  try {
    const res = await fetch(`${API_BASE}/api/v1/products?only_active=true&limit=500`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) return { list: data.map(normalizeProduct).sort(bySort), source: 'api' };
    }
  } catch { /* offline */ }

  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_PRODUCTS) : null;
    if (raw) {
      const list = JSON.parse(raw).map(normalizeProduct).filter((p) => p.is_active).sort(bySort);
      if (list.length) return { list, source: 'local' };
    }
  } catch { /* ignore */ }

  return { list: SEED_PRODUCTS, source: 'catalogue' };
}

/** React hook: renders the catalogue seed immediately, then swaps in the live list. */
export function useProducts() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [source, setSource] = useState('catalogue');
  useEffect(() => {
    let alive = true;
    fetchPublicProducts().then(({ list, source: src }) => {
      if (alive) { setProducts(list); setSource(src); }
    });
    return () => { alive = false; };
  }, []);
  return { products, source };
}

// -------------------------------------------------------------------
// IMAGE UPLOAD
// -------------------------------------------------------------------

/** Downscales an image in the browser so uploads stay small (max 1400 px edge). */
export function compressImage(file, { maxEdge = 1400, quality = 0.82 } = {}) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return resolve(file);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const keepPng = file.type === 'image/png';
      canvas.toBlob(
        (blob) => { URL.revokeObjectURL(url); resolve(blob || file); },
        keepPng ? 'image/png' : 'image/jpeg',
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

const extFor = (blob, file) => (blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : file.name.split('.').pop()?.toLowerCase() === 'png' ? 'png' : 'jpg');

/**
 * Stores an admin image and returns its public URL.
 * 1. Backend /uploads with the admin token (uses the server-side Supabase secret key).
 * 2. Only if the server has no storage key yet (503): direct upload to the public
 *    bucket, which the database allows as insert-only, images up to 5 MB.
 * Throws with a readable message when neither works.
 * @returns {Promise<{url: string, storage: 'supabase'|'api'|'direct'}>}
 */
export async function uploadProductImage(file, slug = 'product') {
  const blob = await compressImage(file);
  const ext = extFor(blob, file);
  const safeSlug = (slug || 'product').toLowerCase().replace(/[^a-z0-9-/]+/g, '-');

  const form = new FormData();
  form.append('file', blob, `${safeSlug.split('/').pop() || 'image'}.${ext}`);
  form.append('folder', safeSlug);
  const res = await adminRequest('/uploads', { method: 'POST', form, quiet: true });
  if (res.ok && res.data?.url) {
    const url = res.data.url.startsWith('http') ? res.data.url : `${API_BASE}${res.data.url}`;
    return { url, storage: res.data.storage === 'supabase' ? 'supabase' : 'api' };
  }

  if (res.status === 503) {
    const path = `${safeSlug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { upsert: false, contentType: blob.type });
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      if (data?.publicUrl) return { url: data.publicUrl, storage: 'direct' };
    }
  }

  const message = res.error || 'Image upload failed. Please try again.';
  adminMessage(message);
  throw new Error(message);
}
