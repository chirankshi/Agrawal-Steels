import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status
from pydantic import BaseModel
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Admin Authentication"])
logger = logging.getLogger(__name__)


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/login", response_model=LoginResponse)
def admin_login(creds: LoginRequest):
    """Authenticate admin desk user."""
    if creds.username.strip() == settings.ADMIN_USERNAME and creds.password.strip() == settings.ADMIN_PASSWORD:
        logger.info("Admin login successful for user: %s", creds.username)
        return LoginResponse(
            access_token=settings.ADMIN_TOKEN,
            token_type="bearer",
            user={
                "username": settings.ADMIN_USERNAME,
                "role": "Super Admin",
                "desk": "Corporate Faridabad Desk",
                "email": settings.SALES_EMAIL,
            },
        )

    logger.warning("Failed admin login attempt for user: %s", creds.username)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid admin username or password",
    )


@router.get("/verify")
def verify_session(authorization: Optional[str] = Header(None)):
    """Verify that current auth token is valid."""
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization header")

    token = authorization.replace("Bearer ", "").strip()
    if token != settings.ADMIN_TOKEN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")

    return {
        "status": "authenticated",
        "user": {
            "username": settings.ADMIN_USERNAME,
            "role": "Super Admin",
            "desk": "Corporate Faridabad Desk",
        },
    }

