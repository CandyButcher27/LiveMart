from pydantic import BaseModel

class WholesaleOrderCreate(BaseModel):
    product_id: int
    quantity: int
