from fastapi import APIRouter

router = APIRouter()

from . import auth, users, products, cart, orders

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(products.router, prefix="/products", tags=["products"])
router.include_router(cart.router, prefix="/cart", tags=["cart"])
router.include_router(orders.router, prefix="/orders", tags=["orders"])