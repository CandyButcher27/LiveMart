from typing import List, Optional
from sqlmodel import Session, select
from app.database import engine
from app.models.product import Product

import math
import requests
import os

from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

class ProductService:
    @staticmethod
    def create_product(name: str, description: str, price: float, stock: int, retailer_id: int, product_type:str):
        with Session(engine) as session:
            product = Product(
                name=name,
                description=description,
                price=price,
                stock=stock,
                owner_id=retailer_id,
                product_type = product_type
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
        
    @staticmethod
    def get_products_within_distance(lat: float, lng: float, max_distance_km: float):
        """Return products whose retailer is within max_distance_km."""
        with Session(engine) as session:
            # join products with retailer data
            from app.models.user import User
            products = session.exec(select(Product, User)
                                    .join(User, Product.retailer_id == User.id)).all()

            nearby_products = []

            for product, retailer in products:
                if not retailer.latitude or not retailer.longitude:
                    continue

                # Option 1: simple local haversine distance
                distance = ProductService._haversine(lat, lng, retailer.latitude, retailer.longitude)

                # Option 2 (optional): use Google Distance Matrix API
                # url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={lat},{lng}&destinations={retailer.latitude},{retailer.longitude}&key={GOOGLE_API_KEY}"
                # distance = requests.get(url).json()["rows"][0]["elements"][0]["distance"]["value"] / 1000

                if distance <= max_distance_km:
                    nearby_products.append(product)
            return nearby_products

    @staticmethod
    def _haversine(lat1, lon1, lat2, lon2):
        """Calculate the great circle distance in km."""
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) *
             math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) ** 2)
        return R * 2 * math.asin(math.sqrt(a))