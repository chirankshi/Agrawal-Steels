'use client';
import { useState, useEffect } from 'react';
import { IconPhone, IconArrowRight } from './Icons';

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
        {/* Brand Logo with Industrial Hex Emblem */}
        <a href="#home" className="nav-logo" id="navLogo" onClick={closeMenu}>
          <div className="logo-symbol">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#f59e0b" strokeWidth="2.5" fill="rgba(245, 158, 11, 0.08)"/>
              <path d="M18 10V26" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M11 22L18 26L25 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-brand">AGGARWAL</span>
            <span className="logo-tagline">STEELS &bull; ESTD 1990</span>
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

        {/* Action Button & Mobile Toggle */}
        <div className="nav-actions">
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
