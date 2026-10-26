'use client';
import { useState, useEffect } from 'react';
import { IconPhone, IconArrowRight, IconSun, IconMoon, IconFileText } from './Icons';

const LINKS = [
  { href: '#home',         label: 'Home',         id: 'navHome' },
  { href: '#products',     label: 'Products',     id: 'navProducts' },
  { href: '#capabilities', label: 'Fabrication',  id: 'navCap' },
  { href: '#about',        label: 'About',        id: 'navAbout' },
  { href: '#why-us',       label: 'Why Choose Us',id: 'navWhyUs' },
  { href: '#journey',      label: 'Growth',       id: 'navJourney' },
  { href: '#contact',      label: 'Contact',      id: 'navContact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState('home');
  const [theme, setTheme]       = useState('dark');

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
      const sections = ['home', 'products', 'capabilities', 'about', 'why-us', 'journey', 'contact'];
      const y = window.scrollY + 140;
      let cur = 'home';
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        {/* Authentic Brand Logo */}
        <a href="#home" className="nav-logo" id="navLogo" onClick={closeMenu}>
          <img
            src="/images/brand/aggarwal_logo_circle.png"
            alt="Aggarwal Steels Official Brand Logo"
            width={44}
            height={44}
            className="brand-logo-img"
          />
          <div className="logo-text">
            <span className="logo-brand">AGGARWAL STEELS</span>
            <span className="logo-tagline">&bull; MAJESTIC AR TECHNOLOGY &bull;</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className={`nav-links ${open ? 'open' : ''}`} id="navLinks">
          {LINKS.map(({ href, label, id }) => (
            <a
              key={href}
              href={href}
              id={id}
              className={`nav-link ${active === href.replace('#', '') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
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

          <button
            type="button"
            className="theme-toggle-btn"
            id="themeToggleBtn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <IconSun size={17} />
                <span className="theme-toggle-text">Light</span>
              </>
            ) : (
              <>
                <IconMoon size={17} />
                <span className="theme-toggle-text">Dark</span>
              </>
            )}
          </button>

          <a href="#contact" className="btn-quote" id="btnCall">
            <IconPhone size={15} />
            <span>Instant Quote</span>
          </a>
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
