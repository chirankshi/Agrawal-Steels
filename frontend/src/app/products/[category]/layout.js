import { getCategories } from '../../../lib/catalogueServer';
import { categoryImage } from '../../../lib/segments';

/** Builds every segment page ahead of time. New segments added in admin render on first visit. */
export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const c = (await getCategories()).find((x) => x.slug === category);
  if (!c) return { title: 'Products' };
  const description = [c.tagline, c.description].filter(Boolean).join(' ');
  return {
    title: { absolute: `${c.name} | Aggarwal Steels` },
    description,
    alternates: { canonical: `/products/${c.slug}` },
    openGraph: { title: c.name, description, images: [categoryImage(c)] },
  };
}

export default function SegmentLayout({ children }) {
  return children;
}
