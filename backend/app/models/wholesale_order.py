from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class WholesaleOrder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    retailer_id: int
    wholesaler_id: int
    product_id: int
    quantity: int
    total_price: float
    status: str = Field(default="Pending")
    order_date: datetime = Field(default_factory=datetime.utcnow)
