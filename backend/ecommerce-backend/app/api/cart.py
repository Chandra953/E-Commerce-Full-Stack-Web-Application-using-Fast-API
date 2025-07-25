from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.cart import CartItemBase, CartItemCreate, CartItem
from app.crud.cart import add_to_cart, update_cart_item, remove_from_cart
from app.db.session import get_db
from app.api.users import get_current_user
from app.models.user import User
from app.models.cart import Cart


router = APIRouter()

@router.get("/", response_model=list[CartItem])
def get_cart_items(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve all items in the user's cart."""
    cart_items = db.query(Cart).filter(Cart.user_id == user.id).all()
    return [CartItem.from_orm(item) for item in cart_items]


@router.post("/add", response_model=CartItem)
def create_cart_item(cart_item: CartItemCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return add_to_cart(db, user.id, cart_item.product_id, cart_item.quantity)

@router.put("/{item_id}", response_model=CartItem)
def update_cart_item_route(item_id: int, cart_item: CartItemBase, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_item = update_cart_item(db, item_id, cart_item, user.id)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item

@router.delete("/{item_id}", response_model=dict)
def delete_cart_item(item_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    success = remove_from_cart(db, item_id, user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"detail": "Item removed from cart"}