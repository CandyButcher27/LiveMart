from fastapi import APIRouter, Depends, HTTPException
from app.schemas.product import ProductCreate, ProductRead
from app.services.product_service import ProductService
from app.utils.deps import get_current_user
from typing import List

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductRead)
def create_product(product: ProductCreate, user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can add products")
    return ProductService.create_product(
        product.name, product.description, product.price, product.stock, retailer_id=None
    )

@router.get("/", response_model=List[ProductRead])
def list_products():
    return ProductService.get_all_products()
