from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.schemas.product import ProductCreate, ProductRead
from app.services.product_service import ProductService
from app.utils.deps import get_current_user
from fastapi import Query
from sqlmodel import Session, select

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductRead)
def create_product(product: ProductCreate, user=Depends(get_current_user)):
    role = user["role"]

    # Allow both retailers and wholesalers to add products
    if role not in ["retailer", "wholesaler"]:
        raise HTTPException(status_code=403, detail="Only retailers or wholesalers can add products")

    # Determine product type based on user role
    product_type = "retail" if role == "retailer" else "wholesale"

    # Get owner_id from logged-in user (we'll use email to fetch)
    from app.models.user import User
    from app.database import engine
    from sqlmodel import Session, select

    with Session(engine) as session:
        db_user = session.exec(select(User).where(User.email == user["email"])).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        owner_id = db_user.id

    return ProductService.create_product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock=product.stock,
        retailer_id=owner_id,
        product_type=product_type
    )



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