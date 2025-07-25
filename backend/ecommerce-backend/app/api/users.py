from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token  # If you defined this in your security.py

from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.crud.user import create_user, get_user
from app.db.session import get_db

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from app.crud.user import get_user_by_email
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)


@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.post("/upgrade", response_model=UserResponse)
def upgrade_user_role(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    if current_user.role == "user":
        current_user.role = "admin"
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
        return current_user
    raise HTTPException(status_code=400, detail="User already has admin role")
