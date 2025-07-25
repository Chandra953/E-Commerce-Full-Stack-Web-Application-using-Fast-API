from sqlalchemy.orm import Session
from app.models.order import Order
from app.schemas.order import OrderCreate

def create_order(db: Session, order: OrderCreate, user_id: int) -> Order:
    db_order = Order(user_id=user_id, total_price=order.total_price, items=order.items)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_order(db: Session, order_id: int) -> Order:
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders_by_user(db: Session, user_id: int):
    return db.query(Order).filter(Order.user_id == user_id).all()

def get_orders(db, user_id, skip=0, limit=10):
    return db.query(Order).filter(Order.user_id == user_id).offset(skip).limit(limit).all()

def delete_order(db: Session, order_id: int) -> bool:
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
        return True
    return False