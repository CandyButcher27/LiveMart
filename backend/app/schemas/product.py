from pydantic import BaseModel, Field
from typing import Optional

# 🧩 Base schema (shared across ProductCreate & ProductRead)
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: Optional[int] = 0
    category: Optional[str] = "other"
    delivery_time: Optional[int] = Field(
        1, ge=1, le=7, description="Delivery time in days (1-7)"
    )

    # ⭐ NEW FIELD — Image stored in frontend or Cloud
    image_url: Optional[str] = None

    # ⭐ NEW FIELD — City where the product is located
    city: str   # REQUIRED for all products (retail & wholesale)


# ✅ Schema for creating a new product
class ProductCreate(ProductBase):
    pass
    # owner_id & product_type are set automatically in backend


# ✅ Schema for reading product data (response model)
class ProductRead(ProductBase):
    id: int
    owner_id: Optional[int]
    product_type: str
    category: str
    delivery_time: int = Field(1, ge=1, le=7)

    class Config:
        orm_mode = True
