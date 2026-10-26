from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.models.order import OrderStage


class OrderCreate(BaseModel):
    tracking_number: str = Field(..., max_length=50)
    client_name: str = Field(..., max_length=120)
    phone: str = Field(..., max_length=50)
    product: str = Field(..., max_length=150)
    quantity_metric_tons: float = Field(..., gt=0)
    delivery_destination: str = Field(..., max_length=150)
    stage: OrderStage = OrderStage.RFQ_RECEIVED
    estimated_delivery_date: Optional[str] = None
    vehicle_number: Optional[str] = None
    notes: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    tracking_number: str
    client_name: str
    phone: str
    product: str
    quantity_metric_tons: float
    delivery_destination: str
    stage: OrderStage
    estimated_delivery_date: Optional[str] = None
    vehicle_number: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
