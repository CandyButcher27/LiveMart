from pydantic import BaseModel
from typing import Optional

# 🧩 Base schema — shared fields
class WholesaleOrderBase(BaseModel):
    retailer_id: int
    wholesaler_id: int
    product_id: int
    quantity: int
    total_price: float
    status: Optional[str] = "Pending"

# ✅ Schema for creating a wholesale order (retailers use this)
class WholesaleOrderCreate(BaseModel):
    product_id: int
    quantity: int

# ✅ Schema for reading wholesale order data (for wholesalers)
class WholesaleOrderRead(WholesaleOrderBase):
    id: int

    class Config:
        orm_mode = True
