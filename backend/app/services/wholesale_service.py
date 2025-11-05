from sqlmodel import Session, select
from app.database import engine
from app.models.wholesale_order import WholesaleOrder
from app.models.product import Product
from fastapi import HTTPException

class WholesaleService:
    @staticmethod
    def place_wholesale_order(retailer_id: int, wholesaler_id: int, product_id: int, quantity: int):
        with Session(engine) as session:
            product = session.get(Product, product_id)
            if not product or product.product_type != "wholesale":
                raise HTTPException(status_code=404, detail="Wholesale product not found")
            if product.stock < quantity:
                raise HTTPException(status_code=400, detail="Insufficient wholesale stock")

            total_price = product.price * quantity
            order = WholesaleOrder(
                retailer_id=retailer_id,
                wholesaler_id=wholesaler_id,
                product_id=product_id,
                quantity=quantity,
                total_price=total_price
            )
            session.add(order)
            product.stock -= quantity
            session.add(product)
            session.commit()
            session.refresh(order)
            return order

    @staticmethod
    def get_orders_for_wholesaler(wholesaler_id: int):
        with Session(engine) as session:
            return session.exec(select(WholesaleOrder).where(WholesaleOrder.wholesaler_id == wholesaler_id)).all()
