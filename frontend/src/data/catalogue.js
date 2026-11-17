/**
 * Machine and product hierarchy, transcribed from the 2026 catalogues:
 *  - "Lst Catalogue.pdf"            Aggarwal Steels + Majestic AR joint catalogue (32 p)
 *  - "2ndlast draft.pdf"            Majestic AR Technology Product Catalogue 2026 (27 p)
 *  - "Updated Catalogue.pdf"        Aggarwal Steels Catalogue 2026 (13 p)
 *  - "New Catloge ... 2025.pdf"     Aggarwal Steels trading catalogue 2025 (16 p)
 *
 * This file is the SEED and offline fallback. The live copy lives in Supabase
 * (tables `categories`, `subcategories`, `machines`) and is edited from the admin
 * desk; see src/lib/catalogueApi.js. `page` numbers refer to the joint catalogue.
 */

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const RAW_MACHINES = [
  {
    group: 'Cutting & Forming',
    items: [
      { name: 'CNC Laser Cutting Machine', spec: '3 kW fibre laser, sheet & plate profiling', qty: 1, page: 6 },
      { name: 'CNC Bending Machines (Tandem)', spec: 'Energy Mission & HACO press brakes, up to 12 mm plate, ±0.2 mm repeatability, 4,000 mm bed', qty: 5, page: 7 },
      { name: 'Hydraulic Shearing Machine', spec: 'High-speed variable-rake shear, plates up to 12 mm, 3.1 m blade', qty: 1, page: 7 },
      { name: 'Power Press', spec: 'Mechanical / hydraulic, up to 250 T, stamping & piercing', qty: 1, page: 7 },
      { name: 'Roll Forming Machine', spec: 'Slotted angle, racking upright, MKM & Omega sections', qty: 1, page: 8 },
    ],
  },
  {
    group: 'Machining',
    items: [
      { name: 'CNC Milling (CTL)', spec: 'High-precision machining of components', qty: 1, page: 7 },
      { name: 'Vertical Milling Machine', spec: 'Custom component machining', qty: 1, page: 7 },
      { name: 'Lathe', spec: 'Turning of shafts, pins and fittings', qty: 1, page: 7 },
      { name: 'CNC Milling & Turning Centre', spec: 'Precision turned parts', qty: 1, page: 7 },
    ],
  },
  {
    group: 'Welding',
    items: [
      { name: 'TIG / MIG Welding Machines', spec: 'Miller units, SS & MS fabrication', qty: null, page: 8 },
      { name: 'Spot Welding Machine', spec: 'Panels & enclosures', qty: 1, page: 8 },
      { name: 'Robotic Welding Cell', spec: 'Repeatable structural welds', qty: 1, page: 8 },
    ],
  },
  {
    group: 'Finishing',
    items: [
      {
        name: '520 ft Automated Powder Coating Plant',
        spec: 'Conveyorised line with robotic arm; 9-stage pre-treatment, automatic booth, camel-back curing oven; parts up to 12 m long; 70–80 micron DFT; 500 h salt-spray',
        qty: 1,
        page: 9,
        stages: ['Loading & hanging', 'Pre-treatment & cleaning', 'Automatic powder coating booth', 'Curing oven', 'Conveyor', 'Finished products', 'Quality checking', 'Unloading & handling', 'Final output'],
      },
    ],
  },
  {
    group: 'Material Handling & Plant',
    items: [
      { name: 'EOT Cranes 35 T', spec: '1st bay', qty: 2, page: 9 },
      { name: 'EOT Cranes 15 T', spec: '2nd bay', qty: 2, page: 9 },
      { name: 'Hydra Crane 15 T', spec: 'Yard handling', qty: 1, page: 9 },
      { name: 'Forklift 4 T', spec: 'Stockyard & dispatch', qty: 1, page: 9 },
    ],
  },
];

const RAW_TREE = [
  {
    id: 'steel-supply',
    name: 'Primary Steel Supply & Trading',
    company: 'Aggarwal Steels',
    partners: ['Tata Steel (authorised dealer)', 'Jindal Steel (authorised dealer)', 'SAIL', 'AM/NS India', 'APL Apollo', 'Jindal Stainless'],
    page: 24,
    subcategories: [
      { name: 'TMT Bars', items: ['Fe 415', 'Fe 500D', 'Fe 550D'] },
      { name: 'Plates & Coils', items: ['HR plates', 'HR coils', 'CR coils & slit coils', 'GP coils & sheets', 'Chequered plates', 'Roofing sheets', 'Perforated sheets'] },
      { name: 'Structural Sections', items: ['MS angles (equal & unequal)', 'MS channels (ISMC)', 'MS beams (ISMB / NPB / WPB)', 'MS flats', 'MS round & square bars'] },
      { name: 'Pipes & Hollow Sections', items: ['Square (SHS)', 'Rectangular (RHS)', 'Round pipes'] },
      { name: 'Stainless Steel', items: ['SS sheets 202 / 304 / 316', 'SS pipes & tubes'] },
      { name: 'Rail Lines', items: ['New rail lines', 'Old rail lines'] },
    ],
  },
  {
    id: 'racking',
    name: 'Storage & Warehouse Racking',
    company: 'Majestic AR Technology',
    page: 12,
    subcategories: [
      { name: 'Pallet Storage Systems', items: ['Selective pallet racks', 'Double-deep pallet racks', 'Narrow-aisle pallet racks', 'Drive-in pallet racks', 'Drive-through pallet racks', 'Cantilever racks', 'Mobile pallet racks', 'Pallet flow racks', 'Heavy-duty racks with decking panel'] },
      { name: 'Shelving', items: ['Slotted angle racks', 'Long span shelving (LSS)', 'Light-duty shelving', 'Bin storage racks', 'Small parts storage', 'Adjustable shelves', 'L-shape racks'] },
      { name: 'Display Racks (Supermarket)', items: ['Gondola racks', 'Wall racks', 'End racks', 'Corner racks', 'Island racks', 'Slotted display racks', 'Fruit & vegetable racks', 'Bakery racks', 'Checkout racks'] },
      { name: 'Metal Pallets', items: ['Powder-coated pallet', 'Powder-coated slatted pallet', 'GI pallet', 'Custom pallet'] },
      { name: 'Rack Accessories', items: ['Column guard', 'Row guard', 'Wire mesh partition', 'Pallet support bar (PSB)', 'Pallet back stopper', 'Base plate'] },
    ],
  },
  {
    id: 'mezzanine',
    name: 'Mezzanine Floors & Multi-Tier',
    company: 'Majestic AR Technology',
    page: 13,
    subcategories: [
      { name: 'Mezzanine Floors', items: ['Storage mezzanine', 'Office mezzanine', 'Industrial mezzanine', 'Multi-level mezzanine', 'Mezzanine with conveyor', 'Staircases & safety railings', 'Heavy-duty floor decking'] },
      { name: 'Multi-Tier Racking', items: ['2-tier racking system', '3-tier racking system', 'Multi-level storage', 'Rack-supported mezzanine', 'Integrated solutions'] },
    ],
  },
  {
    id: 'material-handling',
    name: 'Material Handling',
    company: 'Majestic AR Technology',
    page: 15,
    subcategories: [
      { name: 'Trolleys', items: ['Platform trolley', 'Mesh-side platform trolley', 'Roll cage trolley', 'Collapsible mesh container', 'Bin trolley', 'Tool trolley', 'Order-picking trolley with step', 'Heavy platform trolley', 'Hand pallet truck'] },
      { name: 'Conveyors', items: ['Roller conveyor (gravity & motorised)', 'Belt conveyor', 'Skate wheel conveyor', 'Spiral conveyor', 'Loading / unloading conveyor', 'Modular conveyor', 'Flexible conveyor'] },
      { name: 'Workstations & Assembly Lines', items: ['Aluminium profile workstation', 'Pipe joint workstation', 'Assembly line workstation', 'Complete assembly lines'] },
    ],
  },
  {
    id: 'ms-sheet-metal',
    name: 'MS Sheet Metal Fabrication',
    company: 'Majestic AR Technology',
    page: 17,
    subcategories: [
      { name: 'Cabinets & Enclosures', items: ['Electrical panel cabinets', 'Control panel cabinets', 'Outdoor cabinets', 'Data centre cabinets', 'Telecom cabinets', 'Wall-mount cabinets', 'Modular cabinets', 'Industrial cabinets', 'Customised cabinets'] },
      { name: 'Tanks & Boxes', items: ['Transformer tanks', 'Oil storage tanks', 'Diesel storage tanks', 'Horizontal tanks', 'Vertical tanks', 'Process tanks', 'Battery boxes', 'Inverter boxes', 'UPS boxes', 'Junction boxes', 'Outdoor electrical boxes'] },
      { name: 'Panels', items: ['Plain panel', 'Stiffened panel', 'Powder-coated panel', 'GI panel', 'Perforated panel', 'Louvered panel', 'Panel with stiffener', 'CR panels'] },
      { name: 'Components for OEMs', items: ['Battery box (EV)', 'Outdoor cabinet', 'Indoor cabinet', 'Electrical panel box', 'Fixture & chassis', 'Industrial UPS cabinet', 'Small UPS cabinet', 'Network rack', 'Server rack', 'Wall-mount rack', 'Genset canopy / outer body'] },
      { name: 'Shelves, Benches & Partitions', items: ['MS shelves & racks', 'Work tables & benches', 'Industrial trolleys', 'Gates, grills & partitions', 'Custom fabricated parts', 'Brackets & mounting parts', 'Cable trays & covers'] },
    ],
  },
  {
    id: 'ss-fabrication',
    name: 'Stainless Steel Fabrication & Commercial Kitchen',
    company: 'Majestic AR Technology',
    page: 16,
    subcategories: [
      { name: 'Commercial Kitchen Equipment', items: ['Cooking ranges', 'Bain marie', 'Griddles & fryers', 'Work tables (with / without backsplash)', 'Pot racks & wall shelves', 'Sinks & dish-wash units', 'Hand-wash stations', 'Exhaust hoods & ducts'] },
      { name: 'SS Counters, Shelving & Trolleys', items: ['SS counters', 'Display counters', 'Food service equipment', 'SS shelves & shelving units', 'Bakery racks', 'Service trolleys', 'SS storage racks', 'Locker cabinets', 'Wall cabinets', 'Louvered cabinets'] },
      { name: 'Hygiene & Sanitation', items: ['SS sinks & wash units', 'Hand-wash & sanitisation units', 'SS dustbins', 'Toilet partitions', 'Cleanroom equipment'] },
      { name: 'SS Industrial Structures', items: ['Railway battery boxes', 'SS cable trays & supports', 'Handrails & railings', 'Laser-cut panels', 'Ducting & ventilation', 'Enclosures & panels', 'Customised SS structures (platforms, staircases, frames)'] },
    ],
  },
  {
    id: 'heavy-structural',
    name: 'Heavy Structural Fabrication & PEB',
    company: 'Aggarwal Steels (Unit 1)',
    capacity: '700 to 1,000 MT per month, ISO 3834-2 welding',
    page: 21,
    subcategories: [
      { name: 'Buildings', items: ['Pre-engineered buildings (PEB)', 'Industrial sheds', 'Shed & canopy fabrication'] },
      { name: 'Bridges & Rail', items: ['Bridge structures', 'Road over-bridge (ROB)', 'Foot over-bridge (FOB)', 'Truss & bridge fabrication'] },
      { name: 'Industrial Structures', items: ['EOT crane girders', 'Transmission tower structures', 'Platforms & walkways', 'Support structures', 'Pipe structures', 'Staircase fabrication', 'Ducting fabrication', 'Tank structures'] },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure Components',
    company: 'Majestic AR Technology',
    page: 20,
    subcategories: [
      { name: 'Scaffolding Systems', items: ['Scaffolding GI planks', 'Modular scaffolding'] },
      { name: 'Cable Tray Systems', items: ['Perforated cable tray', 'Ladder cable tray', 'Cable tray accessories'] },
      { name: 'Road Crash Barriers', items: ['W-beam crash barriers', 'Crash barrier components', 'Posts & accessories'] },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    company: 'Majestic AR Technology',
    page: 9,
    subcategories: [
      { name: 'Finishing', items: ['Powder coating job work (520 ft line, up to 12 m parts)'] },
      { name: 'Fabrication to Drawing', items: ['Laser cutting', 'CNC bending', 'Custom fabrication from CAD / DXF', 'Build-to-print sheet metal'] },
      { name: 'Project Services', items: ['In-house design & R&D', 'Site installation & erection', 'After-sales support'] },
    ],
  },
];

export const INDUSTRIES_SERVED = [
  'Warehousing & 3PL logistics', 'E-commerce & quick commerce', 'Retail & FMCG', 'Automotive & auto components', 'Electric vehicles', 'Telecom & IT',
  'Power & electrical', 'Defence', 'Railways', 'Pharma & cleanrooms', 'Hotels, restaurants & cloud kitchens', 'Hospitals & healthcare',
  'Cold storage', 'Refineries & process plants', 'Aviation', 'Commercial buildings & high-rises', 'Factories & manufacturing units',
];

// ---------------------------------------------------------------------------
// Derived, slug-bearing exports (what the app and the seeds actually use)
// ---------------------------------------------------------------------------

/** Machines grouped as in the catalogue, each with a stable slug. */
export const MACHINES = RAW_MACHINES.map((g, gi) => ({
  group: g.group,
  sort_order: (gi + 1) * 10,
  items: g.items.map((m, mi) => ({
    slug: slugify(m.name),
    group_name: g.group,
    name: m.name,
    spec: m.spec || '',
    qty: m.qty ?? null,
    stages: m.stages || [],
    image_url: m.image_url || '',
    catalogue_page: m.page ?? null,
    sort_order: (gi + 1) * 100 + (mi + 1) * 10,
    is_active: true,
  })),
}));

/** Product categories with slug-bearing sub-categories. */
export const PRODUCT_TREE = RAW_TREE.map((c, ci) => ({
  slug: c.id,
  id: c.id,
  name: c.name,
  company: c.company || '',
  description: c.description || '',
  partners: c.partners || [],
  capacity: c.capacity || '',
  catalogue_page: c.page ?? null,
  image_url: c.image_url || '',
  sort_order: (ci + 1) * 10,
  is_active: true,
  subcategories: c.subcategories.map((sc, si) => ({
    slug: slugify(sc.name),
    category_slug: c.id,
    name: sc.name,
    description: sc.description || '',
    items: sc.items || [],
    image_url: sc.image_url || '',
    catalogue_page: sc.page ?? c.page ?? null,
    sort_order: (si + 1) * 10,
    is_active: true,
  })),
}));

/** Flat rows, in the exact shape of the Supabase / API tables. */
export const CATEGORY_SEED = PRODUCT_TREE.map(({ subcategories, id, ...row }) => row);
export const SUBCATEGORY_SEED = PRODUCT_TREE.flatMap((c) => c.subcategories);
export const MACHINE_SEED = MACHINES.flatMap((g) => g.items);

/** Old 5-category labels (pre-2026 admin) -> catalogue category slug. */
export const LEGACY_CATEGORY_SLUGS = {
  'Storage & Warehouse Racking': 'racking',
  'Mezzanine & Multi-Tier': 'mezzanine',
  'SS Kitchen & Sheet Metal': 'ss-fabrication',
  'Heavy Structural & PEB': 'heavy-structural',
  'Primary Steel Supply': 'steel-supply',
};

/** Rebuilds the nested tree from flat category + sub-category rows (any store). */
export function buildTree(categories = [], subcategories = []) {
  const bySort = (a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || String(a.name).localeCompare(String(b.name));
  return [...categories]
    .sort(bySort)
    .map((c) => ({
      ...c,
      id: c.slug,
      partners: Array.isArray(c.partners) ? c.partners : [],
      subcategories: subcategories
        .filter((s) => s.category_slug === c.slug)
        .map((s) => ({ ...s, items: Array.isArray(s.items) ? s.items : [] }))
        .sort(bySort),
    }));
}

/** Groups flat machine rows by `group_name`, keeping the catalogue group order. */
export function groupMachines(rows = []) {
  const order = RAW_MACHINES.map((g) => g.group);
  const groups = new Map();
  [...rows]
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
    .forEach((m) => {
      const key = m.group_name || 'Other';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ ...m, stages: Array.isArray(m.stages) ? m.stages : [] });
    });
  return [...groups.entries()]
    .sort(([a], [b]) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })
    .map(([group, items]) => ({ group, items }));
}

/**
 * Resolves which category / sub-category a product belongs to.
 * Prefers the stored slugs, then falls back to the legacy label map and name matching.
 */
export function resolveProductPlacement(product, tree = PRODUCT_TREE) {
  let category = tree.find((c) => c.slug === product.category_slug);
  if (!category) {
    const legacy = LEGACY_CATEGORY_SLUGS[product.category];
    category = tree.find((c) => c.slug === legacy || c.name === product.category);
  }
  if (!category) return { category: null, subcategory: null };
  const subcategory =
    category.subcategories.find((s) => s.slug === product.subcategory_slug) ||
    category.subcategories.find((s) => s.name === product.subcategory) ||
    null;
  return { category, subcategory };
}
