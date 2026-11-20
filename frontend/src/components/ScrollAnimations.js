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

    // Reveal-on-scroll now lives in SiteMotion (root layout).

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
