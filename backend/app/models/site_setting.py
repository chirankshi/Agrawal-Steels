from datetime import datetime, timezone
from sqlalchemy import Column, Integer, DateTime
from app.database import Base
from app.models.types import JSONData


class SiteSetting(Base):
    """Single-row table (id = 1) holding the editable site settings as JSON."""

    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True)
    data = Column(JSONData, nullable=False, default=dict)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
