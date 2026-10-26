from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order, OrderStage
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Order & Quotation Tracking"])


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
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List orders for internal desk dashboard."""
    query = db.query(Order)
    if stage:
        query = query.filter(Order.stage == stage)
    return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order tracking record."""
    existing = db.query(Order).filter(Order.tracking_number == order_in.tracking_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Order tracking number already registered")

    order = Order(**order_in.model_dump())
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
