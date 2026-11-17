'use client';
import { useEffect, useMemo, useState } from 'react';

/**
 * Stat cards that double as filters. `cards` = [{ key, label, value, accent }].
 * The active card is highlighted; clicking it again resets to the first card.
 */
export function FilterCards({ cards, active, onSelect }) {
  return (
    <div className="stat-grid filter-cards" style={{ gridTemplateColumns: `repeat(${Math.min(cards.length, 6)}, minmax(0, 1fr))` }}>
      {cards.map((c) => {
        const isActive = active === c.key;
        return (
          <button
            key={c.key}
            type="button"
            className={`panel-card stat-card clickable ${isActive ? 'active' : ''}`}
            style={{ borderLeftColor: c.accent || 'var(--adm-border)' }}
            onClick={() => onSelect(isActive && c.key !== cards[0].key ? cards[0].key : c.key)}
            title={isActive ? 'Click to clear this filter' : `Show only: ${c.label}`}
          >
            <span className="stat-label">{c.label}</span>
            <span className="stat-value">{c.value}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Client-side paging. Returns the current slice plus controls; resets when the list changes. */
export function usePaged(list, pageSize = 10) {
  const [page, setPage] = useState(1);
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { setPage(1); }, [total]);
  const safePage = Math.min(page, pages);
  const slice = useMemo(() => list.slice((safePage - 1) * pageSize, safePage * pageSize), [list, safePage, pageSize]);
  return { page: safePage, pages, total, pageSize, slice, setPage };
}

export function Pagination({ page, pages, total, pageSize, onPage, noun = 'rows' }) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const numbers = [];
  for (let p = Math.max(1, page - 2); p <= Math.min(pages, page + 2); p += 1) numbers.push(p);
  return (
    <div className="pagination">
      <span className="pagination-info">Showing {from}–{to} of {total} {noun}</span>
      <div className="pagination-controls">
        <button type="button" className="page-btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>‹ Prev</button>
        {numbers[0] > 1 && <><button type="button" className="page-btn" onClick={() => onPage(1)}>1</button><span className="page-gap">…</span></>}
        {numbers.map((p) => (
          <button key={p} type="button" className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onPage(p)}>{p}</button>
        ))}
        {numbers[numbers.length - 1] < pages && <><span className="page-gap">…</span><button type="button" className="page-btn" onClick={() => onPage(pages)}>{pages}</button></>}
        <button type="button" className="page-btn" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next ›</button>
      </div>
    </div>
  );
}
