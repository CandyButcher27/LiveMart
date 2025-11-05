from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.schemas.product import ProductCreate, ProductRead
from app.services.product_service import ProductService
from app.utils.deps import get_current_user
from fastapi import Query

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

# 🆕 Search and filter endpoint
@router.get("/search", response_model=List[ProductRead])
def search_products(
    name: Optional[str] = Query(None, description="Search by product name"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    in_stock: Optional[bool] = Query(None, description="Only show products in stock"),
):
    results = ProductService.search_products(
        name=name, min_price=min_price, max_price=max_price, in_stock=in_stock
    )
    return results

@router.get("/nearby", response_model=List[ProductRead])
def get_products_nearby(
    lat: float = Query(...),
    lng: float = Query(...),
    max_distance_km: float = Query(10.0, description="maximum distance in km")
):
    # Call a service that computes distance and filters retailers/products
    return ProductService.get_products_within_distance(lat, lng, max_distance_km)