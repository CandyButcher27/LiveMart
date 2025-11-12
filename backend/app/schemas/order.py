from sqlmodel import SQLModel
from typing import Optional

class OrderCreate(SQLModel):
    product_id: int
    quantity: int
    total_price: Optional[float] = None
