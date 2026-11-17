from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime
from app.database import Base
from app.models.types import StringList


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    category_slug = Column(String(100), nullable=True, index=True)
    subcategory = Column(String(120), nullable=True)
    subcategory_slug = Column(String(120), nullable=True)
    tagline = Column(String(200), nullable=True)
    grade = Column(String(150), nullable=True)
    description = Column(Text, nullable=False)
    specs = Column(String(250), nullable=True)
    sizes = Column(String(250), nullable=True)
    dispatch = Column(String(250), nullable=True)
    applications = Column(StringList, nullable=True)
    badge = Column(String(50), nullable=True)
    image_url = Column(Text, nullable=True)
    gallery = Column(StringList, nullable=True)
    tags = Column(StringList, nullable=True)
    estimated_price_per_ton = Column(Float, nullable=True)
    sort_order = Column(Integer, default=100, nullable=False)
    show_on_home = Column(Boolean, default=False, nullable=False)
    catalogue_page = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
