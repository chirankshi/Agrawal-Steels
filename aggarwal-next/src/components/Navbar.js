'use client';
import { useState, useEffect } from 'react';

const LINKS = [
  { href: '#home',     label: 'Home',     id: 'navHome' },
  { href: '#products', label: 'Products', id: 'navProducts' },
  { href: '#about',    label: 'About Us', id: 'navAbout' },
  { href: '#why-us',   label: 'Why Us',   id: 'navWhyUs' },
  { href: '#journey',  label: 'Journey',  id: 'navJourney' },
  { href: '#contact',  label: 'Contact',  id: 'navContact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ['home', 'products', 'about', 'why-us', 'journey', 'contact'];
      const y = window.scrollY + 120;
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
        <a href="#home" className="nav-logo" id="navLogo" onClick={closeMenu}>
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="20,2 38,36 2,36" stroke="#f59e0b" strokeWidth="3" fill="none"/>
              <line x1="20" y1="10" x2="20" y2="30" stroke="#f59e0b" strokeWidth="2.5"/>
              <line x1="12" y1="28" x2="28" y2="28" stroke="#f59e0b" strokeWidth="2.5"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-main">Aggarwal</span>
            <span className="logo-sub">Steels</span>
          </div>
        </a>

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

        <div className="nav-actions">
          <a href="tel:+918800885185" className="btn-call" id="btnCall">📞 Get Quote</a>
          <button
            className={`hamburger ${open ? 'open' : ''}`}
            id="hamburger"
            aria-label="Menu"
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
