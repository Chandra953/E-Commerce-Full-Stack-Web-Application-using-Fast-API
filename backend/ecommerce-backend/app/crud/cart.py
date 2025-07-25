from sqlalchemy.orm import Session
from app.models.cart import Cart

# Add or update a cart item for a user
def add_to_cart(db: Session, user_id: int, product_id: int, quantity: int):
    cart_item = db.query(Cart).filter(Cart.user_id == user_id, Cart.product_id == product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item

# Update the quantity of a cart item by item_id and user_id
def update_cart_item(db: Session, item_id: int, cart_item_data, user_id: int):
    cart_item = db.query(Cart).filter(Cart.id == item_id, Cart.user_id == user_id).first()
    if cart_item:
        cart_item.quantity = cart_item_data.quantity
        db.commit()
        db.refresh(cart_item)
        return cart_item
    return None

# Remove a cart item by item_id and user_id
def remove_from_cart(db: Session, item_id: int, user_id: int):
    cart_item = db.query(Cart).filter(Cart.id == item_id, Cart.user_id == user_id).first()
    if cart_item:
        db.delete(cart_item)
        db.commit()
        return True
    return False