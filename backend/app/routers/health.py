from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db

router = APIRouter(tags=["Health & Status"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Check API service health and database connectivity."""
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "online",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "database": db_status,
        "docs_url": "/docs",
        "redoc_url": "/redoc",
    }
