from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class ProductResponse(Product):
    pass

class ProductInCart(BaseModel):
    id: int
    name: str
    price: float
    image_url: Optional[str] = None

    class Config:
        from_attributes = True 