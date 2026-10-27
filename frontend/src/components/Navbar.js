'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconPhone, IconArrowRight, IconSun, IconMoon, IconFileText } from './Icons';
import QuoteModal from './QuoteModal';

const LINKS = [
  { href: '/',             label: 'Home',          id: 'navHome' },
  { href: '/products',     label: 'Products',      id: 'navProducts' },
  { href: '/manufacturing',label: 'Manufacturing', id: 'navMfg' },
  { href: '/about',        label: 'About Us',      id: 'navAbout' },
  { href: '/clients',      label: 'Clients',       id: 'navClients' },
  { href: '/contact',      label: 'Contact',       id: 'navContact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [theme, setTheme]       = useState('dark');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleOpenQuote = () => setQuoteModalOpen(true);
    window.addEventListener('open-instant-quote', handleOpenQuote);
    return () => window.removeEventListener('open-instant-quote', handleOpenQuote);
  }, []);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('as_theme', nextTheme);
    } catch (e) {}
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        {/* Authentic Brand Logo */}
        <Link
          href="/"
          className="nav-logo"
          id="navLogo"
          onClick={closeMenu}
          aria-label="Aggarwal Steels Home"
        >
          <img
            src="/images/brand/aggarwal_logo_circle.png"
            alt="Aggarwal Steels"
            width={64}
            height={64}
            className="brand-logo-img"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={`nav-links ${open ? 'open' : ''}`} id="navLinks">
          {LINKS.map(({ href, label, id }) => {
            const isActive = href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(href);

            return (
              <Link
                key={id}
                href={href}
                id={id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {label}
              </Link>
            );
          })}
          {/* Mobile Drawer Action Buttons */}
          <div className="mobile-drawer-actions">
            <a
              href="/Aggarwal_Steels_Catalogue_2026.pdf"
              download="Aggarwal_Steels_Catalogue_2026.pdf"
              className="btn-modern-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}
            >
              <IconFileText size={16} />
              <span>Download 2026 Catalogue (PDF)</span>
            </a>
            <button
              type="button"
              className="btn-modern-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                closeMenu();
                setQuoteModalOpen(true);
              }}
            >
              <IconPhone size={16} />
              <span>Get Instant Quotation</span>
            </button>
          </div>
        </nav>

        {/* Action Buttons & Theme Toggle */}
        <div className="nav-actions">
          <a
            href="/Aggarwal_Steels_Catalogue_2026.pdf"
            download="Aggarwal_Steels_Catalogue_2026.pdf"
            className="btn-catalog-nav"
            id="btnNavCatalog"
            title="Download Official 2026 Product Catalogue (PDF)"
          >
            <IconFileText size={15} />
            <span className="btn-catalog-text">Catalogue 2026</span>
          </a>

          {/* Theme Change Toggle — Strictly Icon Only */}
          <button
            type="button"
            className="theme-toggle-btn"
            id="themeToggleBtn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>


          {/* Instant Quote Button — Triggers Dedicated Quote Modal */}
          <button
            type="button"
            className="btn-quote"
            id="btnCall"
            onClick={() => {
              closeMenu();
              setQuoteModalOpen(true);
            }}
          >
            <IconPhone size={15} />
            <span>Instant Quote</span>
          </button>

          <button
            className={`hamburger ${open ? 'open' : ''}`}
            id="hamburger"
            aria-label="Toggle Menu"
            onClick={() => setOpen(o => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Dedicated Instant Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </header>
  );
}
