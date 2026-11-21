import { slugify } from '../data/catalogue';

/**
 * Presentation helpers for the machinery hierarchy (Process group -> Machine).
 * Machine rows come from Supabase via useCatalogue(); a photo uploaded in
 * Admin > Machines always wins over these plant photos.
 */
const IMG = (f) => `/images/catalogue/${f}`;

const MACHINE_PHOTOS = {
  'cnc-laser-cutting-machine': IMG('laser-cutting-machine.jpg'),
  'cnc-bending-machines-tandem': IMG('cnc-bending-tandem.jpg'),
  'hydraulic-shearing-machine': IMG('shearing-machine.jpg'),
  'power-press': IMG('power-press.jpg'),
  'roll-forming-machine': IMG('roll-forming-machine.jpg'),
  'tig-mig-welding-machines': IMG('tig-mig-welding.jpg'),
  'spot-welding-machine': IMG('spot-welding.jpg'),
  '520-ft-automated-powder-coating-plant': IMG('powder-coating-plant.jpg'),
  'eot-cranes-35-t': IMG('eot-crane-35t.jpg'),
  'eot-cranes-15-t': IMG('eot-crane-15t.jpg'),
  'hydra-crane-15-t': IMG('hydra-crane-15t.jpg'),
  'forklift-4-t': IMG('forklift-4t.jpg'),
};

const GROUP_META = {
  'cutting-forming': {
    cover: IMG('cnc-bending-tandem.jpg'),
    blurb: 'Fibre laser cutting, 5 CNC tandem press brakes, shearing, power presses up to 250 T and continuous roll forming.',
  },
  machining: {
    cover: IMG('ms-custom-parts.jpg'),
    blurb: 'CNC milling, turning and conventional machining for shafts, pins, fittings and custom components.',
  },
  welding: {
    cover: IMG('tig-mig-welding.jpg'),
    blurb: 'Miller TIG / MIG stations, spot welding and a robotic welding cell for SS and MS fabrication.',
  },
  finishing: {
    cover: IMG('powder-coating-plant.jpg'),
    blurb: '520 ft conveyorised powder coating line: 9-stage pre-treatment, automatic booth and curing oven.',
  },
  'material-handling-plant': {
    cover: IMG('eot-crane-35t.jpg'),
    blurb: '35 T and 15 T EOT cranes, a 15 T hydra and forklifts for heavy handling and fast dispatch.',
  },
};

export const groupSlug = (g) => slugify(g.group);

/** Cover photo + one-line summary for a process group. */
export function groupMeta(g) {
  const meta = GROUP_META[groupSlug(g)] || {};
  const firstPhoto = g.items.map(machinePhoto).find(Boolean);
  return {
    slug: groupSlug(g),
    cover: meta.cover || firstPhoto || IMG('sustainability-plant.jpg'),
    blurb: meta.blurb || `${g.items.length} machines in-house.`,
  };
}

/** The machine's own uploaded photo, else a matching plant photo, else ''. */
export function machinePhoto(m) {
  return m.image_url || MACHINE_PHOTOS[m.slug] || MACHINE_PHOTOS[slugify(m.name)] || '';
}

export const totalUnits = (g) => g.items.reduce((n, m) => n + (Number(m.qty) || 1), 0);
