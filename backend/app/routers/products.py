from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.routers.auth import require_admin
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/products", tags=["Product Catalog"])

def format_product_response(product: Product) -> ProductResponse:
    return ProductResponse(
        id=product.id,
        slug=product.slug,
        name=product.name,
        category=product.category,
        category_slug=product.category_slug,
        subcategory=product.subcategory,
        subcategory_slug=product.subcategory_slug,
        tagline=product.tagline,
        grade=product.grade,
        description=product.description,
        specs=product.specs,
        sizes=product.sizes,
        dispatch=product.dispatch,
        applications=list(product.applications or []),
        badge=product.badge,
        image_url=product.image_url,
        gallery=list(product.gallery or []),
        tags=list(product.tags or []),
        estimated_price_per_ton=product.estimated_price_per_ton,
        sort_order=product.sort_order or 0,
        show_on_home=bool(product.show_on_home),
        catalogue_page=product.catalogue_page,
        is_active=product.is_active,
        created_at=product.created_at,
    )


def _to_columns(data: dict) -> dict:
    """Normalises list fields; the StringList column type handles storage."""
    out = dict(data)
    for key in ("tags", "applications", "gallery"):
        if key in out and out[key] is not None:
            out[key] = [str(v).strip() for v in out[key] if str(v).strip()]
    return out


@router.get("", response_model=List[ProductResponse], include_in_schema=False)
@router.get("/", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category label"),
    category_slug: Optional[str] = Query(None, description="Filter by catalogue category slug"),
    subcategory_slug: Optional[str] = Query(None, description="Filter by catalogue sub-category slug"),
    search: Optional[str] = Query(None, description="Search by product name, grade, or specs"),
    only_active: bool = Query(False, description="True for the public site, False for admin"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """Retrieve the product catalogue with optional category, search and active filters."""
    query = db.query(Product)
    if only_active:
        query = query.filter(Product.is_active.is_(True))
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if category_slug:
        query = query.filter(Product.category_slug == category_slug)
    if subcategory_slug:
        query = query.filter(Product.subcategory_slug == subcategory_slug)
    if search:
        term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(term))
            | (Product.grade.ilike(term))
            | (Product.description.ilike(term))
            | (Product.specs.ilike(term))
            | (Product.tagline.ilike(term))
        )

    products = query.order_by(Product.sort_order.asc(), Product.id.asc()).offset(skip).limit(limit).all()
    return [format_product_response(p) for p in products]


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """Distinct category labels currently in the catalogue."""
    categories = db.query(Product.category).distinct().all()
    return [c[0] for c in categories if c[0]]


@router.get("/{slug_or_id}", response_model=ProductResponse)
def get_product_by_slug_or_id(slug_or_id: str, db: Session = Depends(get_db)):
    """Fetch product details by ID or URL slug."""
    product = None
    if slug_or_id.isdigit():
        product = db.query(Product).filter(Product.id == int(slug_or_id)).first()
    if not product:
        product = db.query(Product).filter(Product.slug == slug_or_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{slug_or_id}' not found")
    return format_product_response(product)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False, dependencies=[Depends(require_admin)])
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    """Add a new product to the catalogue."""
    if db.query(Product).filter(Product.slug == product_in.slug).first():
        raise HTTPException(status_code=400, detail="Product with this slug already exists")

    product = Product(**_to_columns(product_in.model_dump()))
    db.add(product)
    db.commit()
    db.refresh(product)
    return format_product_response(product)


@router.put("/{product_id}", response_model=ProductResponse, dependencies=[Depends(require_admin)])
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    """Update an existing product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in _to_columns(product_in.model_dump(exclude_unset=True)).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return format_product_response(product)


@router.patch("/{product_id}/toggle-active", response_model=ProductResponse, dependencies=[Depends(require_admin)])
def toggle_product_active(product_id: int, db: Session = Depends(get_db)):
    """Toggle whether a product is visible on the public website."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = not product.is_active
    db.commit()
    db.refresh(product)
    return format_product_response(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product from the catalogue."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return None
