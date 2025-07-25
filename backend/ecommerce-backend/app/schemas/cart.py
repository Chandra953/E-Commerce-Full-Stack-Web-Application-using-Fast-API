from pydantic import BaseModel, validator
from app.schemas.product import ProductInCart

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    @validator('quantity')
    def quantity_must_be_positive(cls, v):
        if v < 1:
            raise ValueError('Quantity must be at least 1')
        return v

class CartItem(CartItemBase):
    id: int
    user_id: int
    product: ProductInCart

    class Config:
        from_attributes = True