'use client';
import { useCatalogue } from '../lib/catalogueApi';

/**
 * <option>s for every enquiry form, built from the live catalogue: one group per
 * segment, one option per product line. Edited in Admin -> Categories.
 * `current` keeps a pre-filled value (e.g. "Selective pallet racks" from an
 * Enquire link) selectable even when it is an item rather than a product line.
 */
export default function ProductOptions({ current = '', placeholder = 'Select a product...' }) {
  const { tree } = useCatalogue();
  const all = new Set(tree.flatMap((c) => [c.name, ...c.subcategories.map((s) => s.name)]));
  return (
    <>
      <option value="">{placeholder}</option>
      {current && !all.has(current) && <option value={current}>{current}</option>}
      {tree.map((c) => (
        <optgroup key={c.slug} label={c.name}>
          {c.subcategories.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
        </optgroup>
      ))}
      <option value="Other / not sure">Other / not sure</option>
    </>
  );
}
