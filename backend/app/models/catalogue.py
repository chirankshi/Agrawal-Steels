"""Catalogue hierarchy: product categories, their sub-categories and the in-house machines.

Mirrors the Supabase tables of the same names (see supabase_schema.sql, section 5).
Slugs, not numeric ids, link rows together so the same data works in Supabase,
SQLite and the bundled JSON seed.
"""
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, UniqueConstraint

from app.database import Base
from app.models.types import StringList


def _now():
    return datetime.now(timezone.utc)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(150), nullable=False)
    company = Column(String(150), nullable=True)
    description = Column(Text, nullable=True)
    partners = Column(StringList, nullable=True)
    capacity = Column(String(200), nullable=True)
    catalogue_page = Column(Integer, nullable=True)
    image_url = Column(Text, nullable=True)
    sort_order = Column(Integer, default=100, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now)


class Subcategory(Base):
    __tablename__ = "subcategories"
    __table_args__ = (UniqueConstraint("category_slug", "slug", name="uq_subcategory_slug"),)

    id = Column(Integer, primary_key=True, index=True)
    category_slug = Column(String(100), nullable=False, index=True)
    slug = Column(String(120), nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    items = Column(StringList, nullable=True)  # catalogue line items under this sub-category
    catalogue_page = Column(Integer, nullable=True)
    image_url = Column(Text, nullable=True)
    sort_order = Column(Integer, default=100, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now)


class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(120), unique=True, nullable=False, index=True)
    group_name = Column(String(100), nullable=False)
    name = Column(String(150), nullable=False)
    spec = Column(Text, nullable=True)
    qty = Column(Integer, nullable=True)
    stages = Column(StringList, nullable=True)
    image_url = Column(Text, nullable=True)
    catalogue_page = Column(Integer, nullable=True)
    sort_order = Column(Integer, default=100, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now)
