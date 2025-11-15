from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="user.id")
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    total_price: float
    status: str = Field(default="Pending")  # "Pending", "Completed", "Cancelled"

    created_at: datetime = Field(default_factory=datetime.utcnow)
