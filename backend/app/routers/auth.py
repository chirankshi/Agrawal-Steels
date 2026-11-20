"""Admin authentication.

Two kinds of login:
  * Owner: ADMIN_EMAIL / ADMIN_PASSWORD from the server environment (backend/.env
    locally, Render dashboard live). Always works, even if the database is down,
    and is the only login that can manage the team.
  * Staff: rows in the `admin_users` table, created by the owner in Admin -> Team.
    Passwords are stored as salted PBKDF2 hashes.

ADMIN_SECRET signs the session tokens. A staff token carries a fingerprint of the
password hash, so resetting a password or disabling a login ends their sessions.
"""
import base64
import hashlib
import hmac
import json
import logging
import secrets
import time
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal, get_db
from app.models.admin_user import AdminUser

router = APIRouter(prefix="/auth", tags=["Admin Authentication"])
logger = logging.getLogger(__name__)

DESK_NAME = "Corporate Faridabad Desk"
SESSION_SECONDS = 12 * 60 * 60  # 12 hours
PBKDF2_ROUNDS = 260_000


# ------------------------------------------------------------------ schemas
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


class StaffCreate(BaseModel):
    email: str = Field(..., min_length=5, max_length=200)
    name: str = Field(..., min_length=2, max_length=120)
    role: str = Field("staff", pattern="^(staff|manager)$")
    password: str = Field(..., min_length=8, max_length=200)


class StaffUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=120)
    role: Optional[str] = Field(None, pattern="^(staff|manager)$")
    is_active: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=8, max_length=200)


class StaffOut(BaseModel):
    id: int
    email: str
    name: str
    role: str
    is_active: bool
    last_login_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=200)


# ------------------------------------------------------------------ helpers
def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ROUNDS)
    return f"pbkdf2_sha256${PBKDF2_ROUNDS}${salt.hex()}${digest.hex()}"


def check_password(password: str, stored: str) -> bool:
    try:
        _, rounds, salt, digest = stored.split("$")
        test = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), int(rounds))
        return hmac.compare_digest(test.hex(), digest)
    except Exception:
        return False


def _owner_email() -> str:
    return (settings.ADMIN_EMAIL or "").strip().lower()


def _user_dict(email: str, name: Optional[str] = None, role: str = "owner") -> dict:
    return {
        "email": email,
        "username": name or (email.split("@")[0] if email else "admin"),
        "role": {"owner": "Owner", "manager": "Manager", "staff": "Sales Staff"}.get(role, role),
        "role_key": role,
        "desk": DESK_NAME,
    }


def _secret() -> bytes:
    # Fall back to the password so the token stays valid even if ADMIN_SECRET is unset.
    return (settings.ADMIN_SECRET or settings.ADMIN_PASSWORD or "aggarwal-steels").encode()


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def _unb64(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def _fingerprint(password_hash: str) -> str:
    return hashlib.sha256(password_hash.encode()).hexdigest()[:12]


def issue_token(email: str, fingerprint: str = "") -> str:
    body = {"sub": email.lower(), "exp": int(time.time()) + SESSION_SECONDS}
    if fingerprint:
        body["fp"] = fingerprint
    payload = _b64(json.dumps(body).encode())
    sig = _b64(hmac.new(_secret(), payload.encode(), hashlib.sha256).digest())
    return f"{payload}.{sig}"


def _decode(token: str) -> Optional[dict]:
    try:
        payload, sig = token.split(".", 1)
        expected = _b64(hmac.new(_secret(), payload.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(sig, expected):
            return None
        data = json.loads(_unb64(payload))
        if data.get("exp", 0) < time.time():
            return None
        return data
    except Exception:
        return None


def session_user(token: str) -> Optional[dict]:
    """Returns the signed-in user for a token, or None when it is invalid, expired or revoked."""
    data = _decode(token)
    if not data:
        return None
    email = str(data.get("sub", "")).lower()
    if email and email == _owner_email():
        return _user_dict(email, role="owner")
    db = SessionLocal()
    try:
        user = db.query(AdminUser).filter(AdminUser.email == email).first()
        if not user or not user.is_active or data.get("fp") != _fingerprint(user.password_hash):
            return None
        return _user_dict(user.email, user.name, user.role)
    except Exception as e:
        logger.error("Staff session check failed: %s", e)
        return None
    finally:
        db.close()


def verify_token(token: str) -> Optional[str]:
    user = session_user(token)
    return user["email"] if user else None


def _bearer(authorization: Optional[str]) -> str:
    return (authorization or "").replace("Bearer ", "").strip()


def require_admin(authorization: Optional[str] = Header(None)) -> str:
    """FastAPI dependency: any signed-in admin (owner or active staff). Returns their email."""
    email = verify_token(_bearer(authorization)) if authorization else None
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin login required", headers={"WWW-Authenticate": "Bearer"})
    return email


def require_owner(authorization: Optional[str] = Header(None)) -> str:
    """FastAPI dependency: only the owner login may manage the team."""
    user = session_user(_bearer(authorization)) if authorization else None
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin login required", headers={"WWW-Authenticate": "Bearer"})
    if user["role_key"] != "owner":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owner login can manage team members")
    return user["email"]


# ------------------------------------------------------------------ routes
@router.post("/login", response_model=LoginResponse)
def admin_login(creds: LoginRequest, db: Session = Depends(get_db)):
    """Signs in the owner (server env) or a staff member (admin_users)."""
    email = creds.email.strip().lower()

    owner = _owner_email()
    if owner and settings.ADMIN_PASSWORD and hmac.compare_digest(email, owner):
        if hmac.compare_digest(creds.password, settings.ADMIN_PASSWORD):
            logger.info("Owner login: %s", email)
            return LoginResponse(access_token=issue_token(email), expires_in=SESSION_SECONDS, user=_user_dict(email, role="owner"))
        logger.warning("Failed owner login attempt")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if user and user.is_active and check_password(creds.password, user.password_hash):
        user.last_login_at = datetime.now(timezone.utc)
        db.commit()
        logger.info("Staff login: %s", email)
        return LoginResponse(
            access_token=issue_token(email, _fingerprint(user.password_hash)),
            expires_in=SESSION_SECONDS,
            user=_user_dict(user.email, user.name, user.role),
        )

    if not owner and not user:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Admin login is not configured on the server")
    logger.warning("Failed admin login attempt for %s", email)
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")


@router.get("/verify")
def verify_session(authorization: Optional[str] = Header(None)):
    """Confirms the bearer token is a valid, unexpired, unrevoked session."""
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization header")
    user = session_user(_bearer(authorization))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")
    return {"status": "authenticated", "user": user}


@router.post("/password")
def change_own_password(body: PasswordChange, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Staff change their own password. Returns a fresh token (old sessions end)."""
    user_info = session_user(_bearer(authorization)) if authorization else None
    if not user_info:
        raise HTTPException(status_code=401, detail="Admin login required")
    if user_info["role_key"] == "owner":
        raise HTTPException(status_code=400, detail="The owner password is set on the server (ADMIN_PASSWORD), not here")
    user = db.query(AdminUser).filter(AdminUser.email == user_info["email"]).first()
    if not user or not check_password(body.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is wrong")
    user.password_hash = hash_password(body.new_password)
    db.commit()
    return {"access_token": issue_token(user.email, _fingerprint(user.password_hash)), "expires_in": SESSION_SECONDS}


@router.get("/users", response_model=List[StaffOut], dependencies=[Depends(require_owner)])
def list_staff(db: Session = Depends(get_db)):
    return db.query(AdminUser).order_by(AdminUser.created_at).all()


@router.post("/users", response_model=StaffOut, status_code=201, dependencies=[Depends(require_owner)])
def create_staff(body: StaffCreate, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    if email == _owner_email():
        raise HTTPException(status_code=400, detail="That email is the owner login")
    if db.query(AdminUser).filter(AdminUser.email == email).first():
        raise HTTPException(status_code=409, detail="A team member with this email already exists")
    user = AdminUser(email=email, name=body.name.strip(), role=body.role, password_hash=hash_password(body.password), is_active=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}", response_model=StaffOut, dependencies=[Depends(require_owner)])
def update_staff(user_id: int, body: StaffUpdate, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Team member not found")
    data = body.model_dump(exclude_unset=True)
    if data.get("password"):
        user.password_hash = hash_password(data.pop("password"))
    data.pop("password", None)
    for key, value in data.items():
        setattr(user, key, value.strip() if isinstance(value, str) else value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=204, dependencies=[Depends(require_owner)])
def delete_staff(user_id: int, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(user)
    db.commit()
    return None
