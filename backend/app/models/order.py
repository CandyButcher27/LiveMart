from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_email: str
    product_id: int
    quantity: int
    total_price: float
    order_date: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="Pending")
