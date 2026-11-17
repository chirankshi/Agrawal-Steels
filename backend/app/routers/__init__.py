from app.routers.enquiries import router as enquiries_router
from app.routers.products import router as products_router
from app.routers.settings import router as settings_router
from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.uploads import router as uploads_router
from app.routers.catalogue import router as catalogue_router

__all__ = ["enquiries_router", "products_router", "settings_router", "health_router", "auth_router", "uploads_router", "catalogue_router"]
