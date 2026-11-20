'use client';
import Link from 'next/link';
import { IconArrowRight } from './Icons';
import { useClients } from '../lib/siteSettings';

/**
 * Home page, right after the hero: a continuously scrolling row of client logos.
 * The list is rendered twice so the loop is seamless; it pauses on hover and
 * stays still for visitors who prefer reduced motion.
 */
export default function TrustStrip() {
  const logos = useClients().filter((c) => c.logo);
  // Short lists are repeated so the track is always wider than the screen.
  const base = logos.length >= 8 ? logos : [...logos, ...logos, ...logos].slice(0, Math.max(8, logos.length));
  const seconds = Math.max(24, base.length * 3.2);

  return (
    <section className="trust-strip" id="trust" aria-label="Our clients">
      <div className="container trust-strip-inner">
        <div className="trust-clients">
          <span className="trust-clients-label">Trusted by</span>
          <div className="trust-marquee">
            <ul className="trust-track" style={{ '--marquee-duration': `${seconds}s` }}>
              {[...base, ...base].map((c, i) => (
                <li key={`${c.name}-${i}`} title={c.name} aria-hidden={i >= base.length ? 'true' : undefined}>
                  <img src={c.logo} alt={i >= base.length ? '' : c.name} />
                </li>
              ))}
            </ul>
          </div>
          <Link href="/clients" className="trust-clients-link">
            All clients <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
