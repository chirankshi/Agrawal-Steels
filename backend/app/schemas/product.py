from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(..., max_length=150)
    category: str = Field(..., max_length=100)
    category_slug: Optional[str] = Field(None, max_length=100)
    subcategory: Optional[str] = Field(None, max_length=120)
    subcategory_slug: Optional[str] = Field(None, max_length=120)
    tagline: Optional[str] = Field(None, max_length=200)
    grade: Optional[str] = Field(None, max_length=150)
    description: str
    specs: Optional[str] = Field(None, max_length=250)
    sizes: Optional[str] = Field(None, max_length=250)
    dispatch: Optional[str] = Field(None, max_length=250)
    applications: Optional[List[str]] = []
    badge: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = None
    gallery: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    estimated_price_per_ton: Optional[float] = None
    sort_order: int = 100
    show_on_home: bool = False
    catalogue_page: Optional[int] = None
    is_active: bool = True


class ProductCreate(ProductBase):
    slug: str = Field(..., max_length=100)


class ProductUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    category_slug: Optional[str] = None
    subcategory: Optional[str] = None
    subcategory_slug: Optional[str] = None
    tagline: Optional[str] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    specs: Optional[str] = None
    sizes: Optional[str] = None
    dispatch: Optional[str] = None
    applications: Optional[List[str]] = None
    badge: Optional[str] = None
    image_url: Optional[str] = None
    gallery: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    estimated_price_per_ton: Optional[float] = None
    sort_order: Optional[int] = None
    show_on_home: Optional[bool] = None
    catalogue_page: Optional[int] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True
