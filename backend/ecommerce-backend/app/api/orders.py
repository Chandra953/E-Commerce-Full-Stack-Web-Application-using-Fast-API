from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.order import OrderCreate, Order
from app.schemas.product import Product  # Import Product schema
from app.crud.order import create_order, get_orders
from app.db.session import get_db
from app.core.security import get_current_user
from app.models.product import Product as ProductModel

router = APIRouter()

@router.post("/place", response_model=Order)
def place_order(order: OrderCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_order = create_order(db=db, order=order, user_id=current_user.id)
    products = db.query(ProductModel).filter(ProductModel.id.in_(db_order.items)).all()
    product_dict = {p.id: p for p in products}
    db_order.items = [product_dict[pid] for pid in db_order.items if pid in product_dict]
    return db_order

@router.get("/", response_model=list[Order])
def read_orders(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    orders = get_orders(db=db, user_id=current_user.id, skip=skip, limit=limit)
    # Replace product IDs in items with product details
    for order in orders:
        products = db.query(ProductModel).filter(ProductModel.id.in_(order.items)).all()
        # Keep the order of items as in order.items
        product_dict = {p.id: p for p in products}
        order.items = [product_dict[pid] for pid in order.items if pid in product_dict]
    return orders