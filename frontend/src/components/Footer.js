'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSiteSettings, telHref, waHref } from '../lib/siteSettings';
import { useCatalogue } from '../lib/catalogueApi';
import { IconPhone, IconMail, IconMapPin, IconClock, IconFileText, IconArrowRight } from './Icons';

const COMPANY_LINKS = [
  { href: '/about', label: 'About us' },
  { href: '/manufacturing', label: 'Manufacturing & machinery' },
  { href: '/quality', label: 'Quality, safety & logistics' },
  { href: '/clients', label: 'Clients & projects' },
  { href: '/about#certifications', label: 'ISO certifications' },
  { href: '/contact', label: 'Contact & quote' },
];

export default function Footer() {
  const { settings } = useSiteSettings();
  const { tree } = useCatalogue();
  // Read the clock after mount: Next.js 16 refuses `new Date()` during prerender.
  const [year, setYear] = useState(2026);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer className="site-footer" id="footer">
      {/* Call to action */}
      <div className="container">
        <div className="footer-cta">
          <div className="footer-cta-text">
            <span className="footer-cta-eyebrow">Get a quote in 24 hours</span>
            <h3>Need steel, racking or fabrication?</h3>
            <p>Share your requirement and our sales desk will reply with rates and delivery time.</p>
            <ul className="footer-cta-points">
              <li>24-hour dispatch on stock items</li>
              <li>Mill test certificate with every batch</li>
              <li>Delivery across India</li>
            </ul>
            <div className="footer-cta-actions">
              <Link href="/contact" className="cta-btn cta-btn--dark">
                <span>Get a quote</span> <IconArrowRight size={16} />
              </Link>
              <a href={telHref(settings.sales_phone)} className="cta-btn cta-btn--light">
                <IconPhone size={16} /> <span>{settings.sales_phone}</span>
              </a>
              <a href={waHref(settings.whatsapp_number, 'Hello Aggarwal Steels, I would like a quote.')} target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn--wa">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.09c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.3-.12.58.17.29.75 1.24 1.61 2 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.7-.17 1.37Z" /></svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
          <div className="footer-cta-photo" aria-hidden="true">
            <img src="/images/catalogue/racking.jpg" alt="" loading="lazy" />
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <Link href="/" className="footer-brand" aria-label="Aggarwal Steels home">
            <img src="/images/brand/aggarwal_logo_circle.png" alt="" width={48} height={48} />
            <span>
              <strong>Aggarwal Steels</strong>
              <em>Majestic AR Technology</em>
            </span>
          </Link>
          <p>
            Primary steel supply, warehouse racking, mezzanines and precision fabrication from our plants in
            Bhiwadi, Manesar and Bawal. Since {settings.founded_year}.
          </p>
          <img src="/images/brand/iso_make_in_india.png" alt="ISO 9001:2015 certified and Make in India" className="footer-iso" width={150} height={40} />
          <a href="/Aggarwal_Steels_Catalogue_2026.pdf" download className="footer-catalogue">
            <IconFileText size={15} /> <span>Download catalogue 2026 (PDF)</span>
          </a>
        </div>

        <nav className="footer-col" aria-label="Products">
          <h4>Products</h4>
          <ul>
            {tree.map((c) => (
              <li key={c.slug}><Link href={`/products/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Company">
          <h4>Company</h4>
          <ul>
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="footer-col footer-contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <IconPhone size={15} />
              <span>
                <a href={telHref(settings.sales_phone)}>{settings.sales_phone}</a>
                {settings.alternate_phone && <><br /><a href={telHref(settings.alternate_phone)}>{settings.alternate_phone}</a></>}
              </span>
            </li>
            <li>
              <IconMail size={15} />
              <a href={`mailto:${settings.sales_email}`}>{settings.sales_email}</a>
            </li>
            <li>
              <IconMapPin size={15} />
              <span>{settings.address_head_office}</span>
            </li>
            <li>
              <IconClock size={15} />
              <span>{settings.working_hours}</span>
            </li>
          </ul>
          <Link href="/contact" className="footer-units">All plant addresses <IconArrowRight size={13} /></Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {year} Aggarwal Steels &amp; Majestic AR Technology Pvt. Ltd.</p>
          <p className="footer-bottom-links">
            <span>A legacy of strength</span>
            <Link href="/admin/login" className="footer-admin">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Admin login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
