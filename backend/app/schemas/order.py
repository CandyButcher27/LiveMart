from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OrderCreate(BaseModel):
    product_id: int
    quantity: int

class OrderRead(BaseModel):
    id: int
    customer_email: str
    product_id: int
    quantity: int
    total_price: float
    order_date: datetime
    status: str
