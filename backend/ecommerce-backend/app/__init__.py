# app/__init__.py

from fastapi import FastAPI

app = FastAPI()

from .api import auth, users, products, cart, orders

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)