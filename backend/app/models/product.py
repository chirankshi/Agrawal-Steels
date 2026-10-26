from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    grade = Column(String(150), nullable=True)
    description = Column(Text, nullable=False)
    specs = Column(String(200), nullable=True)
    badge = Column(String(50), nullable=True)
    image_url = Column(String(255), nullable=True)
    tags = Column(String(255), nullable=True)  # Comma-separated tags (e.g. SAIL, Tata Tiscon)
    estimated_price_per_ton = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
