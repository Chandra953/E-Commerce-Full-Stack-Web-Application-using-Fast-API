from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.crud.product import create_product, get_product, update_product, delete_product, get_all_products
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=ProductResponse)
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db=db, product=product)

@router.get("/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = get_product(db=db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product_info(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = update_product(db=db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}", response_model=dict)
def remove_product(product_id: int, db: Session = Depends(get_db)):
    result = delete_product(db=db, product_id=product_id)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"detail": "Product deleted successfully"}

@router.get("/", response_model=list[ProductResponse])
def list_products(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    products = get_all_products(db=db, skip=skip, limit=limit)
    return products