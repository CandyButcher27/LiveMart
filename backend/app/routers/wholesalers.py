from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.services.wholesale_service import WholesaleService
from app.utils.deps import get_current_user

router = APIRouter(prefix="/wholesalers", tags=["Wholesalers"])

@router.post("/orders/")
def place_wholesale_order(product_id: int, quantity: int, wholesaler_id: int, user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can place wholesale orders")
    return WholesaleService.place_wholesale_order(
        retailer_id=None,  # we’ll derive later from JWT
        wholesaler_id=wholesaler_id,
        product_id=product_id,
        quantity=quantity
    )

@router.get("/orders")
def get_wholesaler_orders(user=Depends(get_current_user)):
    if user["role"] != "wholesaler":
        raise HTTPException(status_code=403, detail="Only wholesalers can view their orders")
    return WholesaleService.get_orders_for_wholesaler(wholesaler_id=None)
