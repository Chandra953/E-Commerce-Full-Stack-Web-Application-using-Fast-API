from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True  # Updated for Pydantic v2

class UserOut(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class UserInDB(UserBase):
    hashed_password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True
