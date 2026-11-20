'use client';
import { useEffect, useRef } from 'react';

/**
 * Ultra-smooth 60/120fps direct-DOM animated counter.
 * Bypasses React re-renders during animation to prevent micro-stutters and frame drops.
 * Dynamically adjusts duration and easing based on number magnitude for natural motion.
 */
export default function CountUp({
  target = 100,
  prefix = '',
  suffix = '',
  className = '',
  unitClassName = 'stat-unit',
  decimals = 0
}) {
  const containerRef = useRef(null);
  const numberRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const endVal = Number(target) || 0;
    const fmt = (v) => v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    
    // Set appropriate duration based on target size to eliminate awkward pauses on small numbers
    let dynamicDuration = 1100;
    if (endVal <= 10) {
      dynamicDuration = 600;
    } else if (endVal <= 30) {
      dynamicDuration = 750;
    } else if (endVal <= 100) {
      dynamicDuration = 950;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          let startTime = null;
          const startVal = 0;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / dynamicDuration, 1);

            // Smooth cubic ease-out curve
            const ease = 1 - Math.pow(1 - progress, 2.5);
            const factor = Math.pow(10, decimals);
            const currentVal = Math.round((startVal + ease * (endVal - startVal)) * factor) / factor;

            if (numberRef.current) {
              numberRef.current.textContent = fmt(currentVal);
            }

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              if (numberRef.current) {
                numberRef.current.textContent = fmt(endVal);
              }
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [target, decimals]);

  return (
    <span ref={containerRef} className={`counter-number ${className}`}>
      {prefix}
      <span ref={numberRef} className="counter-val">
        {(Number(target) || 0).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      </span>
      {suffix && <span className={unitClassName}>{suffix}</span>}
    </span>
  );
}
