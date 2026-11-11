from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/products", tags=["Product Catalog"])


def format_product_response(product: Product) -> ProductResponse:
    tag_list = [t.strip() for t in product.tags.split(",") if t.strip()] if product.tags else []
    return ProductResponse(
        id=product.id,
        slug=product.slug,
        name=product.name,
        category=product.category,
        grade=product.grade,
        description=product.description,
        specs=product.specs,
        badge=product.badge,
        image_url=product.image_url,
        tags=tag_list,
        estimated_price_per_ton=product.estimated_price_per_ton,
        is_active=product.is_active,
        created_at=product.created_at,
    )


@router.get("", response_model=List[ProductResponse], include_in_schema=False)
@router.get("/", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category (e.g. 'Structural Steel', 'Plates & Coils')"),
    search: Optional[str] = Query(None, description="Search by product name, grade, or specs"),
    only_active: bool = Query(False, description="Filter only active products (set True for public site, False for admin)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """Retrieve catalog of steel products with optional category, search, and active filters."""
    query = db.query(Product)
    if only_active:
        query = query.filter(Product.is_active.is_(True))
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_filter))
            | (Product.grade.ilike(search_filter))
            | (Product.description.ilike(search_filter))
            | (Product.specs.ilike(search_filter))
        )

    products = query.order_by(Product.id.asc()).offset(skip).limit(limit).all()
    return [format_product_response(p) for p in products]


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """Get list of distinct steel categories in stock."""
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


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    """Add a new steel product specification to the catalog."""
    existing = db.query(Product).filter(Product.slug == product_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")

    tags_str = ",".join(product_in.tags) if product_in.tags else None
    product = Product(
        slug=product_in.slug,
        name=product_in.name,
        category=product_in.category,
        grade=product_in.grade,
        description=product_in.description,
        specs=product_in.specs,
        badge=product_in.badge,
        image_url=product_in.image_url,
        tags=tags_str,
        estimated_price_per_ton=product_in.estimated_price_per_ton,
        is_active=product_in.is_active,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return format_product_response(product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing steel product specification."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    if "tags" in update_data and update_data["tags"] is not None:
        product.tags = ",".join(update_data["tags"])
        del update_data["tags"]

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return format_product_response(product)


@router.patch("/{product_id}/toggle-active", response_model=ProductResponse)
def toggle_product_active(product_id: int, db: Session = Depends(get_db)):
    """Toggle whether a product is currently active in the public catalog."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = not product.is_active
    db.commit()
    db.refresh(product)
    return format_product_response(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product from the database."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return None
