from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Enum
import enum
from app.database import Base


class OrderStage(str, enum.Enum):
    RFQ_RECEIVED = "RFQ Received"
    PRICE_QUOTED = "Quotation Sent"
    PO_CONFIRMED = "PO Confirmed"
    PROCESSING_MILL = "Processing at Stockyard / Mill"
    READY_DISPATCH = "Ready for Dispatch"
    IN_TRANSIT = "In Transit"
    DELIVERED = "Delivered"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String(50), unique=True, index=True, nullable=False)
    client_name = Column(String(120), nullable=False)
    phone = Column(String(50), nullable=False)
    product = Column(String(150), nullable=False)
    quantity_metric_tons = Column(Float, nullable=False)
    delivery_destination = Column(String(150), nullable=False)
    stage = Column(Enum(OrderStage), default=OrderStage.RFQ_RECEIVED, nullable=False)
    estimated_delivery_date = Column(String(50), nullable=True)
    vehicle_number = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
