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
    owner_id: Optional[int] = None
    product_type: str

    class Config:
        orm_mode = True
