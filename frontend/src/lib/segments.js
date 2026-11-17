/**
 * Segment pages (/products/[category]): images, taglines and item copy.
 * Live values come from Supabase (categories.tagline, subcategories.item_details);
 * these seeds keep the pages complete when the database is unreachable.
 */

export const TAGLINE_SEED = {
  'steel-supply': 'Mill-certified steel. Dispatched in 24 hours.',
  racking: 'Smart storage. Better space utilisation.',
  mezzanine: 'Double your floor space. Same footprint.',
  'material-handling': 'Move more. Handle less.',
  'ms-sheet-metal': 'Precision sheet metal, built to drawing.',
  'ss-fabrication': 'Hygienic stainless steel for kitchens and industry.',
  'heavy-structural': 'Structures engineered to carry the load.',
  infrastructure: 'Built for roads, power and sites.',
  services: 'From CAD file to finished, coated part.',
};

/** {subcategory slug: {item name: {description, image_url}}} */
export const ITEM_DETAILS_SEED = {
  "pallet-storage-systems": {
    "Selective pallet racks": {
      "description": "Most popular and versatile pallet storage system, with direct access to every pallet."
    },
    "Double-deep pallet racks": {
      "description": "Two pallets deep per side for high-density storage with reduced aisle space."
    },
    "Narrow-aisle pallet racks": {
      "description": "Maximise storage capacity with minimal aisle width for VNA trucks."
    },
    "Drive-in pallet racks": {
      "description": "High-density storage for large quantities of similar products."
    },
    "Drive-through pallet racks": {
      "description": "Entry from both sides, ideal for FIFO / LIFO inventory management."
    },
    "Cantilever racks": {
      "description": "Open-front arms for long and bulky materials like pipes, sheets and timber."
    },
    "Mobile pallet racks": {
      "description": "Racks on motorised bases that open one aisle at a time to save floor space."
    },
    "Pallet flow racks": {
      "description": "Gravity rollers move pallets forward for automatic FIFO stock rotation."
    },
    "Heavy-duty racks with decking panel": {
      "description": "Steel decking panels for loose, hand-loaded and non-palletised goods."
    }
  },
  "shelving": {
    "Slotted angle racks": {
      "description": "Bolt-together slotted angles for flexible, low-cost light storage."
    },
    "Long span shelving (LSS)": {
      "description": "Wide-span beams and panels for medium loads and hand picking."
    },
    "Light-duty shelving": {
      "description": "Boltless shelving for offices, stores and archives."
    },
    "Bin storage racks": {
      "description": "Organised bins for small parts, spares and fasteners."
    },
    "Small parts storage": {
      "description": "Compact shelving with dividers for quick picking of small items."
    },
    "Adjustable shelves": {
      "description": "Shelf levels set at 25 mm pitch to suit changing stock."
    },
    "L-shape racks": {
      "description": "Corner-fitting shelving that uses every metre of wall space."
    }
  },
  "display-racks-supermarket": {
    "Gondola racks": {
      "description": "Double-sided island units for aisles in retail and supermarkets."
    },
    "Wall racks": {
      "description": "Single-sided shelving along store walls."
    },
    "End racks": {
      "description": "End-of-aisle units for promotions and featured products."
    },
    "Corner racks": {
      "description": "Curved or angled units to use store corners."
    },
    "Island racks": {
      "description": "Free-standing units for the store floor."
    },
    "Slotted display racks": {
      "description": "Perforated back panels for hooks and accessories."
    },
    "Fruit & vegetable racks": {
      "description": "Tilted crates and baskets for fresh produce."
    },
    "Bakery racks": {
      "description": "Open shelving with trays for breads and baked goods."
    },
    "Checkout racks": {
      "description": "Impulse-buy units for the billing counter."
    }
  },
  "metal-pallets": {
    "Powder-coated pallet": {
      "description": "Rigid MS pallet with a durable powder-coated finish."
    },
    "Powder-coated slatted pallet": {
      "description": "Slatted deck for ventilation and lighter weight."
    },
    "GI pallet": {
      "description": "Galvanised pallet for wet, cold-storage and outdoor use."
    },
    "Custom pallet": {
      "description": "Built to your load, size and handling equipment."
    }
  },
  "rack-accessories": {
    "Column guard": {
      "description": "Protects upright columns from forklift impact."
    },
    "Row guard": {
      "description": "Guards the end of rack rows against collision."
    },
    "Wire mesh partition": {
      "description": "Secure mesh enclosures and rack-back panels."
    },
    "Pallet support bar (PSB)": {
      "description": "Cross bars that support pallets and non-standard loads."
    },
    "Pallet back stopper": {
      "description": "Stops pallets from being pushed through the rack."
    },
    "Base plate": {
      "description": "Anchored foot plates that spread upright loads into the floor."
    }
  },
  "tmt-bars": {
    "Fe 415": {
      "description": "Ductile grade for general RCC work and small buildings."
    },
    "Fe 500D": {
      "description": "Most-used grade with higher ductility for seismic zones."
    },
    "Fe 550D": {
      "description": "Higher strength for heavy structures, bridges and high-rises."
    }
  },
  "plates-coils": {
    "HR plates": {
      "description": "Hot rolled IS 2062 plates for fabrication and structures."
    },
    "HR coils": {
      "description": "Hot rolled coils for pipes, sections and cut-to-length sheets."
    },
    "CR coils & slit coils": {
      "description": "Cold rolled coils with a smooth finish, slit to width."
    },
    "GP coils & sheets": {
      "description": "Galvanised coils and sheets for corrosion protection."
    },
    "Chequered plates": {
      "description": "Anti-skid patterned plates for floors, stairs and platforms."
    },
    "Roofing sheets": {
      "description": "Profiled roofing and cladding sheets for sheds and buildings."
    },
    "Perforated sheets": {
      "description": "Punched sheets for screens, guards, filters and facades."
    }
  },
  "structural-sections": {
    "MS angles (equal & unequal)": {
      "description": "L-sections for frames, towers, trusses and brackets."
    },
    "MS channels (ISMC)": {
      "description": "C-sections for purlins, frames and vehicle chassis."
    },
    "MS beams (ISMB / NPB / WPB)": {
      "description": "I-beams for columns, girders and heavy structures."
    },
    "MS flats": {
      "description": "Flat bars for base plates, brackets and fabrication."
    },
    "MS round & square bars": {
      "description": "Solid bars for shafts, pins, grills and machining."
    }
  },
  "pipes-hollow-sections": {
    "Square (SHS)": {
      "description": "Square hollow sections for frames, gates and structures."
    },
    "Rectangular (RHS)": {
      "description": "Rectangular hollow sections for trusses and furniture."
    },
    "Round pipes": {
      "description": "ERW and GI round pipes for structures and fluid lines."
    }
  },
  "stainless-steel": {
    "SS sheets 202 / 304 / 316": {
      "description": "Stainless sheets in common grades and finishes."
    },
    "SS pipes & tubes": {
      "description": "Round and square stainless pipes for railings and fabrication."
    }
  },
  "rail-lines": {
    "New rail lines": {
      "description": "Fresh rail sections for crane tracks and sidings."
    },
    "Old rail lines": {
      "description": "Reusable rails for structural and economical applications."
    }
  },
  "mezzanine-floors": {
    "Storage mezzanine": {
      "description": "Adds a storage level above existing warehouse floor."
    },
    "Office mezzanine": {
      "description": "Raised office space inside factories and warehouses."
    },
    "Industrial mezzanine": {
      "description": "Heavy-duty platform for machines and production."
    },
    "Multi-level mezzanine": {
      "description": "Two or more floors for maximum use of height."
    },
    "Mezzanine with conveyor": {
      "description": "Integrated conveyors to move goods between levels."
    },
    "Staircases & safety railings": {
      "description": "Stairs, handrails and gates built to safety norms."
    },
    "Heavy-duty floor decking": {
      "description": "Steel, plywood or grating decking for high loads."
    }
  },
  "multi-tier-racking": {
    "2-tier racking system": {
      "description": "Two picking levels joined by a walkway."
    },
    "3-tier racking system": {
      "description": "Three levels for dense small-parts storage."
    },
    "Multi-level storage": {
      "description": "Shelving and walkways stacked to the roof height."
    },
    "Rack-supported mezzanine": {
      "description": "The racking itself carries the upper floor."
    },
    "Integrated solutions": {
      "description": "Racking, mezzanine and lifts planned as one system."
    }
  },
  "trolleys": {
    "Platform trolley": {
      "description": "Flat deck trolley for boxes and general goods."
    },
    "Mesh-side platform trolley": {
      "description": "Mesh sides keep loose goods secure in transit."
    },
    "Roll cage trolley": {
      "description": "Lockable cage for retail and logistics distribution."
    },
    "Collapsible mesh container": {
      "description": "Stackable mesh box that folds flat when empty."
    },
    "Bin trolley": {
      "description": "Carries bins and crates for picking and kitting."
    },
    "Tool trolley": {
      "description": "Drawers and trays to keep tools at the workstation."
    },
    "Order-picking trolley with step": {
      "description": "Built-in step to reach upper shelves safely."
    },
    "Heavy platform trolley": {
      "description": "Reinforced trolley for loads up to 1,000 kg."
    },
    "Hand pallet truck": {
      "description": "Lifts and moves pallets across the floor."
    }
  },
  "conveyors": {
    "Roller conveyor (gravity & motorised)": {
      "description": "Moves cartons and totes by gravity or motor."
    },
    "Belt conveyor": {
      "description": "Continuous belt for small, loose or irregular items."
    },
    "Skate wheel conveyor": {
      "description": "Lightweight wheels for quick, portable loading lines."
    },
    "Spiral conveyor": {
      "description": "Moves goods between floors in a compact footprint."
    },
    "Loading / unloading conveyor": {
      "description": "Speeds up truck and container loading."
    },
    "Modular conveyor": {
      "description": "Sections that reconfigure as your layout changes."
    },
    "Flexible conveyor": {
      "description": "Expands and bends to reach into trucks and bays."
    }
  },
  "workstations-assembly-lines": {
    "Aluminium profile workstation": {
      "description": "Light, modular benches built from T-slot profiles."
    },
    "Pipe joint workstation": {
      "description": "Pipe-and-joint frames for low-cost flexible stations."
    },
    "Assembly line workstation": {
      "description": "Benches with lights, bins and tool rails for assembly."
    },
    "Complete assembly lines": {
      "description": "Full production lines designed around your process."
    }
  },
  "cabinets-enclosures": {
    "Electrical panel cabinets": {
      "description": "Enclosures for switchgear and distribution panels."
    },
    "Control panel cabinets": {
      "description": "Housings for PLC, drive and automation panels."
    },
    "Outdoor cabinets": {
      "description": "Weatherproof IP-rated cabinets for outdoor sites."
    },
    "Data centre cabinets": {
      "description": "Server and network cabinets for data centres."
    },
    "Telecom cabinets": {
      "description": "Cabinets for telecom and tower equipment."
    },
    "Wall-mount cabinets": {
      "description": "Compact cabinets that fix to walls and columns."
    },
    "Modular cabinets": {
      "description": "Bolt-together cabinets that expand as needed."
    },
    "Industrial cabinets": {
      "description": "Heavy-gauge cabinets for factory floors."
    },
    "Customised cabinets": {
      "description": "Built to your size, cut-outs and finish."
    }
  },
  "tanks-boxes": {
    "Transformer tanks": {
      "description": "Leak-tested tanks and radiators for transformers."
    },
    "Oil storage tanks": {
      "description": "Welded tanks for lubricant and oil storage."
    },
    "Diesel storage tanks": {
      "description": "Fuel tanks for gensets and plant equipment."
    },
    "Horizontal tanks": {
      "description": "Skid-mounted horizontal storage tanks."
    },
    "Vertical tanks": {
      "description": "Upright tanks for limited floor space."
    },
    "Process tanks": {
      "description": "Tanks for treatment, washing and process lines."
    },
    "Battery boxes": {
      "description": "Boxes and racks that house battery banks."
    },
    "Inverter boxes": {
      "description": "Ventilated housings for inverters."
    },
    "UPS boxes": {
      "description": "Enclosures for UPS and power backup units."
    },
    "Junction boxes": {
      "description": "Boxes for cable joints and terminations."
    },
    "Outdoor electrical boxes": {
      "description": "Weatherproof boxes for meters and switches."
    }
  },
  "panels": {
    "Plain panel": {
      "description": "Flat sheet panels for covers and cladding."
    },
    "Stiffened panel": {
      "description": "Ribbed panels for rigidity without extra weight."
    },
    "Powder-coated panel": {
      "description": "Finished panels in any RAL shade."
    },
    "GI panel": {
      "description": "Galvanised panels for corrosion resistance."
    },
    "Perforated panel": {
      "description": "Punched panels for airflow and visibility."
    },
    "Louvered panel": {
      "description": "Louvres for ventilation with rain protection."
    },
    "Panel with stiffener": {
      "description": "Panels with welded stiffeners for large spans."
    },
    "CR panels": {
      "description": "Cold rolled panels with a smooth paint-ready surface."
    }
  },
  "components-for-oems": {
    "Battery box (EV)": {
      "description": "Enclosures for electric vehicle battery packs."
    },
    "Outdoor cabinet": {
      "description": "OEM outdoor cabinets made to specification."
    },
    "Indoor cabinet": {
      "description": "OEM indoor cabinets for equipment makers."
    },
    "Electrical panel box": {
      "description": "Panel boxes supplied ready for assembly."
    },
    "Fixture & chassis": {
      "description": "Frames, chassis and fixtures for machines."
    },
    "Industrial UPS cabinet": {
      "description": "Large cabinets for industrial UPS systems."
    },
    "Small UPS cabinet": {
      "description": "Compact UPS housings in volume."
    },
    "Network rack": {
      "description": "Racks for switches and network gear."
    },
    "Server rack": {
      "description": "19-inch server racks with doors and fans."
    },
    "Wall-mount rack": {
      "description": "Small wall racks for network points."
    },
    "Genset canopy / outer body": {
      "description": "Acoustic canopies and bodies for gensets."
    }
  },
  "shelves-benches-partitions": {
    "MS shelves & racks": {
      "description": "Fabricated shelves for stores and workshops."
    },
    "Work tables & benches": {
      "description": "Sturdy benches for assembly and repair work."
    },
    "Industrial trolleys": {
      "description": "Custom trolleys built for your parts."
    },
    "Gates, grills & partitions": {
      "description": "Security gates, grills and mesh partitions."
    },
    "Custom fabricated parts": {
      "description": "One-off and batch parts made to drawing."
    },
    "Brackets & mounting parts": {
      "description": "Brackets, clamps and mounting hardware."
    },
    "Cable trays & covers": {
      "description": "Trays and covers for cable routing."
    }
  },
  "commercial-kitchen-equipment": {
    "Cooking ranges": {
      "description": "Burner ranges for high-volume cooking."
    },
    "Bain marie": {
      "description": "Keeps cooked food hot for service."
    },
    "Griddles & fryers": {
      "description": "Flat-top griddles and deep fryers."
    },
    "Work tables (with / without backsplash)": {
      "description": "SS prep tables in custom sizes."
    },
    "Pot racks & wall shelves": {
      "description": "Storage for pots, pans and utensils."
    },
    "Sinks & dish-wash units": {
      "description": "Single, double and triple bowl sinks."
    },
    "Hand-wash stations": {
      "description": "Hygienic hand-wash units for kitchen staff."
    },
    "Exhaust hoods & ducts": {
      "description": "Hoods and ducting to clear smoke and heat."
    }
  },
  "ss-counters-shelving-trolleys": {
    "SS counters": {
      "description": "Service and billing counters in stainless steel."
    },
    "Display counters": {
      "description": "Glass-top counters for food display."
    },
    "Food service equipment": {
      "description": "Pick-up, plating and serving units."
    },
    "SS shelves & shelving units": {
      "description": "Rust-free shelving for stores and kitchens."
    },
    "Bakery racks": {
      "description": "Tray racks for baking and cooling."
    },
    "Service trolleys": {
      "description": "Trolleys for food and dish service."
    },
    "SS storage racks": {
      "description": "Heavy stainless racks for cold rooms and stores."
    },
    "Locker cabinets": {
      "description": "Staff lockers in stainless steel."
    },
    "Wall cabinets": {
      "description": "Wall-hung cabinets with sliding or hinged doors."
    },
    "Louvered cabinets": {
      "description": "Ventilated cabinets for storage and equipment."
    }
  },
  "hygiene-sanitation": {
    "SS sinks & wash units": {
      "description": "Wash units for hospitals, labs and kitchens."
    },
    "Hand-wash & sanitisation units": {
      "description": "Foot or sensor operated hand-wash stations."
    },
    "SS dustbins": {
      "description": "Durable bins for public and kitchen areas."
    },
    "Toilet partitions": {
      "description": "Stainless cubicle partitions for washrooms."
    },
    "Cleanroom equipment": {
      "description": "Tables, pass boxes and racks for cleanrooms."
    }
  },
  "ss-industrial-structures": {
    "Railway battery boxes": {
      "description": "Stainless battery boxes for rolling stock."
    },
    "SS cable trays & supports": {
      "description": "Corrosion-proof trays for harsh sites."
    },
    "Handrails & railings": {
      "description": "Stainless railings for stairs and platforms."
    },
    "Laser-cut panels": {
      "description": "Decorative and functional laser-cut screens."
    },
    "Ducting & ventilation": {
      "description": "Stainless ducts for clean and corrosive air."
    },
    "Enclosures & panels": {
      "description": "Stainless enclosures for food and pharma plants."
    },
    "Customised SS structures (platforms, staircases, frames)": {
      "description": "Platforms, stairs and frames built to order."
    }
  },
  "buildings": {
    "Pre-engineered buildings (PEB)": {
      "description": "Factory-made steel buildings, erected fast on site."
    },
    "Industrial sheds": {
      "description": "Sheds for factories, warehouses and workshops."
    },
    "Shed & canopy fabrication": {
      "description": "Canopies for parking, loading bays and fuel stations."
    }
  },
  "bridges-rail": {
    "Bridge structures": {
      "description": "Steel girders and decks for road and rail bridges."
    },
    "Road over-bridge (ROB)": {
      "description": "Steel structures for road over railway crossings."
    },
    "Foot over-bridge (FOB)": {
      "description": "Pedestrian bridges for stations and highways."
    },
    "Truss & bridge fabrication": {
      "description": "Trusses fabricated and trial-assembled in-house."
    }
  },
  "industrial-structures": {
    "EOT crane girders": {
      "description": "Box and I-girders for overhead cranes."
    },
    "Transmission tower structures": {
      "description": "Lattice towers for power transmission."
    },
    "Platforms & walkways": {
      "description": "Access platforms with grating and railings."
    },
    "Support structures": {
      "description": "Frames for equipment, tanks and pipelines."
    },
    "Pipe structures": {
      "description": "Pipe racks and bridges for process plants."
    },
    "Staircase fabrication": {
      "description": "Industrial stairs and ladders to code."
    },
    "Ducting fabrication": {
      "description": "Heavy ducts for dust and fume extraction."
    },
    "Tank structures": {
      "description": "Supports and towers for storage tanks."
    }
  },
  "scaffolding-systems": {
    "Scaffolding GI planks": {
      "description": "Galvanised walk boards with anti-slip punching."
    },
    "Modular scaffolding": {
      "description": "Cuplock and ringlock style quick-assembly systems."
    }
  },
  "cable-tray-systems": {
    "Perforated cable tray": {
      "description": "Ventilated trays for power and control cables."
    },
    "Ladder cable tray": {
      "description": "Ladder trays for heavy cables over long spans."
    },
    "Cable tray accessories": {
      "description": "Bends, tees, covers and supports."
    }
  },
  "road-crash-barriers": {
    "W-beam crash barriers": {
      "description": "Hot-dip galvanised W-beams to MoRTH specifications."
    },
    "Crash barrier components": {
      "description": "Spacers, end terminals and fasteners."
    },
    "Posts & accessories": {
      "description": "C-posts, base plates and reflectors."
    }
  },
  "finishing": {
    "Powder coating job work (520 ft line, up to 12 m parts)": {
      "description": "Pre-treated, oven-cured coating for long and heavy parts."
    }
  },
  "fabrication-to-drawing": {
    "Laser cutting": {
      "description": "Fibre laser cutting of sheet and plate."
    },
    "CNC bending": {
      "description": "Tandem press brakes for long, accurate bends."
    },
    "Custom fabrication from CAD / DXF": {
      "description": "Send a drawing and get finished parts."
    },
    "Build-to-print sheet metal": {
      "description": "Repeat production to your drawings and tolerances."
    }
  },
  "project-services": {
    "In-house design & R&D": {
      "description": "Layout, load calculation and product design."
    },
    "Site installation & erection": {
      "description": "Trained teams install and commission on site."
    },
    "After-sales support": {
      "description": "Inspection, spares and maintenance after handover."
    }
  }
};

/** Category and sub-category descriptions (fallback when the database is unreachable). */
export const CATEGORY_DESCRIPTION_SEED = {
  "steel-supply": "Authorised distribution of primary steel from Tata Steel, Jindal Steel and SAIL: TMT, plates, coils, sections, pipes and stainless steel, with mill test certificates and 24-hour dispatch.",
  "racking": "Pallet racking, shelving, supermarket display racks and metal pallets, designed, roll-formed and powder coated in-house at Majestic AR Technology.",
  "mezzanine": "Storage, office and industrial mezzanine floors and 2 to 3 tier racking that add usable floor area without new construction.",
  "material-handling": "Trolleys, conveyors and workstations that move material safely through warehouses, factories and assembly lines.",
  "ms-sheet-metal": "Laser cut, CNC bent and powder coated MS sheet metal: cabinets, enclosures, tanks, panels and OEM components built to drawing.",
  "ss-fabrication": "Food-grade SS 202 / 304 kitchen equipment, counters, hygiene units and stainless steel structures for hotels, hospitals and industry.",
  "heavy-structural": "PEB buildings, bridge girders and industrial structures fabricated at up to 1,000 MT per month in our structural unit.",
  "infrastructure": "Scaffolding, cable tray systems and hot-dip galvanised road crash barriers for highways, power and construction sites.",
  "services": "Job-work and project services: powder coating, laser cutting, CNC bending, design and on-site installation."
};
export const SUBCATEGORY_DESCRIPTION_SEED = {
  "tmt-bars": "High-strength TMT rebars for RCC construction, supplied cut and bent to length on request.",
  "plates-coils": "HR, CR and GP plates, coils and sheets from primary mills, slit and cut to size.",
  "structural-sections": "Angles, channels, beams, flats and bars for fabrication and construction.",
  "pipes-hollow-sections": "MS and GI pipes and hollow sections for structures, fencing and frames.",
  "stainless-steel": "Stainless steel sheets, pipes and tubes in 202, 304 and 316 grades.",
  "rail-lines": "New and used rail sections for crane tracks, sidings and structural use.",
  "pallet-storage-systems": "Smart racking solutions for safer, faster and more efficient storage.",
  "shelving": "Hand-loaded shelving for spares, cartons and small parts.",
  "display-racks-supermarket": "Retail display systems for supermarkets, pharmacies and stores.",
  "metal-pallets": "Strong, reusable steel pallets that outlast wood and plastic.",
  "rack-accessories": "Safety and add-on parts that protect racks, stock and people.",
  "mezzanine-floors": "Raised steel floors that double usable area under the same roof.",
  "multi-tier-racking": "Racking with walkways on each level for high-density hand picking.",
  "trolleys": "Manual handling trolleys for warehouses, retail and production floors.",
  "conveyors": "Gravity and powered conveyors for moving cartons and parts.",
  "workstations-assembly-lines": "Ergonomic workstations and complete assembly lines for production.",
  "cabinets-enclosures": "Powder-coated cabinets and enclosures for electrical, telecom and IT equipment.",
  "tanks-boxes": "Fabricated tanks and boxes for transformers, fuel, batteries and power equipment.",
  "panels": "Sheet metal panels in plain, stiffened, perforated and louvered designs.",
  "components-for-oems": "Build-to-print sheet metal parts and assemblies for OEM production lines.",
  "shelves-benches-partitions": "Workshop furniture, partitions and custom fabricated parts.",
  "commercial-kitchen-equipment": "Stainless steel cooking and preparation equipment for commercial kitchens.",
  "ss-counters-shelving-trolleys": "Stainless steel counters, storage and service equipment.",
  "hygiene-sanitation": "Easy-to-clean stainless steel units for washrooms, hospitals and cleanrooms.",
  "ss-industrial-structures": "Corrosion-resistant stainless steel structures for rail, power and industry.",
  "buildings": "Pre-engineered steel buildings, sheds and canopies, designed and erected.",
  "bridges-rail": "Steel bridge structures and trusses for road and rail projects.",
  "industrial-structures": "Heavy fabricated structures for plants, cranes and utilities.",
  "scaffolding-systems": "Safe, modular scaffolding for construction and maintenance work.",
  "cable-tray-systems": "Galvanised and powder-coated trays to route and support cables.",
  "road-crash-barriers": "Hot-dip galvanised W-beam barriers for highways and expressways.",
  "finishing": "Automated powder coating line for long and heavy parts.",
  "fabrication-to-drawing": "Precision parts made from your drawings and CAD files.",
  "project-services": "Support from design through installation and after-sales."
};

/** Photos already in /public used until admin uploads real ones. */
const CATEGORY_IMAGES = {
  'steel-supply': '/images/product_hr_plates.jpg',
  racking: '/images/storage_racking.jpeg',
  mezzanine: '/images/storage_racking.jpeg',
  'material-handling': '/images/support_welding.jpeg',
  'ms-sheet-metal': '/images/cnc_bending.jpeg',
  'ss-fabrication': '/images/commercial_kitchen.jpeg',
  'heavy-structural': '/images/product_ms_beam.jpg',
  infrastructure: '/images/product_ms_pipe.jpg',
  services: '/images/cnc_bending.jpeg',
};
const SUBCATEGORY_IMAGES = {
  'tmt-bars': '/images/product_tmt_bars.jpg',
  'plates-coils': '/images/product_hr_plates.jpg',
  'structural-sections': '/images/product_ms_channel.jpg',
  'pipes-hollow-sections': '/images/product_ms_pipe.jpg',
  'commercial-kitchen-equipment': '/images/commercial_kitchen.jpeg',
  'fabrication-to-drawing': '/images/cnc_bending.jpeg',
};

export const categoryImage = (c) => c?.image_url || CATEGORY_IMAGES[c?.slug] || '/images/hero_steel_background.jpg';
export const subcategoryImage = (s, c, products = []) =>
  s?.image_url || products.find((p) => p.image_url)?.image_url || SUBCATEGORY_IMAGES[s?.slug] || categoryImage(c);

/** Item tile data: name + description + image, with fallbacks down the tree. */
export function itemDetail(item, s, c, products = []) {
  const d = (s?.item_details || {})[item] || {};
  return { name: item, description: d.description || '', image_url: d.image_url || subcategoryImage(s, c, products), hasOwnImage: Boolean(d.image_url) };
}

export const parseDetails = (v) => {
  if (!v) return {};
  if (typeof v === 'string') { try { return JSON.parse(v) || {}; } catch { return {}; } }
  return typeof v === 'object' ? v : {};
};
