'use client';
import Link from 'next/link';
import { IconWrench, IconArrowRight } from './Icons';
import { useCatalogue } from '../lib/catalogueApi';
import { groupMeta } from '../lib/machinery';

/**
 * Home-page machinery overview: one card per process group (Cutting & Forming,
 * Machining, Welding, Finishing, Material Handling). Each card lists its
 * machines and opens that group on /manufacturing.
 */
export default function Manufacturing() {
  const { machineGroups } = useCatalogue();
  const total = machineGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="section capabilities-section" id="manufacturing">
      <span id="capabilities" style={{ position: 'relative', top: '-90px', visibility: 'hidden' }}></span>
      <div className="container">
        <div className="section-header">
          <div className="section-label label-cyan">
            <IconWrench size={16} /> IN-HOUSE MACHINERY &bull; MAJESTIC AR TECHNOLOGY
          </div>
          <h2 className="section-title text-white">
            In-House Plant &amp; <span className="text-gradient">Advanced Machinery</span>
          </h2>
          <p className="section-desc text-gray">
            {total} machines across {machineGroups.length} process groups: 5 CNC tandem press brakes, up to 250-Ton power presses,
            continuous roll forming, 35-Ton EOT cranes and North India&apos;s premier 520 ft automated powder coating line.
          </p>
        </div>

        <div className="capabilities-bento mach-groups">
          {machineGroups.slice(0, 3).map((g) => {
            const meta = groupMeta(g);
            const shown = g.items.slice(0, 4);
            const more = g.items.length - shown.length;
            return (
              <Link key={meta.slug} href={`/manufacturing#${meta.slug}`} className="cap-card mach-group-card">
                <div className="cap-img-wrapper">
                  <img src={meta.cover} alt={g.group} className="cap-img" loading="lazy" />
                  <div className="cap-overlay"></div>
                  <span className="cap-badge">{g.items.length} {g.items.length === 1 ? 'machine' : 'machines'}</span>
                </div>
                <div className="cap-content">
                  <h3 className="cap-title">{g.group}</h3>
                  <p className="cap-desc">{meta.blurb}</p>
                  <ul className="cap-specs">
                    {shown.map((m) => <li key={m.slug || m.name} className="cap-spec-tag">{m.name}</li>)}
                    {more > 0 && <li className="cap-spec-tag">+{more} more</li>}
                  </ul>
                  <span className="cap-link">
                    <span>Explore {g.group}</span>
                    <IconArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="section-cta-wrap">
          <Link href="/manufacturing#machinery" className="btn-modern-outline" id="btnViewAllMachinery">
            <span>View all machinery &amp; plant specs</span>
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
