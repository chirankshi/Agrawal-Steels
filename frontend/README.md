# Aggarwal Steels – Website & Admin Desk

Next.js 16 (App Router, JavaScript) front end for Aggarwal Steels & Majestic AR Technology, with a Supabase-backed admin desk.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Environment

Create `.env.local` (never commit it):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # or the legacy NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ADMIN_USERNAME=...
NEXT_PUBLIC_ADMIN_PASSWORD=...
# optional – FastAPI fallback used only if Supabase is unreachable
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The schema for the `enquiries`, `products`, `site_settings`, `categories`, `subcategories` and `machines` tables and the `product-images` bucket lives in `../supabase_schema.sql`. Run it once in the Supabase SQL editor of a new project (skip the demo enquiries block if you want an empty inbox).

## Layout

| Path | Purpose |
| --- | --- |
| `src/app/` | Routes: home, about, products, manufacturing, clients, contact, `/admin/*` |
| `src/app/admin/` | Three modules: Form Enquiries (all website forms), Products & Images, Site Settings |
| `src/lib/siteSettings.js` | `useSiteSettings()` – announcement bar, phones, emails, hours editable from the admin |
| `src/components/` | Page sections, navbar, footer, modals |
| `src/data/clients.js` | Client roster and primary-mill partners (shared by home and `/clients`) |
| `src/data/company.js` | Official locations and directors from the 2026 catalogue |
| `src/data/catalogue.js` | Catalogue hierarchy seed: 9 categories, 34 sub-categories with their catalogue items, and the in-house machines (edited live in Admin > Categories / Machines) |
| `src/lib/catalogueApi.js` | `useCatalogue()` for the public site and `catalogueAdmin` writes (Supabase → API → browser → seed) |
| `src/data/products.js` | Catalogue product seed; each product points at a category / sub-category slug from catalogue.js |
| `src/lib/productsApi.js` | `useProducts()` for the public site (Supabase → API → browser → seed) and `uploadProductImage()` |
| `src/lib/enquiries.js` | `submitEnquiry()` – writes RFQs to Supabase, falls back to the API |
| `src/lib/adminApi.js` | Admin desk data layer (Supabase with localStorage fallback) |
| `public/` | Static assets; `Aggarwal_Steels_Catalogue_2026.pdf`, certificates, brand and product images |
