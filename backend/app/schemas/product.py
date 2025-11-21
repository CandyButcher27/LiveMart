from pydantic import BaseModel, Field
from typing import Optional

# 🧩 Base schema (shared across all product types)
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: Optional[int] = 0
    category: Optional[str] = "other"
    delivery_time: Optional[int] = Field(
        1, ge=1, le=7, description="Delivery time in days (1-7)"
    )

    # ⭐ NEW FIELD — must be in base so both Create & Read inherit it
    image_url: Optional[str] = None


# ✅ Schema for creating a new product
class ProductCreate(ProductBase):
    pass  # owner_id and product_type are auto-set in the backend


# ✅ Schema for reading product data (response model)
class ProductRead(ProductBase):
    id: int
    owner_id: Optional[int]
    product_type: str
    category: str
    delivery_time: int = Field(1, ge=1, le=7)

    class Config:
        orm_mode = True
