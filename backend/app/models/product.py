from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    price: float
    stock: int = Field(default=0)
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    product_type: str = Field(default="retail")  # "retail" or "wholesale"
