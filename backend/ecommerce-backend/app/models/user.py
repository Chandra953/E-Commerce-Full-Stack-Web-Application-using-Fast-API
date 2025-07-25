from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.core.security import verify_password

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum("admin", "user", name="user_roles"), default="user")

    cart_items = relationship("Cart", back_populates="user")
    orders = relationship("Order", back_populates="user")

    def verify_password(self, plain_password):
        return verify_password(plain_password, self.password)
