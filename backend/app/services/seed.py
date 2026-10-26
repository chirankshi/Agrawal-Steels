import logging
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.order import Order, OrderStage

logger = logging.getLogger(__name__)

# Real products verified from "New Catloge Aggarwal Steels 2025.pdf" & "Updated Catalogue.pdf"
INITIAL_PRODUCTS = [
    # --- RAW STEEL TRADING & SUPPLY ---
    {
        "slug": "ms-tmt-bars",
        "name": "MS TMT Bars",
        "category": "Steel Supply & Trading",
        "grade": "Fe 415 / Fe 500D / Fe 550D",
        "description": "Thermo-mechanically treated rebars engineered for critical infrastructure, high-rises, and earthquake-resistant seismic designs.",
        "image_url": "/images/product_tmt_bars.jpg",
        "tags": "SAIL,TATA Steel,JSPL,AMNS",
        "badge": "High Demand",
        "specs": "8mm to 32mm | IS 1786 Certified",
        "estimated_price_per_ton": 54500.0,
    },
    {
        "slug": "hr-plates-coils",
        "name": "HR Plates & Coils",
        "category": "Steel Supply & Trading",
        "grade": "IS 2062 E250 / E350",
        "description": "Heavy-duty hot-rolled master coils and plates for structural fabrication, pressure vessels, and PEB building frameworks.",
        "image_url": "/images/product_hr_plates.jpg",
        "tags": "SAIL,AMNS,TATA Steel",
        "badge": "Heavy Gauge",
        "specs": "Thickness 2mm to 63mm | Width up to 2500mm",
        "estimated_price_per_ton": 58200.0,
    },
    {
        "slug": "ms-angles",
        "name": "MS Structural Angles",
        "category": "Steel Supply & Trading",
        "grade": "Equal & Unequal Angles (IS 2062)",
        "description": "Precision L-profile structural angles for transmission towers, trusses, and industrial machinery bases.",
        "image_url": "/images/product_ms_angles.jpg",
        "tags": "SAIL,JSPL",
        "badge": "Structural",
        "specs": "25x25mm to 200x200mm | Length 6m / 12m",
        "estimated_price_per_ton": 52300.0,
    },
    {
        "slug": "ms-channels-ismc",
        "name": "MS Channels (ISMC)",
        "category": "Steel Supply & Trading",
        "grade": "ISMC Standard Profiles",
        "description": "Hot-rolled C-channels for architectural framing, bridge decks, vehicle chassis, and column reinforcements.",
        "image_url": "/images/product_ms_channel.jpg",
        "tags": "SAIL,JSPL,TATA Steel",
        "badge": "Structural",
        "specs": "ISMC 75 to ISMC 400",
        "estimated_price_per_ton": 53400.0,
    },
    {
        "slug": "ms-beams-joists",
        "name": "MS Beams (ISMB / NPB / WPB)",
        "category": "Steel Supply & Trading",
        "grade": "ISMB / Joists / Heavy Sections",
        "description": "High section-modulus structural beams for wide-span industrial sheds, multi-story buildings, and heavy cranes.",
        "image_url": "/images/product_ms_beam.jpg",
        "tags": "SAIL,JSPL Universal",
        "badge": "Heavy Sections",
        "specs": "ISMB 100 to ISMB 600",
        "estimated_price_per_ton": 56800.0,
    },
    {
        "slug": "chequered-plates",
        "name": "MS Chequered Plates",
        "category": "Steel Supply & Trading",
        "grade": "Tear Drop / Diamond Pattern (IS 2062)",
        "description": "Anti-skid industrial flooring plates for staircases, walkway ramps, factory floors, and transport trailers.",
        "image_url": "/images/product_chequered.jpg",
        "tags": "SAIL,AMNS",
        "badge": "Anti-Skid",
        "specs": "Thickness 3mm to 12mm",
        "estimated_price_per_ton": 59800.0,
    },
    {
        "slug": "pipes-and-tubes",
        "name": "Hollow Sections & MS Pipes",
        "category": "Steel Supply & Trading",
        "grade": "Square (SHS), Rectangular (RHS) & Round",
        "description": "High-strength structural hollow sections and MS pipes for architectural facades, PEB sheds, and trusses.",
        "image_url": "/images/product_ms_pipe.jpg",
        "tags": "APL Apollo,Jindal Steels Pipes",
        "badge": "Certified",
        "specs": "IS 4923 & IS 1161 Certified",
        "estimated_price_per_ton": 59100.0,
    },
    {
        "slug": "cr-coils-and-slit",
        "name": "CR Coils & Precision Slit Coils",
        "category": "Steel Supply & Trading",
        "grade": "CR1 / CR2 / CR3 Deep Draw",
        "description": "Cold-rolled coils and slit coils with ultra-smooth surface finish for automotive stamping, panels, and appliances.",
        "image_url": "/images/product_cr_coils.jpg",
        "tags": "SAIL,TATA Steelium",
        "badge": "Precision Slit",
        "specs": "0.4mm to 3.0mm Thickness",
        "estimated_price_per_ton": 62500.0,
    },
    {
        "slug": "gp-coils-roofing",
        "name": "GP Coils, Sheets & Roofing",
        "category": "Steel Supply & Trading",
        "grade": "Galvanized 120-275 GSM / Color Coated",
        "description": "Corrosion-resistant galvanized plain coils, corrugated roofing sheets, and zero-spangle coils.",
        "image_url": "/images/product_gp_coils.jpg",
        "tags": "SAIL,AMNS,JSPL",
        "badge": "Corrosion Resistant",
        "specs": "Thickness 0.35mm to 2.5mm",
        "estimated_price_per_ton": 65000.0,
    },
    {
        "slug": "ss-sheets-plates",
        "name": "Stainless Steel Sheets & Plates",
        "category": "Steel Supply & Trading",
        "grade": "SS 304 / SS 202 / SS 316",
        "description": "Austenitic stainless steel sheets in 2B and No.4 matte finish for commercial kitchens, pharmaceuticals, and architecture.",
        "image_url": "/images/product_ss_sheets.jpg",
        "tags": "Jindal Stainless",
        "badge": "Premium SS",
        "specs": "Sheets, Coils & Custom Cut",
        "estimated_price_per_ton": 185000.0,
    },
    # --- IN-HOUSE MANUFACTURING & STORAGE SYSTEMS (Majestic AR Technology) ---
    {
        "slug": "heavy-duty-pallet-racks",
        "name": "Heavy Duty Pallet Storage Racks",
        "category": "Industrial Storage Solutions",
        "grade": "Selective, Double Deep, Drive-In",
        "description": "Engineered warehouse pallet racking systems with high load capacity, powder-coated finish, and modular upright configurations.",
        "image_url": "/images/product_racks.jpg",
        "tags": "Majestic AR,In-House Manufactured",
        "badge": "Warehouse Grade",
        "specs": "Custom Heights up to 12m | Up to 4000kg/level",
        "estimated_price_per_ton": 78000.0,
    },
    {
        "slug": "mezzanine-floor-system",
        "name": "Industrial Mezzanine Floor Systems",
        "category": "Industrial Storage Solutions",
        "grade": "Multi-Level Storage & Office Mezzanine",
        "description": "Cost-effective elevated steel floor systems to double or triple usable floor space without civil modifications.",
        "image_url": "/images/product_mezzanine.jpg",
        "tags": "Majestic AR,PEB Structure",
        "badge": "Custom Engineered",
        "specs": "Heavy-duty steel floor decking with staircases & railings",
        "estimated_price_per_ton": 82000.0,
    },
    {
        "slug": "slotted-angle-racks",
        "name": "Slotted Angle & Bin Storage Racks",
        "category": "Industrial Storage Solutions",
        "grade": "Roll-Formed Slotted Profiles",
        "description": "Versatile, modular slotted angle storage racks for hardware parts, workshops, and retail inventory management.",
        "image_url": "/images/product_slotted.jpg",
        "tags": "Majestic AR,In-House Roll Formed",
        "badge": "Modular",
        "specs": "Adjustable shelves, corner & L-shape configurations",
        "estimated_price_per_ton": 74000.0,
    },
    {
        "slug": "supermarket-display-racks",
        "name": "Supermarket & Retail Display Racks",
        "category": "Retail & Warehousing",
        "grade": "Gondola, Wall & Island Racks",
        "description": "Modern, powder-coated retail shelving systems with end-caps, fruit/vegetable crates, and bakery displays.",
        "image_url": "/images/product_display_racks.jpg",
        "tags": "Majestic AR,Robotic Powder Coated",
        "badge": "Premium Finish",
        "specs": "Multiple color options | 520ft Powder Coating line",
        "estimated_price_per_ton": 79000.0,
    },
    {
        "slug": "ss-commercial-kitchen",
        "name": "Commercial Kitchen & Food Equipment",
        "category": "Custom Fabrication",
        "grade": "SS 304 Food Grade",
        "description": "Hygienic stainless steel counters, prep tables, industrial sinks, food service stations, and bakery racks.",
        "image_url": "/images/product_kitchen.jpg",
        "tags": "Aggarwal Steels,Majestic AR",
        "badge": "SS 304 Hygienic",
        "specs": "Custom fabricated with TIG/MIG sanitary welding",
        "estimated_price_per_ton": 210000.0,
    },
    {
        "slug": "sheet-metal-cabinets",
        "name": "Electrical & Control Panel Cabinets",
        "category": "Custom Fabrication",
        "grade": "CR / GI Powder Coated (IP Rated)",
        "description": "Precision laser-cut and CNC-bent enclosures for electrical power distribution, automation controls, and outdoor setups.",
        "image_url": "/images/product_cabinets.jpg",
        "tags": "Majestic AR,3kW CNC Laser",
        "badge": "Precision Fit",
        "specs": "CNC cut on Prime 3kW & bent on HACO/Energy Mission",
        "estimated_price_per_ton": 85000.0,
    },
    {
        "slug": "peb-structures-sheds",
        "name": "PEB Structures & Industrial Sheds",
        "category": "Heavy Fabrication",
        "grade": "IS 2062 Structural Steel",
        "description": "Pre-engineered industrial building structures, factory sheds, pipeline support structures, and industrial platforms.",
        "image_url": "/images/product_peb.jpg",
        "tags": "Aggarwal Steels,Heavy Fabrication",
        "badge": "Heavy Duty",
        "specs": "Custom span, load engineered with complete MTC",
        "estimated_price_per_ton": 72000.0,
    },
]

DEMO_ORDERS = [
    {
        "tracking_number": "AS-2026-7891",
        "client_name": "M3M Infrastructure Projects",
        "phone": "+917300070778",
        "product": "MS TMT Bars (Fe 550D) & Structural Beams",
        "quantity_metric_tons": 85.0,
        "delivery_destination": "Sector 65 Golf Course Extension, Gurugram",
        "stage": OrderStage.IN_TRANSIT,
        "estimated_delivery_date": "2026-10-26",
        "vehicle_number": "HR 38 AB 4912",
        "notes": "Dispatched from Bhiwadi / Faridabad stockyard with SAIL mill test certificate (MTC).",
    },
    {
        "tracking_number": "AS-2026-6420",
        "client_name": "Amazon Fulfillment Centre Expansion",
        "phone": "+917300070778",
        "product": "Heavy Duty Selective Pallet Racks & Mezzanine",
        "quantity_metric_tons": 54.0,
        "delivery_destination": "IMT Manesar Logistics Park, Gurugram",
        "stage": OrderStage.PROCESSING_MILL,
        "estimated_delivery_date": "2026-10-28",
        "vehicle_number": None,
        "notes": "CNC bending and 520ft automated robotic powder coating underway at Unit 02 Bhiwadi.",
    },
]


def seed_database(db: Session):
    """Seed / sync products and demo order records."""
    try:
        # Check existing slugs to avoid duplication
        existing_slugs = {p.slug for p in db.query(Product.slug).all()}
        for p_data in INITIAL_PRODUCTS:
            if p_data["slug"] not in existing_slugs:
                prod = Product(**p_data)
                db.add(prod)
        db.commit()

        order_count = db.query(Order).count()
        if order_count == 0:
            for o_data in DEMO_ORDERS:
                order = Order(**o_data)
                db.add(order)
            db.commit()
            logger.info("Successfully seeded demo orders from actual client projects.")
    except Exception as e:
        logger.error("Error during initial data seeding: %s", e)
        db.rollback()
