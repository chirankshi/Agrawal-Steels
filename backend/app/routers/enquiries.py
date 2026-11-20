import logging
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from app.routers.auth import require_admin
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.enquiry import Enquiry, EnquiryStatus
from app.schemas.enquiry import EnquiryCreate, EnquiryResponse, EnquiryUpdateStatus, EnquiryUpdate
from app.services.notify import send_enquiry_alert, smtp_configured
from app.database import SessionLocal

router = APIRouter(prefix="/enquiries", tags=["Quotation & Contact Enquiries"])
logger = logging.getLogger(__name__)


@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_enquiry(enquiry_in: EnquiryCreate, background: BackgroundTasks, db: Session = Depends(get_db)):
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
            source=enquiry_in.source or "website_rfq_form",
            notes=enquiry_in.notes,
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
        background.add_task(_alert_once, new_enquiry.id)
        return new_enquiry
    except Exception as e:
        db.rollback()
        logger.error("Failed to submit enquiry: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record your enquiry. Please reach our direct sales desk.",
        )


def _label(status) -> str:
    value = getattr(status, "value", status)
    return {"pending": "Pending", "in_review": "In review", "quoted": "Quoted", "closed": "Closed"}.get(value, str(value))


def _log(enquiry: Enquiry, by: str, text: str, kind: str = "event") -> None:
    """Appends a timestamped entry to the enquiry's history (newest last)."""
    entries = list(enquiry.history or [])
    entries.append({"at": datetime.now(timezone.utc).isoformat(), "by": by, "text": text[:2000], "kind": kind})
    enquiry.history = entries[-200:]


ALERT_WINDOW = timedelta(hours=6)


def _alert_once(enquiry_id: int) -> bool:
    """Emails the sales team about an enquiry once. Safe to call repeatedly."""
    db = SessionLocal()
    try:
        enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
        if not enquiry or enquiry.notified_at:
            return False
        created = enquiry.created_at
        if created and created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        if created and datetime.now(timezone.utc) - created > ALERT_WINDOW:
            return False  # old enquiry: never alert late or on request replays
        if send_enquiry_alert(enquiry):
            enquiry.notified_at = datetime.now(timezone.utc)
            db.commit()
            return True
        return False
    finally:
        db.close()


@router.post("/{enquiry_id}/notify", status_code=status.HTTP_202_ACCEPTED)
def notify_new_enquiry(enquiry_id: int, background: BackgroundTasks):
    """Called by the website right after a visitor submits the form.

    Public on purpose (the form saves straight to the database), but harmless:
    each enquiry is emailed at most once, and only within a few hours of arriving.
    """
    background.add_task(_alert_once, enquiry_id)
    return {"queued": True, "email_alerts": smtp_configured()}


@router.get("/stats", dependencies=[Depends(require_admin)])
def get_enquiry_stats(db: Session = Depends(get_db)):
    """Summary counts for admin dashboard."""
    total = db.query(Enquiry).count()
    pending = db.query(Enquiry).filter(Enquiry.status == EnquiryStatus.PENDING).count()
    in_review = db.query(Enquiry).filter(Enquiry.status == EnquiryStatus.IN_REVIEW).count()
    quoted = db.query(Enquiry).filter(Enquiry.status == EnquiryStatus.QUOTED).count()
    closed = db.query(Enquiry).filter(Enquiry.status == EnquiryStatus.CLOSED).count()

    return {
        "total": total,
        "pending": pending,
        "in_review": in_review,
        "quoted": quoted,
        "closed": closed,
    }


@router.get("", response_model=List[EnquiryResponse], include_in_schema=False, dependencies=[Depends(require_admin)])
@router.get("/", response_model=List[EnquiryResponse], dependencies=[Depends(require_admin)])
def list_enquiries(
    status_filter: Optional[EnquiryStatus] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    since_days: Optional[int] = Query(None, ge=1, le=3650, description="Only enquiries from the last N days"),
    assigned_to: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List all recorded customer enquiries with optional status filter and search."""
    query = db.query(Enquiry)
    if status_filter:
        query = query.filter(Enquiry.status == status_filter)
    if since_days:
        query = query.filter(Enquiry.created_at >= datetime.now(timezone.utc) - timedelta(days=since_days))
    if assigned_to:
        query = query.filter(Enquiry.assigned_to == assigned_to)
    if search:
        term = f"%{search}%"
        query = query.filter(
            (Enquiry.name.ilike(term))
            | (Enquiry.phone.ilike(term))
            | (Enquiry.email.ilike(term))
            | (Enquiry.product.ilike(term))
            | (Enquiry.message.ilike(term))
        )
    return query.order_by(Enquiry.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{enquiry_id}", response_model=EnquiryResponse, dependencies=[Depends(require_admin)])
def get_enquiry(enquiry_id: int, db: Session = Depends(get_db)):
    """Fetch details of a single enquiry by its ID."""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry


@router.patch("/{enquiry_id}/status", response_model=EnquiryResponse, dependencies=[Depends(require_admin)])
def update_enquiry_status(
    enquiry_id: int,
    status_update: EnquiryUpdateStatus,
    db: Session = Depends(get_db),
    admin: str = Depends(require_admin),
):
    """Update status of an enquiry (e.g., pending -> quoted -> closed)."""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    if enquiry.status != status_update.status:
        _log(enquiry, admin, f"Status changed to {_label(status_update.status)}")
    enquiry.status = status_update.status
    db.commit()
    db.refresh(enquiry)
    return enquiry


@router.put("/{enquiry_id}", response_model=EnquiryResponse, dependencies=[Depends(require_admin)])
def update_enquiry(
    enquiry_id: int,
    enquiry_in: EnquiryUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(require_admin),
):
    """Update an enquiry. `add_note` appends to the history; status and assignment changes are logged."""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    update_data = enquiry_in.model_dump(exclude_unset=True)
    note = (update_data.pop("add_note", None) or "").strip()
    if note:
        _log(enquiry, admin, note, kind="note")
    if "status" in update_data and update_data["status"] and update_data["status"] != enquiry.status:
        _log(enquiry, admin, f"Status changed to {_label(update_data['status'])}")
    if "assigned_to" in update_data:
        who = (update_data["assigned_to"] or "").strip() or None
        update_data["assigned_to"] = who
        if who != (enquiry.assigned_to or None):
            _log(enquiry, admin, f"Assigned to {who}" if who else "Unassigned")
    for field, value in update_data.items():
        setattr(enquiry, field, value)

    db.commit()
    db.refresh(enquiry)
    return enquiry


@router.delete("/{enquiry_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_enquiry(enquiry_id: int, db: Session = Depends(get_db)):
    """Delete an enquiry from the database."""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    db.delete(enquiry)
    db.commit()
    return None
