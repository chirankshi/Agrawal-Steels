'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconCheckCircle, IconArrowRight } from './Icons';
import { useCatalogue } from '../lib/catalogueApi';
import { groupMeta, machinePhoto, totalUnits } from '../lib/machinery';
import { slugify } from '../data/catalogue';

const machineAnchor = (m) => `m-${m.slug || slugify(m.name)}`;

/** One machine: photo card when we have a photo, otherwise a spec card. */
function MachineCard({ m, index }) {
  const photo = machinePhoto(m);
  const units = m.qty ? `${m.qty} ${m.qty === 1 ? 'unit' : 'units'}` : 'Multiple units';
  const body = (
    <>
      <h3>{m.name}</h3>
      {m.spec && <p>{m.spec}</p>}
      <div className="mach-meta">
        <span>{units}</span>
        {m.catalogue_page && <span>Catalogue p.{m.catalogue_page}</span>}
      </div>
      {m.stages.length > 0 && (
        <ul className="mfg-feature-list machinery-stages">
          {m.stages.map((s, i) => <li key={s}><IconCheckCircle size={14} /> {i + 1}. {s}</li>)}
        </ul>
      )}
    </>
  );
  if (!photo) {
    return (
      <article className="prod-spec" id={machineAnchor(m)}>
        <span className="prod-spec-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        {body}
      </article>
    );
  }
  return (
    <article className="prod-tile" id={machineAnchor(m)}>
      <div className="prod-tile-media"><img src={photo} alt={m.name} loading="lazy" /></div>
      <div className="prod-tile-body">{body}</div>
    </article>
  );
}

/**
 * In-house machinery as a two-level catalogue: Process group -> Machine.
 * The open group is kept in the URL hash (#welding), so home-page cards can
 * link straight to it. Data comes from Supabase via useCatalogue().
 */
export default function MachineryShowcase() {
  const { machineGroups } = useCatalogue();
  const [hash, setHash] = useState('');
  useEffect(() => {
    const read = () => setHash(decodeURIComponent(window.location.hash.slice(1)));
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const total = machineGroups.reduce((n, g) => n + g.items.length, 0);
  const group = machineGroups.find((g) => groupMeta(g).slug === hash) || machineGroups[0];

  // Arriving from a home-page card (#welding): bring the browser into view.
  useEffect(() => {
    if (!group || groupMeta(group).slug !== hash) return;
    const t = setTimeout(() => document.getElementById('machinery')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    return () => clearTimeout(t);
  }, [hash, group]);

  const pickGroup = (slug) => {
    setHash(slug);
    window.history.replaceState(null, '', `#${slug}`);
    document.getElementById('machinery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const jumpToMachine = (m) => {
    document.getElementById(machineAnchor(m))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (!group) return null;
  const meta = groupMeta(group);

  return (
    <section className="mfg-machinery-section" id="machinery">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">FABRICATION INFRASTRUCTURE</span>
          <h2 className="section-title">In-House Machinery &amp; Plant</h2>
          <p className="section-desc">
            {total} machines across {machineGroups.length} process groups, for 700 to 1,000 MT per month of structural output.
            Pick a group to see its machines.
          </p>
        </div>
      </div>

      <div className="section-container cat-browser">
        {/* Left: Process group -> Machine tree */}
        <aside className="cat-side" aria-label="Browse machinery">
          <span className="cat-side-title">Browse machinery</span>
          <select
            className="cat-side-select"
            value={meta.slug}
            onChange={(e) => pickGroup(e.target.value)}
            aria-label="Process group"
          >
            {machineGroups.map((g) => <option key={g.group} value={groupMeta(g).slug}>{g.group}</option>)}
          </select>
          <ul className="cat-tree">
            {machineGroups.map((g) => {
              const slug = groupMeta(g).slug;
              const open = slug === meta.slug;
              return (
                <li key={g.group} className={open ? 'open' : undefined}>
                  <button type="button" className="cat-tree-seg" aria-expanded={open} onClick={() => pickGroup(slug)}>
                    <span>{g.group}</span>
                    <em>{g.items.length}</em>
                  </button>
                  {open && (
                    <ul className="cat-tree-lines">
                      {g.items.map((m) => (
                        <li key={m.slug || m.name}>
                          <button type="button" onClick={() => jumpToMachine(m)}>
                            <span>{m.name}</span>
                            <em>{m.qty || '•'}</em>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right: the selected group only */}
        <div className="cat-main">
          <section className="prod-line" key={meta.slug}>
            <header className="prod-line-head">
              <div className="prod-line-photo"><img src={meta.cover} alt={group.group} /></div>
              <div className="prod-line-text">
                <span className="prod-line-count">
                  {group.items.length} {group.items.length === 1 ? 'machine' : 'machines'} &bull; {totalUnits(group)}+ units
                </span>
                <h2>{group.group}</h2>
                <p>{meta.blurb}</p>
              </div>
              <div className="prod-line-cta">
                <Link href={`/contact?product=${encodeURIComponent(`Job work: ${group.group}`)}`} className="segment-panel-cta">
                  Enquire <IconArrowRight size={13} />
                </Link>
              </div>
            </header>
            <div className="prod-tile-grid">
              {group.items.map((m, i) => <MachineCard key={m.slug || m.name} m={m} index={i} />)}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
