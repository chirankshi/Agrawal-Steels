import json
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.site_setting import SiteSetting

router = APIRouter(prefix="/settings", tags=["Site Settings"])


def _row(db: Session) -> SiteSetting:
    row = db.query(SiteSetting).filter(SiteSetting.id == 1).first()
    if not row:
        row = SiteSetting(id=1, data={})
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("", include_in_schema=False)
@router.get("/")
def get_settings(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Current site settings (announcement bar, phones, emails, hours, catalogue link)."""
    data = _row(db).data
    if isinstance(data, str):  # legacy rows that stored JSON text
        try:
            data = json.loads(data)
        except ValueError:
            data = {}
    return data if isinstance(data, dict) else {}


@router.put("", include_in_schema=False)
@router.put("/")
def update_settings(payload: Dict[str, Any], db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Replace the site settings with the submitted object."""
    row = _row(db)
    row.data = dict(payload)
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    return payload
