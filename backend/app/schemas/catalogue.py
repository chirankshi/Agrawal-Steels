from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------- categories
class CategoryBase(BaseModel):
    name: str = Field(..., max_length=150)
    company: Optional[str] = None
    description: Optional[str] = None
    partners: Optional[List[str]] = []
    capacity: Optional[str] = None
    catalogue_page: Optional[int] = None
    image_url: Optional[str] = None
    sort_order: int = 100
    is_active: bool = True


class CategoryCreate(CategoryBase):
    slug: str = Field(..., max_length=100)


class CategoryUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    partners: Optional[List[str]] = None
    capacity: Optional[str] = None
    catalogue_page: Optional[int] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ------------------------------------------------------------- subcategories
class SubcategoryBase(BaseModel):
    category_slug: str = Field(..., max_length=100)
    name: str = Field(..., max_length=150)
    description: Optional[str] = None
    items: Optional[List[str]] = []
    catalogue_page: Optional[int] = None
    image_url: Optional[str] = None
    sort_order: int = 100
    is_active: bool = True


class SubcategoryCreate(SubcategoryBase):
    slug: str = Field(..., max_length=120)


class SubcategoryUpdate(BaseModel):
    category_slug: Optional[str] = None
    slug: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    items: Optional[List[str]] = None
    catalogue_page: Optional[int] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class SubcategoryResponse(SubcategoryBase):
    id: int
    slug: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ------------------------------------------------------------------ machines
class MachineBase(BaseModel):
    group_name: str = Field(..., max_length=100)
    name: str = Field(..., max_length=150)
    spec: Optional[str] = None
    qty: Optional[int] = None
    stages: Optional[List[str]] = []
    image_url: Optional[str] = None
    catalogue_page: Optional[int] = None
    sort_order: int = 100
    is_active: bool = True


class MachineCreate(MachineBase):
    slug: str = Field(..., max_length=120)


class MachineUpdate(BaseModel):
    slug: Optional[str] = None
    group_name: Optional[str] = None
    name: Optional[str] = None
    spec: Optional[str] = None
    qty: Optional[int] = None
    stages: Optional[List[str]] = None
    image_url: Optional[str] = None
    catalogue_page: Optional[int] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class MachineResponse(MachineBase):
    id: int
    slug: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CatalogueResponse(BaseModel):
    """Everything the public site needs in one call."""

    categories: List[CategoryResponse]
    subcategories: List[SubcategoryResponse]
    machines: List[MachineResponse]
