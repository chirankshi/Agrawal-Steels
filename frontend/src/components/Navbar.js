'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconPhone, IconArrowRight, IconSun, IconMoon, IconFileText } from './Icons';

const LINKS = [
  { href: '/',             label: 'Home',          id: 'navHome' },
  { href: '/products',     label: 'Products',      id: 'navProducts' },
  { href: '/manufacturing',label: 'Manufacturing', id: 'navMfg' },
  { href: '/about',        label: 'About Us',      id: 'navAbout' },
  { href: '/clients',      label: 'Clients',       id: 'navClients' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [theme, setTheme]       = useState('dark');
  const pathname = usePathname();

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
          {/* Mobile Drawer Contact Link */}
          <Link
            href="/contact"
            id="navMobileContact"
            className={`nav-link mobile-only-nav ${pathname.startsWith('/contact') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Contact
          </Link>
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

          {/* Contact Button — Pill Shape */}
          <Link
            href="/contact"
            className={`btn-contact-pill ${pathname.startsWith('/contact') ? 'active' : ''}`}
            id="btnNavContact"
            onClick={closeMenu}
          >
            <span>Contact</span>
          </Link>

          {/* Instant Quote Button — Pill Shape */}
          <Link
            href="/contact"
            className="btn-quote"
            id="btnCall"
            onClick={closeMenu}
          >
            <IconPhone size={15} />
            <span>Instant Quote</span>
          </Link>

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
    </header>
  );
}
