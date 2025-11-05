from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import OrderService
from app.utils.deps import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderRead)
def place_order(order: OrderCreate, user=Depends(get_current_user)):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Only customers can place orders")
    return OrderService.place_order(
        customer_email=user["email"],
        product_id=order.product_id,
        quantity=order.quantity
    )

@router.get("/my-orders", response_model=List[OrderRead])
def get_my_orders(user=Depends(get_current_user)):
    if user["role"] == "customer":
        return OrderService.get_orders_for_customer(user["email"])
    elif user["role"] == "retailer":
        # (we’ll enhance later for wholesalers)
        return OrderService.get_orders_for_retailer(retailer_id=None)
    else:
        raise HTTPException(status_code=403, detail="Unauthorized role")
