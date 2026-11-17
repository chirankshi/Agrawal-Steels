import json
import logging
from pathlib import Path

from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.database import engine
from app.models.product import Product
from app.models.catalogue import Category, Subcategory, Machine

logger = logging.getLogger(__name__)

# Shared with the Next.js front end: frontend/src/data/products.js -> catalogue_products.json
CATALOGUE_JSON = Path(__file__).with_name("catalogue_products.json")
# Shared with the Next.js front end: frontend/src/data/catalogue.js -> catalogue_tree.json
TREE_JSON = Path(__file__).with_name("catalogue_tree.json")

LEGACY_CATEGORY_SLUGS = {
    "Storage & Warehouse Racking": "racking",
    "Mezzanine & Multi-Tier": "mezzanine",
    "SS Kitchen & Sheet Metal": "ss-fabrication",
    "Heavy Structural & PEB": "heavy-structural",
    "Primary Steel Supply": "steel-supply",
}

def _ensure_product_columns():
    """Local SQLite migrations (create_all does not alter existing tables).

    On Supabase the schema is managed by supabase_schema.sql, so nothing runs.
    """
    if engine.dialect.name != "sqlite":
        return
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    wanted = {
        "products": {
            "subcategory": "VARCHAR(120)",
            "category_slug": "VARCHAR(100)",
            "subcategory_slug": "VARCHAR(120)",
            "tagline": "VARCHAR(200)",
            "sizes": "VARCHAR(250)",
            "dispatch": "VARCHAR(250)",
            "applications": "TEXT",
            "gallery": "TEXT",
            "sort_order": "INTEGER DEFAULT 100 NOT NULL",
            "show_on_home": "BOOLEAN DEFAULT 0 NOT NULL",
            "catalogue_page": "INTEGER",
        },
        "enquiries": {"notes": "TEXT"},
    }
    with engine.begin() as conn:
        for table, columns in wanted.items():
            if table not in tables:
                continue
            existing = {c["name"] for c in inspector.get_columns(table)}
            for name, ddl in columns.items():
                if name not in existing:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))
                    logger.info("Added %s.%s column", table, name)
        if "enquiries" in tables:
            # Older rows stored the enum name (PENDING); the column now holds the value (pending).
            conn.execute(text("UPDATE enquiries SET status = lower(status)"))


def _product_row(p: dict) -> dict:
    return {
        "slug": p["slug"],
        "name": p["name"],
        "category": p["category"],
        "category_slug": p.get("category_slug"),
        "subcategory": p.get("subcategory"),
        "subcategory_slug": p.get("subcategory_slug"),
        "tagline": p.get("tagline"),
        "grade": p.get("grade"),
        "description": p.get("description") or "",
        "specs": p.get("specs"),
        "sizes": p.get("sizes"),
        "dispatch": p.get("dispatch"),
        "applications": list(p.get("applications") or []),
        "badge": p.get("badge"),
        "image_url": p.get("image_url"),
        "gallery": list(p.get("gallery") or []),
        "tags": list(p.get("tags") or []),
        "estimated_price_per_ton": float(p.get("estimated_price_per_ton") or 0),
        "sort_order": int(p.get("sort_order") or 100),
        "show_on_home": bool(p.get("show_on_home")),
        "catalogue_page": p.get("catalogue_page"),
        "is_active": p.get("is_active", True),
    }


def _seed_tree(db: Session):
    """Fills categories / sub-categories / machines from catalogue_tree.json when a table is empty."""
    if not TREE_JSON.exists():
        logger.warning("catalogue_tree.json not found; catalogue tree seed skipped.")
        return
    tree = json.loads(TREE_JSON.read_text(encoding="utf-8"))
    for model, key in ((Category, "categories"), (Subcategory, "subcategories"), (Machine, "machines")):
        if db.query(model.id).first():
            continue
        cols = {c.name for c in model.__table__.columns}
        for row in tree.get(key, []):
            db.add(model(**{k: v for k, v in row.items() if k in cols}))
        db.commit()
        logger.info("Seeded %d %s.", len(tree.get(key, [])), key)


def _backfill_product_slugs(db: Session, catalogue: list):
    """Points products at catalogue categories: seed slugs first, then the legacy 5-label map."""
    by_slug = {p["slug"]: p for p in catalogue}
    names = {c.slug: c.name for c in db.query(Category).all()}
    subs = {(s.category_slug, s.name.lower()): s.slug for s in db.query(Subcategory).all()}
    changed = 0
    for prod in db.query(Product).all():
        seed = by_slug.get(prod.slug)
        if seed and not prod.category_slug:
            prod.category, prod.category_slug = seed["category"], seed.get("category_slug")
            prod.subcategory, prod.subcategory_slug = seed.get("subcategory"), seed.get("subcategory_slug")
            changed += 1
            continue
        if not prod.category_slug:
            prod.category_slug = LEGACY_CATEGORY_SLUGS.get(prod.category)
            if prod.category_slug:
                changed += 1
        if prod.category_slug and prod.category_slug in names and prod.category != names[prod.category_slug]:
            prod.category = names[prod.category_slug]
        if prod.category_slug and not prod.subcategory_slug and prod.subcategory:
            prod.subcategory_slug = subs.get((prod.category_slug, prod.subcategory.lower()))
    if changed:
        db.commit()
        logger.info("Mapped %d products onto catalogue categories.", changed)


def seed_database(db: Session):
    """Seed the catalogue tree and products from the shared JSON files."""
    try:
        _ensure_product_columns()
        _seed_tree(db)

        if CATALOGUE_JSON.exists():
            catalogue = json.loads(CATALOGUE_JSON.read_text(encoding="utf-8"))
            existing_slugs = {p.slug for p in db.query(Product.slug).all()}
            added = 0
            for p_data in catalogue:
                if p_data["slug"] not in existing_slugs:
                    db.add(Product(**_product_row(p_data)))
                    added += 1
            db.commit()
            if added:
                logger.info("Seeded %d catalogue products.", added)
            _backfill_product_slugs(db, catalogue)
        else:
            logger.warning("catalogue_products.json not found; product seed skipped.")

    except Exception as e:
        logger.error("Error during initial data seeding: %s", e)
        db.rollback()
