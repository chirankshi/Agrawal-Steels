from app.routers.enquiries import router as enquiries_router
from app.routers.products import router as products_router
from app.routers.orders import router as orders_router
from app.routers.health import router as health_router

__all__ = ["enquiries_router", "products_router", "orders_router", "health_router"]
