'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '../../lib/adminApi';
import { loadCatalogueAdmin } from '../../lib/catalogueApi';

const SOURCE_LABELS = {
  website_rfq_form: 'Home page form',
  instant_quote_modal: 'Instant Quote popup',
  contact_page_rfq: 'Contact page form',
  direct_contact: 'Direct contact',
};

const timeAgo = (iso) => {
  if (!iso) return '—';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 0)} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs} hr ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [productCount, setProductCount] = useState(null);
  const [catalogueCounts, setCatalogueCounts] = useState(null);

  useEffect(() => {
    Promise.all([adminApi.getEnquiryStats(), adminApi.getEnquiries(), adminApi.getProducts()]).then(([s, list, products]) => {
      setStats(s);
      setRecent((list || []).slice(0, 6));
      setProductCount(products.filter((p) => p.is_active).length);
    });
    loadCatalogueAdmin().then((c) => setCatalogueCounts({ categories: c.flat.categories.length, subcategories: c.flat.subcategories.length, machines: c.flat.machines.length }));
  }, []);

  const cards = [
    { label: 'New enquiries (pending)', value: stats ? stats.pending : '…', href: '/admin/enquiries', accent: '#f59e0b' },
    { label: 'Total enquiries', value: stats ? stats.total : '…', href: '/admin/enquiries', accent: '#38bdf8' },
    { label: 'Products live on site', value: productCount ?? '…', href: '/admin/products', accent: 'var(--adm-emerald)' },
    { label: 'Categories / sub-categories', value: catalogueCounts ? `${catalogueCounts.categories} / ${catalogueCounts.subcategories}` : '…', href: '/admin/catalogue', accent: '#a78bfa' },
    { label: 'Machines on manufacturing page', value: catalogueCounts ? catalogueCounts.machines : '…', href: '/admin/machines', accent: '#fb7185' },
  ];

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div className="stat-grid">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="panel-card stat-card" style={{ borderLeftColor: c.accent }}>
            <span className="stat-label">{c.label}</span>
            <span className="stat-value">{c.value}</span>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link href="/admin/enquiries" className="btn-primary-adm">View Form Enquiries</Link>
        <Link href="/admin/products" className="btn-secondary-adm">Add / Edit Products &amp; Images</Link>
        <Link href="/admin/catalogue" className="btn-secondary-adm">Categories &amp; Sub-categories</Link>
        <Link href="/admin/machines" className="btn-secondary-adm">Machines</Link>
        <Link href="/admin/settings" className="btn-secondary-adm">Site Settings</Link>
      </div>

      <div className="panel-card">
        <div className="panel-card-header">
          <h3 className="panel-card-title">Latest enquiries from the website forms</h3>
          <Link href="/admin/enquiries" className="btn-secondary-adm">View all</Link>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Came from</th>
                <th>Status</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--adm-text-muted)' }}>{stats ? 'No enquiries yet.' : 'Loading...'}</td></tr>
              ) : (
                recent.map((e) => (
                  <tr key={e.id}>
                    <td><strong style={{ color: 'var(--adm-text-main)' }}>{e.name}</strong>{e.email && <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)' }}>{e.email}</div>}</td>
                    <td><a href={`tel:${e.phone}`} style={{ color: '#38bdf8' }}>{e.phone}</a></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-silver)' }}>{e.product}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{SOURCE_LABELS[e.source] || e.source || '—'}</td>
                    <td><span className={`status-badge badge-${e.status || 'pending'}`}>{(e.status || 'pending').replace('_', ' ')}</span></td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{timeAgo(e.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
