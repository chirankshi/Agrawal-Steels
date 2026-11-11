from typing import Generator
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings

logger = logging.getLogger("aggarwal_steels")

connect_args = {}
db_url = settings.DATABASE_URL

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    if not db_url.startswith("sqlite"):
        # Test connecting to remote postgres
        temp_engine = create_engine(db_url, connect_args=connect_args, echo=False)
        with temp_engine.connect() as conn:
            pass
        engine = temp_engine
        logger.info("Connected to remote PostgreSQL database successfully.")
    else:
        engine = create_engine(db_url, connect_args=connect_args, echo=False)
except Exception as e:
    logger.warning(f"Remote PostgreSQL connection failed ({e}). Falling back to local SQLite database.")
    db_url = "sqlite:///./aggarwal_steels.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency that yields a database session for requests."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
