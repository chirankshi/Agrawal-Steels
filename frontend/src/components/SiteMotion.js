'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Site-wide motion, mounted once in the root layout:
 *  - scroll reveal (fade / rise / zoom / slide) with a stagger inside each grid,
 *    including cards that render later (catalogue data loads after hydration);
 *  - a cursor spotlight on cards (sets --mx / --my);
 *  - a gentle 3D tilt on large photo cards.
 * Skipped on /admin and for visitors who prefer reduced motion.
 */
const REVEAL = [
  // [selector, variant]
  ['.section-header, .cat-head-text, .products-landing-text', 'up'],
  ['.segment-card, .prod-tile, .prod-spec, .why-modern-card, .order-step-card, .cert-mini, .milestone-modern-box, .mv-modern-card, .sla-item', 'up'],
  ['.cap-card', 'zoom'],
  ['.prod-line-head, .growth-chart-wrap, .principle-banner, .cert-trust-banner, .footer-cta', 'zoom'],
  ['.about-modern-content, .contact-form-container, .founder-modern-card', 'left'],
  ['.contact-sidebar, .about-modern-cards, .corporate-details-card, .whatsapp-action-card', 'right'],
  ['.cat-side', 'left'],
  ['.footer-col, .footer-brand-col', 'up'],
];
const SPOTLIGHT = '.segment-card, .prod-tile, .prod-spec, .why-modern-card, .order-step-card, .mv-modern-card, .cert-mini, .milestone-modern-box, .cap-card';
const TILT = '.segment-card, .cap-card';

export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.setAttribute('data-in', '');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    // Tracked per run (not via the data attribute) so a re-run after cleanup,
    // e.g. React's dev double-mount, observes everything again.
    const seen = new WeakSet();
    const scan = () => {
      REVEAL.forEach(([sel, variant]) => {
        document.querySelectorAll(sel).forEach((el) => {
          if (seen.has(el) || el.hasAttribute('data-in') || el.closest('.trust-track')) return;
          seen.add(el);
          if (!el.dataset.reveal) el.dataset.reveal = variant;
          const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(sel)) : [];
          el.style.setProperty('--rv-delay', `${Math.min(sibs.indexOf(el), 7) * 80}ms`);
          io.observe(el);
        });
      });
    };
    // Start only after the page (and its streamed sections) has hydrated, so we
    // never touch server-rendered attributes React is still checking.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      document.documentElement.classList.add('motion-ok');
      scan();
      mo.observe(document.body, { childList: true, subtree: true });
    };
    const kick = () => setTimeout(() => (window.requestIdleCallback || setTimeout)(start, { timeout: 800 }), 120);

    // Cards rendered later (catalogue, settings, line filter) get picked up too.
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; scan(); });
    });
    if (document.readyState === 'complete') kick();
    else window.addEventListener('load', kick, { once: true });

    // Cursor spotlight + tilt, via one delegated listener.
    let tilted = null;
    const onMove = (ev) => {
      const card = ev.target.closest?.(SPOTLIGHT);
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
        card.style.setProperty('--my', `${ev.clientY - r.top}px`);
      }
      const t = ev.target.closest?.(TILT);
      if (tilted && tilted !== t) { tilted.style.removeProperty('--tilt-x'); tilted.style.removeProperty('--tilt-y'); }
      tilted = t;
      if (t && window.matchMedia('(hover: hover)').matches) {
        const r = t.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width - 0.5;
        const py = (ev.clientY - r.top) / r.height - 0.5;
        t.style.setProperty('--tilt-x', `${(-py * 6).toFixed(2)}deg`);
        t.style.setProperty('--tilt-y', `${(px * 6).toFixed(2)}deg`);
      }
    };
    const onLeave = () => { if (tilted) { tilted.style.removeProperty('--tilt-x'); tilted.style.removeProperty('--tilt-y'); tilted = null; } };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      started = true;
      window.removeEventListener('load', kick);
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [pathname]);

  return null;
}
