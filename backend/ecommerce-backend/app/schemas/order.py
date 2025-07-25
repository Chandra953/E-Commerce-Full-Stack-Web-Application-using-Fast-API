from pydantic import BaseModel
from typing import List
from datetime import datetime
from app.schemas.product import Product

class OrderCreate(BaseModel):
    items: List[int]  # List of product IDs
    total_price: float

class Order(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    items: List[Product]  # List of product objects
    total_price: float

    class Config:
        from_attributes = True