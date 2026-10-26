import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.enquiry import Enquiry, EnquiryStatus
from app.schemas.enquiry import EnquiryCreate, EnquiryResponse, EnquiryUpdateStatus

router = APIRouter(prefix="/enquiries", tags=["Quotation & Contact Enquiries"])
logger = logging.getLogger(__name__)


@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_enquiry(enquiry_in: EnquiryCreate, db: Session = Depends(get_db)):
    """
    Submit a new quotation request / customer enquiry from the website.
    This saves the enquiry to the database and can trigger internal notifications.
    """
    try:
        new_enquiry = Enquiry(
            name=enquiry_in.name,
            phone=enquiry_in.phone,
            email=str(enquiry_in.email) if enquiry_in.email else None,
            product=enquiry_in.product,
            message=enquiry_in.message,
            status=EnquiryStatus.PENDING,
            source="website_rfq_form",
        )
        db.add(new_enquiry)
        db.commit()
        db.refresh(new_enquiry)

        logger.info(
            "New RFQ enquiry logged (ID: %d) from %s (%s) for %s",
            new_enquiry.id,
            new_enquiry.name,
            new_enquiry.phone,
            new_enquiry.product,
        )
        return new_enquiry
    except Exception as e:
        db.rollback()
        logger.error("Failed to submit enquiry: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record your enquiry. Please reach our direct sales desk.",
        )


@router.get("/", response_model=List[EnquiryResponse])
def list_enquiries(
    status_filter: Optional[EnquiryStatus] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all recorded customer enquiries with optional status filter."""
    query = db.query(Enquiry)
    if status_filter:
        query = query.filter(Enquiry.status == status_filter)
    return query.order_by(Enquiry.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{enquiry_id}", response_model=EnquiryResponse)
def get_enquiry(enquiry_id: int, db: Session = Depends(get_db)):
    """Fetch details of a single enquiry by its ID."""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry


@router.patch("/{enquiry_id}/status", response_model=EnquiryResponse)
def update_enquiry_status(
    enquiry_id: int,
    status_update: EnquiryUpdateStatus,
    db: Session = Depends(get_db),
):
    """Update status of an enquiry (e.g., pending -> quoted -> closed)."""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    enquiry.status = status_update.status
    db.commit()
    db.refresh(enquiry)
    return enquiry
