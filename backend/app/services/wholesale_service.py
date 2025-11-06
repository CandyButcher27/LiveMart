from sqlmodel import Session, select
from fastapi import HTTPException, status

from app.models.wholesale_order import WholesaleOrder
from app.models.product import Product
from app.models.user import User

# 🧩 Place a wholesale order
def place_wholesale_order(session: Session, retailer_email: str, product_id: int, quantity: int):
    # Get retailer
    retailer = session.exec(select(User).where(User.email == retailer_email)).first()
    if not retailer:
        raise HTTPException(status_code=404, detail="Retailer not found")

    # Get product
    product = session.get(Product, product_id)
    if not product or product.product_type != "wholesale":
        raise HTTPException(status_code=400, detail="Invalid wholesale product")

    # Get wholesaler
    wholesaler_id = product.owner_id
    if not wholesaler_id:
        raise HTTPException(status_code=400, detail="Product has no associated wholesaler")

    total_price = product.price * quantity

    # Create order
    order = WholesaleOrder(
        retailer_id=retailer.id,
        wholesaler_id=wholesaler_id,
        product_id=product_id,
        quantity=quantity,
        total_price=total_price
    )

    session.add(order)
    session.commit()
    session.refresh(order)

    return order

# 🧩 Get all orders received by a wholesaler
def get_wholesaler_orders(session: Session, wholesaler_id: int):
    return session.exec(select(WholesaleOrder).where(WholesaleOrder.wholesaler_id == wholesaler_id)).all()
