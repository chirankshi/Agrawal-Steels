"""Admin authentication.

The admin email + password are configured through environment variables
(ADMIN_EMAIL / ADMIN_PASSWORD) in backend/.env locally and in the Render
dashboard for the live deployment. ADMIN_SECRET signs the session tokens.
"""
import base64
import hashlib
import hmac
import json
import logging
import time
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

from app.config import settings

router = APIRouter(prefix="/auth", tags=["Admin Authentication"])
logger = logging.getLogger(__name__)

DESK_NAME = "Corporate Faridabad Desk"
SESSION_SECONDS = 12 * 60 * 60  # 12 hours


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


def _admin_user() -> dict:
    email = settings.ADMIN_EMAIL
    return {
        "email": email,
        "username": email.split("@")[0] if email else "admin",
        "role": "Super Admin",
        "desk": DESK_NAME,
    }


def _secret() -> bytes:
    # Fall back to the password so the token stays valid even if ADMIN_SECRET is unset.
    return (settings.ADMIN_SECRET or settings.ADMIN_PASSWORD or "aggarwal-steels").encode()


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def _unb64(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def issue_token(email: str) -> str:
    payload = _b64(json.dumps({"sub": email, "exp": int(time.time()) + SESSION_SECONDS}).encode())
    sig = _b64(hmac.new(_secret(), payload.encode(), hashlib.sha256).digest())
    return f"{payload}.{sig}"


def verify_token(token: str) -> Optional[str]:
    try:
        payload, sig = token.split(".", 1)
        expected = _b64(hmac.new(_secret(), payload.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(sig, expected):
            return None
        data = json.loads(_unb64(payload))
        if data.get("exp", 0) < time.time():
            return None
        if data.get("sub", "").lower() != settings.ADMIN_EMAIL.lower():
            return None
        return data["sub"]
    except Exception:
        return None


@router.post("/login", response_model=LoginResponse)
def admin_login(creds: LoginRequest):
    """Authenticate the admin with the configured email + password."""
    email = creds.email.strip().lower()

    if not settings.ADMIN_EMAIL or not settings.ADMIN_PASSWORD:
        logger.error("ADMIN_EMAIL / ADMIN_PASSWORD are not configured")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Admin login is not configured on the server")

    email_ok = hmac.compare_digest(email, settings.ADMIN_EMAIL.strip().lower())
    pass_ok = hmac.compare_digest(creds.password, settings.ADMIN_PASSWORD)
    if email_ok and pass_ok:
        logger.info("Admin login successful for %s", email)
        return LoginResponse(access_token=issue_token(email), expires_in=SESSION_SECONDS, user=_admin_user())

    logger.warning("Failed admin login attempt for %s", email)
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")


@router.get("/verify")
def verify_session(authorization: Optional[str] = Header(None)):
    """Verify that the bearer token is a valid, unexpired admin session."""
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization header")
    token = authorization.replace("Bearer ", "").strip()
    if not verify_token(token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")
    return {"status": "authenticated", "user": _admin_user()}
