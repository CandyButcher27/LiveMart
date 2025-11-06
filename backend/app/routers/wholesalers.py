from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.wholesale_order import WholesaleOrder
from app.models.product import Product
from app.models.user import User
from app.utils.deps import get_current_user

router = APIRouter()

# 🧩 Place a wholesale order (retailer → wholesaler)
@router.post("/orders")
def place_wholesale_order(
    product_id: int,
    quantity: int,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    # Only retailers can place wholesale orders
    if user["role"] != "retailer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only retailers can place wholesale orders."
        )

    # Fetch product
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.product_type != "wholesale":
        raise HTTPException(status_code=400, detail="This product is not a wholesale item")

    wholesaler_id = product.owner_id
    if not wholesaler_id:
        raise HTTPException(status_code=400, detail="Invalid wholesaler ID")

    total_price = product.price * quantity

    # Create wholesale order
    new_order = WholesaleOrder(
        retailer_id=user["id"],
        wholesaler_id=wholesaler_id,
        product_id=product_id,
        quantity=quantity,
        total_price=total_price
    )

    session.add(new_order)
    session.commit()
    session.refresh(new_order)

    return {
        "message": "Wholesale order placed successfully!",
        "order_id": new_order.id,
        "total_price": total_price
    }


# 🧩 View all wholesale orders received (wholesaler only)
@router.get("/orders")
def get_wholesale_orders(
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    if user["role"] != "wholesaler":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only wholesalers can view wholesale orders."
        )

    orders = session.exec(
        select(WholesaleOrder).where(WholesaleOrder.wholesaler_id == user["id"])
    ).all()

    return orders
