"""Catalogue hierarchy endpoints: /catalogue (read-all), /categories, /subcategories, /machines."""
from typing import List, Optional, Type

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.catalogue import Category, Machine, Subcategory
from app.models.product import Product
from app.schemas.catalogue import (
    CatalogueResponse,
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
    MachineCreate,
    MachineResponse,
    MachineUpdate,
    SubcategoryCreate,
    SubcategoryResponse,
    SubcategoryUpdate,
)

router = APIRouter(tags=["Catalogue Hierarchy"])

LIST_FIELDS = ("partners", "items", "stages")


def _clean(data: dict) -> dict:
    out = dict(data)
    for key in LIST_FIELDS:
        if key in out and out[key] is not None:
            out[key] = [str(v).strip() for v in out[key] if str(v).strip()]
    return out


def _ordered(db: Session, model: Type, only_active: bool):
    q = db.query(model)
    if only_active:
        q = q.filter(model.is_active.is_(True))
    return q.order_by(model.sort_order.asc(), model.id.asc()).all()


def _get_or_404(db: Session, model: Type, item_id: int, label: str):
    row = db.query(model).filter(model.id == item_id).first()
    if not row:
        raise HTTPException(status_code=404, detail=f"{label} not found")
    return row


# ------------------------------------------------------------------ read-all
@router.get("/catalogue", response_model=CatalogueResponse)
def get_catalogue(only_active: bool = Query(True), db: Session = Depends(get_db)):
    """Categories, sub-categories and machines in display order (one call for the public site)."""
    return CatalogueResponse(
        categories=_ordered(db, Category, only_active),
        subcategories=_ordered(db, Subcategory, only_active),
        machines=_ordered(db, Machine, only_active),
    )


# ---------------------------------------------------------------- categories
@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(only_active: bool = Query(False), db: Session = Depends(get_db)):
    return _ordered(db, Category, only_active)


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(body: CategoryCreate, db: Session = Depends(get_db)):
    if db.query(Category).filter(Category.slug == body.slug).first():
        raise HTTPException(status_code=400, detail="A category with this slug already exists")
    row = Category(**_clean(body.model_dump()))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/categories/{item_id}", response_model=CategoryResponse)
def update_category(item_id: int, body: CategoryUpdate, db: Session = Depends(get_db)):
    row = _get_or_404(db, Category, item_id, "Category")
    data = _clean(body.model_dump(exclude_unset=True))
    old_slug = row.slug
    for key, value in data.items():
        setattr(row, key, value)
    db.flush()  # the new slug must exist before children are re-pointed (FK on PostgreSQL)
    # Keep children and products pointing at a renamed category (PostgreSQL also cascades).
    if data.get("slug") and data["slug"] != old_slug:
        db.query(Subcategory).filter(Subcategory.category_slug == old_slug).update({"category_slug": data["slug"]})
        db.query(Product).filter(Product.category_slug == old_slug).update({"category_slug": data["slug"]})
    if data.get("name"):
        db.query(Product).filter(Product.category_slug == row.slug).update({"category": data["name"]})
    db.commit()
    db.refresh(row)
    return row


@router.delete("/categories/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(item_id: int, db: Session = Depends(get_db)):
    row = _get_or_404(db, Category, item_id, "Category")
    db.query(Subcategory).filter(Subcategory.category_slug == row.slug).delete()
    db.delete(row)
    db.commit()
    return None


# ------------------------------------------------------------- subcategories
@router.get("/subcategories", response_model=List[SubcategoryResponse])
def list_subcategories(
    category_slug: Optional[str] = Query(None),
    only_active: bool = Query(False),
    db: Session = Depends(get_db),
):
    q = db.query(Subcategory)
    if category_slug:
        q = q.filter(Subcategory.category_slug == category_slug)
    if only_active:
        q = q.filter(Subcategory.is_active.is_(True))
    return q.order_by(Subcategory.sort_order.asc(), Subcategory.id.asc()).all()


@router.post("/subcategories", response_model=SubcategoryResponse, status_code=status.HTTP_201_CREATED)
def create_subcategory(body: SubcategoryCreate, db: Session = Depends(get_db)):
    if not db.query(Category).filter(Category.slug == body.category_slug).first():
        raise HTTPException(status_code=400, detail="Unknown category_slug")
    dup = db.query(Subcategory).filter(Subcategory.category_slug == body.category_slug, Subcategory.slug == body.slug).first()
    if dup:
        raise HTTPException(status_code=400, detail="A sub-category with this slug already exists in that category")
    row = Subcategory(**_clean(body.model_dump()))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/subcategories/{item_id}", response_model=SubcategoryResponse)
def update_subcategory(item_id: int, body: SubcategoryUpdate, db: Session = Depends(get_db)):
    row = _get_or_404(db, Subcategory, item_id, "Sub-category")
    data = _clean(body.model_dump(exclude_unset=True))
    old_slug, old_cat = row.slug, row.category_slug
    for key, value in data.items():
        setattr(row, key, value)
    db.flush()
    products = db.query(Product).filter(Product.category_slug == old_cat, Product.subcategory_slug == old_slug)
    patch = {}
    if data.get("slug") and data["slug"] != old_slug:
        patch["subcategory_slug"] = data["slug"]
    if data.get("category_slug") and data["category_slug"] != old_cat:
        patch["category_slug"] = data["category_slug"]
    if data.get("name"):
        patch["subcategory"] = data["name"]
    if patch:
        products.update(patch)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/subcategories/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subcategory(item_id: int, db: Session = Depends(get_db)):
    row = _get_or_404(db, Subcategory, item_id, "Sub-category")
    db.delete(row)
    db.commit()
    return None


# ------------------------------------------------------------------ machines
@router.get("/machines", response_model=List[MachineResponse])
def list_machines(only_active: bool = Query(False), db: Session = Depends(get_db)):
    return _ordered(db, Machine, only_active)


@router.post("/machines", response_model=MachineResponse, status_code=status.HTTP_201_CREATED)
def create_machine(body: MachineCreate, db: Session = Depends(get_db)):
    if db.query(Machine).filter(Machine.slug == body.slug).first():
        raise HTTPException(status_code=400, detail="A machine with this slug already exists")
    row = Machine(**_clean(body.model_dump()))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/machines/{item_id}", response_model=MachineResponse)
def update_machine(item_id: int, body: MachineUpdate, db: Session = Depends(get_db)):
    row = _get_or_404(db, Machine, item_id, "Machine")
    for key, value in _clean(body.model_dump(exclude_unset=True)).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/machines/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_machine(item_id: int, db: Session = Depends(get_db)):
    row = _get_or_404(db, Machine, item_id, "Machine")
    db.delete(row)
    db.commit()
    return None
