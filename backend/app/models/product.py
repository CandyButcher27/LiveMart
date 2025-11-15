from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    price: float
    stock: int = Field(default=0)
    category: str = Field(default="other")  # Product category
    delivery_time: int = Field(default=1, ge=1, le=7)  # Delivery time in days (1-7)
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    product_type: str = Field(default="retail")  # "retail" or "wholesale"
