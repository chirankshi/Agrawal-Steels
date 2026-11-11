from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.order import Order, OrderStage
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Order & Quotation Tracking"])


@router.get("/stats")
def get_order_stats(db: Session = Depends(get_db)):
    """Order and dispatch statistics for the admin dashboard."""
    total = db.query(Order).count()
    total_tonnage = db.query(func.sum(Order.quantity_metric_tons)).scalar() or 0.0

    stage_counts = {}
    for stage in OrderStage:
        stage_counts[stage.value] = db.query(Order).filter(Order.stage == stage).count()

    in_transit = stage_counts.get(OrderStage.IN_TRANSIT.value, 0)
    processing = stage_counts.get(OrderStage.PROCESSING_MILL.value, 0)
    ready = stage_counts.get(OrderStage.READY_DISPATCH.value, 0)
    delivered = stage_counts.get(OrderStage.DELIVERED.value, 0)

    return {
        "total": total,
        "total_tonnage": round(total_tonnage, 2),
        "in_transit": in_transit,
        "processing": processing,
        "ready_dispatch": ready,
        "delivered": delivered,
        "stage_breakdown": stage_counts,
    }


@router.get("/track/{tracking_number}", response_model=OrderResponse)
def track_order(tracking_number: str, db: Session = Depends(get_db)):
    """
    Track order / dispatch progress by unique tracking reference number (e.g., 'AS-2026-7891').
    """
    order = db.query(Order).filter(Order.tracking_number.ilike(tracking_number.strip())).first()
    if not order:
        raise HTTPException(
            status_code=404,
            detail=f"No order found matching tracking number '{tracking_number}'. Please check with our sales desk.",
        )
    return order


@router.get("/", response_model=List[OrderResponse])
def list_orders(
    stage: Optional[OrderStage] = Query(None, description="Filter by fulfillment stage"),
    search: Optional[str] = Query(None, description="Search by tracking number, client name, or product"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List orders for internal desk dashboard with search and stage filters."""
    query = db.query(Order)
    if stage:
        query = query.filter(Order.stage == stage)
    if search:
        term = f"%{search}%"
        query = query.filter(
            (Order.tracking_number.ilike(term))
            | (Order.client_name.ilike(term))
            | (Order.product.ilike(term))
            | (Order.delivery_destination.ilike(term))
            | (Order.vehicle_number.ilike(term))
        )
    return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order tracking record."""
    existing = db.query(Order).filter(Order.tracking_number == order_in.tracking_number.strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Order tracking number already registered")

    order = Order(**order_in.model_dump())
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Fetch details of a single order by ID."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order record not found")
    return order


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    order_in: OrderUpdate,
    db: Session = Depends(get_db),
):
    """Update details or stage of an order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order record not found")

    update_data = order_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)

    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """Delete an order tracking record."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order record not found")

    db.delete(order)
    db.commit()
    return None
