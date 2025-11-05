from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OrderCreate(BaseModel):
    product_id: int
    quantity: int
    payment_mode: str  # "online" or "offline"

class OrderRead(BaseModel):
    id: int
    customer_email: str
    product_id: int
    quantity: int
    total_price: float
    payment_mode: str
    payment_status: str
    order_date: datetime
    status: str
