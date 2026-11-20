/**
 * Single source of truth for the corporate client roster.
 * Used by the home-page PartnersStrip and the /clients page so logos,
 * names and sectors never drift apart.
 */
export const CLIENTS = [
  { name: 'Amazon', logo: '/images/brand/client_1.png', category: 'E-Commerce Fulfillment', project: 'High-Bay Pallet Racking & Multi-Tier Shelving' },
  { name: 'Maruti Suzuki', logo: '/images/brand/client_maruti_cat.png', category: 'Automotive Giant', project: 'Heavy-Duty Storage & Press Component Racks' },
  { name: 'M3M India', logo: '/images/brand/client_11.png', category: 'Mega Real Estate', project: 'Structural Steel Beams, Plates & PEB Supply' },
  { name: 'KEI Wires & Cables', logo: '/images/brand/client_3.png', category: 'Heavy Electrical', project: 'Cable Drum Heavy Cantilever Racking & Structural Steel' },
  { name: 'AFCONS Infrastructure', logo: '/images/brand/client_6.png', category: 'National EPC & Bridges', project: 'Heavy ISMB Girders & Bridge Structural Steel' },
  { name: 'Kuehne + Nagel', logo: '/images/brand/client_4.png', category: 'Global Logistics', project: 'Selective Pallet Racking & Warehouse Mezzanines' },
  { name: 'Yusen Logistics', logo: '/images/brand/client_2.png', category: 'Supply Chain Operations', project: 'Drive-In & Double-Deep Pallet Storage Racks' },
  { name: 'Jubilant', logo: '/images/brand/client_7.png', category: 'Pharma & Chemicals', project: 'Powder-Coated Storage Racking & Slotted Angle Shelving' },
  { name: 'AIPL', logo: '/images/brand/client_8_whitebg.png', category: 'Commercial Spaces', project: 'Structural Steel Supply & Fabricated Sections' },
  { name: 'SKH (Krishna Group)', logo: '/images/brand/client_10.png', category: 'Precision Metal Stamping', project: 'Component Storage Racks & Material Handling Trolleys' },
  { name: 'Pioneer', logo: '/images/brand/client_5.png', category: 'Industrial Systems', project: 'Custom Storage Racking & Steel Platforms' },
  // Logos below were cut from the 2026 catalogue's clients page. Those still null have
  // no logo in the catalogue and render as a name tile until artwork is supplied.
  { name: 'Zepto', logo: '/images/brand/client_zepto.png', category: 'Quick Commerce', project: 'Dark-Store Shelving & Pallet Racking' },
  { name: 'Delhivery', logo: null, category: 'Logistics & 3PL', project: 'Sortation Centre Racking & Mezzanines' },
  { name: 'FIBS Logistics', logo: '/images/brand/client_fibs.png', category: 'Warehousing', project: 'Selective Pallet Racking Systems' },
  { name: 'SP Singla Constructions', logo: '/images/brand/client_sp_singla.png', category: 'Bridges & Infrastructure', project: 'Structural Steel & Plate Supply' },
  { name: 'Indian Railways Entities', logo: '/images/brand/client_railways.png', category: 'Railways', project: 'Railway Components & Steel Supply' },
  { name: 'Exicom', logo: null, category: 'EV Charging & Power', project: 'Precision Sheet Metal Enclosures' },
  { name: 'Raylo Power', logo: null, category: 'Power Electronics', project: 'Battery Boxes & Cabinets' },
  { name: 'Popeyes', logo: null, category: 'Food Service', project: 'SS Commercial Kitchen Equipment' },
  { name: "Domino's", logo: null, category: 'Food Service', project: 'SS Kitchen Counters & Shelving' },
];

export const PRIMARY_MILLS = [
  { id: 'partnerSail', name: 'SAIL', title: 'Steel Authority of India Ltd.', badge: 'MTC Certified' },
  { id: 'partnerTata', name: 'TATA STEEL', title: 'Tata Steel Limited', badge: 'Primary Partner' },
  { id: 'partnerJspl', name: 'JSPL', title: 'Jindal Steel & Power Ltd.', badge: 'Structural Grade' },
  { id: 'partnerAmns', name: 'AM / NS', title: 'ArcelorMittal Nippon Steel', badge: 'Flat Products' },
  { id: 'partnerApollo', name: 'APOLLO PIPES', title: 'APL Apollo Tubes Ltd.', badge: 'Hollow Sections' },
  { id: 'partnerJindalSs', name: 'JINDAL SS', title: 'Jindal Stainless Limited', badge: 'SS 304 / 202' },
];
