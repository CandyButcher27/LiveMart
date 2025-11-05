from sqlmodel import Session, select
from app.database import engine
from app.models.order import Order
from app.models.product import Product
from fastapi import HTTPException

class OrderService:
    @staticmethod
    def place_order(customer_email: str, product_id: int, quantity: int):
        with Session(engine) as session:
            product = session.get(Product, product_id)
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            if product.stock < quantity:
                raise HTTPException(status_code=400, detail="Insufficient stock")

            total_price = product.price * quantity

            # Create order
            order = Order(
                customer_email=customer_email,
                product_id=product_id,
                quantity=quantity,
                total_price=total_price
            )
            session.add(order)

            # Update stock
            product.stock -= quantity
            session.add(product)

            session.commit()
            session.refresh(order)
            return order

    @staticmethod
    def get_orders_for_retailer(retailer_id: int):
        with Session(engine) as session:
            query = (
                select(Order)
                .join(Product)
                .where(Product.retailer_id == retailer_id)
            )
            return session.exec(query).all()

    @staticmethod
    def get_orders_for_customer(customer_email: str):
        with Session(engine) as session:
            return session.exec(
                select(Order).where(Order.customer_email == customer_email)
            ).all()
