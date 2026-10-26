from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(..., max_length=150)
    category: str = Field(..., max_length=100)
    grade: Optional[str] = Field(None, max_length=150)
    description: str
    specs: Optional[str] = Field(None, max_length=200)
    badge: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=255)
    tags: Optional[List[str]] = []
    estimated_price_per_ton: Optional[float] = None
    is_active: bool = True


class ProductCreate(ProductBase):
    slug: str = Field(..., max_length=100)


class ProductResponse(ProductBase):
    id: int
    slug: str
    tags: Optional[List[str]] = []
    created_at: datetime

    class Config:
        from_attributes = True
