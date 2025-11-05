from typing import List, Optional
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
    def get_all_products() -> List[Product]:
        with Session(engine) as session:
            return session.exec(select(Product)).all()

    @staticmethod
    def get_products_by_retailer(retailer_id: int) -> List[Product]:
        with Session(engine) as session:
            return session.exec(select(Product).where(Product.retailer_id == retailer_id)).all()

    # 🆕 New: search and filter
    @staticmethod
    def search_products(
        name: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        in_stock: Optional[bool] = None,
    ) -> List[Product]:
        with Session(engine) as session:
            query = select(Product)

            if name:
                query = query.where(Product.name.ilike(f"%{name}%"))
            if min_price is not None:
                query = query.where(Product.price >= min_price)
            if max_price is not None:
                query = query.where(Product.price <= max_price)
            if in_stock:
                query = query.where(Product.stock > 0)

            results = session.exec(query).all()
            return results
