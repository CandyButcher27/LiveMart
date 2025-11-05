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
        quantity=order.quantity,
        payment_mode=order.payment_mode
    )

@router.patch("/{order_id}/status", response_model=OrderRead)
def update_order_status(order_id: int, new_status: str, user=Depends(get_current_user)):
    if user["role"] != "retailer":
        raise HTTPException(status_code=403, detail="Only retailers can update orders")
    return OrderService.update_order_status(order_id, new_status)

@router.get("/my-orders", response_model=List[OrderRead])
def get_my_orders(user=Depends(get_current_user)):
    if user["role"] == "customer":
        return OrderService.get_orders_for_customer(user["email"])
    elif user["role"] == "retailer":
        return OrderService.get_all_orders()
    else:
        raise HTTPException(status_code=403, detail="Unauthorized role")
