import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.services.seed import seed_database
from app.routers import enquiries_router, products_router, settings_router, health_router, auth_router, uploads_router, catalogue_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("aggarwal_steels")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize database tables and seed initial data."""
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Seed the product catalogue
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    logger.info("Aggarwal Steels API startup complete.")
    yield
    logger.info("Shutting down Aggarwal Steels API...")


app = FastAPI(
    title=settings.APP_NAME,
    description="""
# Aggarwal Steels — Industrial Backend API

FastAPI backend service powering the Aggarwal Steels platform:
* **Direct Quotation Requests & RFQ Enquiries** (from website contact desk)
* **Live Product Catalog** (IS 2062 HR plates, Fe 550D TMT, ISMB Beams, ISMC Channels, CR/GP Coils)
* **Catalogue Hierarchy** (categories, sub-categories, in-house machines)
* **Site Settings & Product Image Uploads**
* **Admin Authentication & Desk Management**
* **Health & Diagnostics**

Interactive documentation available at `/docs` (Swagger UI) and `/redoc` (ReDoc).
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=settings.ALLOWED_ORIGIN_REGEX or None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(enquiries_router, prefix=settings.API_V1_PREFIX)
app.include_router(products_router, prefix=settings.API_V1_PREFIX)
app.include_router(settings_router, prefix=settings.API_V1_PREFIX)
app.include_router(uploads_router, prefix=settings.API_V1_PREFIX)
app.include_router(catalogue_router, prefix=settings.API_V1_PREFIX)

# Uploaded product images (served at /uploads/<file>)
UPLOADS_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/", tags=["Root"])
def root():
    """Welcome endpoint with API sitemap and links."""
    return JSONResponse(
        content={
            "app": settings.APP_NAME,
            "version": "1.0.0",
            "status": "online",
            "endpoints": {
                "health": f"{settings.API_V1_PREFIX}/health",
                "auth_login": f"{settings.API_V1_PREFIX}/auth/login",
                "products": f"{settings.API_V1_PREFIX}/products",
                "catalogue": f"{settings.API_V1_PREFIX}/catalogue",
                "enquiries": f"{settings.API_V1_PREFIX}/enquiries",
                "settings": f"{settings.API_V1_PREFIX}/settings",
                "uploads": f"{settings.API_V1_PREFIX}/uploads",
                "interactive_docs": "/docs",
                "redoc": "/redoc",
            },
        }
    )
