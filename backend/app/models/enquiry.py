from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
import enum
from app.database import Base


class EnquiryStatus(str, enum.Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    QUOTED = "quoted"
    CLOSED = "closed"


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    phone = Column(String(50), nullable=False, index=True)
    email = Column(String(120), nullable=True)
    product = Column(String(150), nullable=False)
    message = Column(Text, nullable=True)
    status = Column(Enum(EnquiryStatus), default=EnquiryStatus.PENDING, nullable=False)
    source = Column(String(50), default="website_contact_form")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
