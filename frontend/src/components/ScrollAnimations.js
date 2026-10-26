'use client';
import { useEffect, useState } from 'react';

export default function ScrollAnimations() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Scroll Progress Bar calculation (fallback for browsers without CSS animation-timeline: scroll())
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const scrolled = Math.min(1, Math.max(0, scrollTop / docHeight));
        setProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. IntersectionObserver for Reveal Animations on Scroll
    const selectors = [
      '.section-header',
      '.product-modern-card',
      '.cap-modern-card',
      '.why-modern-card',
      '.milestone-modern-card',
      '.client-modern-logo-wrap',
      '.about-modern-story',
      '.about-profile-card',
      '.story-stats-grid',
      '.order-step-card',
      '.subsidiary-modern-banner',
      '.contact-modern-card',
      '.presence-stat-item',
      '.about-stats-strip .stat-box',
      '.telemetry-stat-box'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    elements.forEach((el, index) => {
      // Mark as revealable
      el.classList.add('scroll-reveal-item');
      // Assign subtle stagger delay for siblings inside the same grid
      const parent = el.parentElement;
      if (parent) {
        const siblingIndex = Array.from(parent.children).indexOf(el);
        if (siblingIndex >= 0) {
          el.style.setProperty('--reveal-delay', `${(siblingIndex % 6) * 70}ms`);
        }
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-revealed');
            // Once revealed, we can keep it revealed for smooth user reading
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="scroll-progress-container" aria-hidden="true">
      <div
        className="scroll-progress-bar"
        id="scrollProgressBar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
