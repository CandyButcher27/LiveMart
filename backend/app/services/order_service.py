from sqlmodel import Session, select
from app.database import engine
from app.models.order import Order
from app.models.product import Product
from fastapi import HTTPException

class OrderService:
    @staticmethod
    def place_order(customer_email: str, product_id: int, quantity: int, payment_mode: str):
        with Session(engine) as session:
            product = session.get(Product, product_id)
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            if product.stock < quantity:
                raise HTTPException(status_code=400, detail="Insufficient stock")

            total_price = product.price * quantity
            payment_status = "Completed" if payment_mode == "online" else "Pending"

            # Create order
            order = Order(
                customer_email=customer_email,
                product_id=product_id,
                quantity=quantity,
                total_price=total_price,
                payment_mode=payment_mode,
                payment_status=payment_status,
                status="Pending"
            )

            session.add(order)
            product.stock -= quantity
            session.add(product)
            session.commit()
            session.refresh(order)
            return order

    @staticmethod
    def update_order_status(order_id: int, new_status: str):
        with Session(engine) as session:
            order = session.get(Order, order_id)
            if not order:
                raise HTTPException(status_code=404, detail="Order not found")
            order.status = new_status
            session.add(order)
            session.commit()
            session.refresh(order)
            return order

    @staticmethod
    def get_orders_for_customer(customer_email: str):
        with Session(engine) as session:
            return session.exec(select(Order).where(Order.customer_email == customer_email)).all()

    @staticmethod
    def get_all_orders():
        with Session(engine) as session:
            return session.exec(select(Order)).all()
