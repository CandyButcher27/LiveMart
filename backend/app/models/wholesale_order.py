from typing import Optional
from sqlmodel import SQLModel, Field

class WholesaleOrder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    retailer_id: int = Field(foreign_key="user.id")
    wholesaler_id: int = Field(foreign_key="user.id")
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    total_price: float
    status: str = Field(default="Pending")  # "Pending", "Approved", "Delivered", etc.
