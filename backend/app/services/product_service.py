from sqlmodel import Session, select
from app.database import engine
from app.models.product import Product

class ProductService:
    @staticmethod
    def create_product(name: str, description: str, price: float, stock: int, retailer_id: int):
        with Session(engine) as session:
            product = Product(
                name=name,
                description=description,
                price=price,
                stock=stock,
                retailer_id=retailer_id
            )
            session.add(product)
            session.commit()
            session.refresh(product)
            return product

    @staticmethod
    def get_all_products():
        with Session(engine) as session:
            return session.exec(select(Product)).all()

    @staticmethod
    def get_products_by_retailer(retailer_id: int):
        with Session(engine) as session:
            return session.exec(select(Product).where(Product.retailer_id == retailer_id)).all()
