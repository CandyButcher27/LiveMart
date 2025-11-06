from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.utils.deps import get_current_user

router = APIRouter()

# 🧩 Place a retail order (customer → retailer)
@router.post("/")
def place_order(
    product_id: int,
    quantity: int,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    # Ensure only customers can place retail orders
    if user["role"] != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can place retail orders."
        )

    # Fetch product
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.product_type != "retail":
        raise HTTPException(status_code=400, detail="Cannot order wholesale products")

    # Check stock availability
    if quantity > product.stock:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    total_price = product.price * quantity

    # Create order
    new_order = Order(
        customer_id=user["id"],
        product_id=product_id,
        quantity=quantity,
        total_price=total_price
    )

    # Update stock
    product.stock -= quantity

    session.add(new_order)
    session.add(product)
    session.commit()
    session.refresh(new_order)

    return {
        "message": "Order placed successfully!",
        "order_id": new_order.id,
        "total_price": total_price,
        "remaining_stock": product.stock
    }


# 🧩 View orders placed by a customer
@router.get("/my-orders")
def get_customer_orders(
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Only customers can view orders.")

    orders = session.exec(select(Order).where(Order.customer_id == user["id"])).all()
    return orders
