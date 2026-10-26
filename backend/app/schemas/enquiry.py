from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.enquiry import EnquiryStatus


class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120, description="Full Name or Company Name")
    phone: str = Field(..., min_length=7, max_length=50, description="Phone or WhatsApp Number")
    email: Optional[EmailStr] = Field(None, description="Official Contact Email")
    product: str = Field(..., min_length=2, max_length=150, description="Primary Steel Product Requested")
    message: Optional[str] = Field(None, max_length=2000, description="Specifications, Tonnage, and Site details")


class EnquiryUpdateStatus(BaseModel):
    status: EnquiryStatus


class EnquiryResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    product: str
    message: Optional[str] = None
    status: EnquiryStatus
    source: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
