from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int

class ProductRead(BaseModel):
    id: int
    name: str
    description: str
    price: float
    stock: int
    retailer_id: Optional[int]
