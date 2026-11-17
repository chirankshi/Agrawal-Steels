'use client';
import { useState } from 'react';
import { IconCheckCircle } from './Icons';
import { useCatalogue } from '../lib/catalogueApi';

/**
 * In-house machinery from the catalogue, grouped (Cutting & Forming, Machining, Welding,
 * Finishing, Material Handling & Plant). Data comes from Supabase via useCatalogue().
 */
export default function MachineryShowcase() {
  const { machineGroups } = useCatalogue();
  const [active, setActive] = useState('all');
  const groups = active === 'all' ? machineGroups : machineGroups.filter((g) => g.group === active);
  const total = machineGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="mfg-machinery-section" id="machinery">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">FABRICATION INFRASTRUCTURE</span>
          <h2 className="section-title">In-House Machinery &amp; Plant</h2>
          <p className="section-desc">
            {total} machines across {machineGroups.length} process groups: CNC cutting and forming, machining, welding, a 520 ft automated
            powder coating line and heavy material handling for 700 to 1,000 MT per month of structural output.
          </p>
        </div>

        <div className="machinery-group-tabs">
          <button type="button" className={`sub-chip ${active === 'all' ? 'active' : ''}`} onClick={() => setActive('all')}>All</button>
          {machineGroups.map((g) => (
            <button key={g.group} type="button" className={`sub-chip ${active === g.group ? 'active' : ''}`} onClick={() => setActive(g.group)}>
              {g.group} <span className="sub-chip-count">{g.items.length}</span>
            </button>
          ))}
        </div>

        {groups.map((g) => (
          <div key={g.group} className="machinery-group">
            <h3 className="machinery-group-title">{g.group}</h3>
            <div className="machinery-specs-grid">
              {g.items.map((m) => (
                <div key={m.slug || m.id} className={`machinery-spec-card ${m.image_url ? 'has-image' : ''}`}>
                  {m.image_url && (
                    <div className="machinery-card-img">
                      <img src={m.image_url} alt={m.name} loading="lazy" />
                    </div>
                  )}
                  <div className="machinery-badge">{g.group}</div>
                  <h3>{m.name}</h3>
                  <p>{m.spec}</p>
                  <div className="machinery-metric-row">
                    <div>
                      <span className="metric-number">{m.qty ?? '—'}</span>
                      <span className="metric-label">{m.qty === 1 ? 'Unit' : 'Units'}</span>
                    </div>
                    {m.catalogue_page && (
                      <div>
                        <span className="metric-number">p.{m.catalogue_page}</span>
                        <span className="metric-label">Catalogue</span>
                      </div>
                    )}
                  </div>
                  {m.stages.length > 0 && (
                    <ul className="mfg-feature-list machinery-stages">
                      {m.stages.map((s, i) => (
                        <li key={s}><IconCheckCircle size={14} /> {i + 1}. {s}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
