from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database import Base


class AdminUser(Base):
    """Staff logins for the admin desk. The owner login (ADMIN_EMAIL) lives in the server env."""

    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), unique=True, nullable=False, index=True)
    name = Column(String(120), nullable=False)
    role = Column(String(20), nullable=False, default="staff")  # 'staff' | 'manager'
    password_hash = Column(String(300), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
