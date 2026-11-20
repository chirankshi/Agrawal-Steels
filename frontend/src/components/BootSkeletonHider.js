'use client';
import { useEffect } from 'react';

const FIRST_VISIT_MS = 2000; // full brand splash on the first page of a visit
const REPEAT_MS = 1100; // shorter on later refreshes in the same tab
const SEEN_KEY = 'as_splash_seen';

// Decided once per page load (React may run effects twice in development).
let decided = null;
function introLength() {
  if (decided !== null) return decided;
  decided = FIRST_VISIT_MS;
  try {
    if (sessionStorage.getItem(SEEN_KEY)) decided = REPEAT_MS;
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch { /* private mode: use the full intro */ }
  if (window.location.pathname.startsWith('/admin')) decided = 0;
  return decided;
}

/** Lifts the first-paint brand splash once the page has loaded and the intro has played. */
export default function BootSkeletonHider() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('booted')) return undefined;

    const minMs = introLength();

    let timer;
    const hide = () => {
      // Count from when the splash appeared, not from navigation start.
      const shownAt = typeof window.__splashAt === 'number' ? window.__splashAt : 0;
      const elapsed = performance.now() - shownAt;
      timer = setTimeout(() => {
        root.classList.add('booted');
      }, Math.max(0, minMs - elapsed));
    };
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide, { once: true });
    return () => { window.removeEventListener('load', hide); clearTimeout(timer); };
  }, []);
  return null;
}
