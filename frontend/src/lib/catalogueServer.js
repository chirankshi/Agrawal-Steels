/**
 * Server-side catalogue reads (page titles, sitemap). Cached for an hour, so
 * admin edits reach titles and the sitemap within the hour; the pages
 * themselves load live data in the browser. Falls back to the bundled seed.
 */
import { cacheLife } from 'next/cache';
import { CATEGORY_SEED } from '../data/catalogue';
import { CATEGORY_DESCRIPTION_SEED, TAGLINE_SEED } from './segments';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rjtuuzehypemfvdaiusi.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__9P3FJxQPo_Jq6ClYDxi0g_UNnWKoez';

export async function getCategories() {
  'use cache';
  cacheLife('hours');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=slug,name,tagline,description,image_url,is_active,updated_at&is_active=eq.true&order=sort_order`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length) return rows;
    }
  } catch { /* offline: use the seed */ }
  return CATEGORY_SEED.map((c) => ({ slug: c.slug, name: c.name, tagline: TAGLINE_SEED[c.slug] || '', description: CATEGORY_DESCRIPTION_SEED[c.slug] || '', image_url: '' }));
}
