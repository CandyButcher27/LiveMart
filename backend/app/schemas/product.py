from pydantic import BaseModel
from typing import Optional

# 🧩 Base schema (shared across all product types)
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: Optional[int] = 0

# ✅ Schema for creating a new product
class ProductCreate(ProductBase):
    pass  # owner_id and product_type are auto-set in the backend

# ✅ Schema for reading product data (response model)
class ProductRead(ProductBase):
    id: int
    owner_id: Optional[int]
    product_type: str

    class Config:
        orm_mode = True
