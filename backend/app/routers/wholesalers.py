from fastapi import APIRouter, Depends, HTTPException
from app.schemas.wholesale_order import WholesaleOrderCreate
from app.services.wholesale_service import WholesaleService
from app.utils.deps import get_current_user
from sqlmodel import Session
from app.database import engine
from app.models.product import Product
from typing import List

router = APIRouter(prefix="/wholesalers", tags=["Wholesalers"])

@router.post("/orders/")
def place_wholesale_order(order: WholesaleOrderCreate, user=Depends(get_current_user)):
    # Only retailers can buy from wholesalers
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can place wholesale orders")

    with Session(engine) as session:
        product = session.get(Product, order.product_id)
        if not product or product.product_type != "wholesale":
            raise HTTPException(status_code=400, detail="This product is not available for wholesale")

        wholesaler_id = product.owner_id

    return WholesaleService.place_wholesale_order(
        retailer_email=user["email"],
        wholesaler_id=wholesaler_id,
        product_id=order.product_id,
        quantity=order.quantity
    )

@router.get("/orders", response_model=List[dict])
def get_wholesaler_orders(user=Depends(get_current_user)):
    if user["role"] != "wholesaler":
        raise HTTPException(status_code=403, detail="Only wholesalers can view their orders")

    return WholesaleService.get_orders_for_wholesaler(wholesaler_id=user["id"])
