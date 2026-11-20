import { getCategories } from '../lib/catalogueServer';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://aggarwalsteel.com';

export default async function sitemap() {
  const pages = ['', '/products', '/manufacturing', '/about', '/clients', '/contact'].map((path, i) => ({
    url: `${SITE}${path}`,
    changeFrequency: 'monthly',
    priority: i === 0 ? 1 : 0.8,
  }));
  const segments = (await getCategories()).map((c) => ({
    url: `${SITE}/products/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...pages, ...segments];
}
