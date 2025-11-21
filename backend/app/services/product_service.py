from sqlmodel import Session, select
from app.models.product import Product

# 🧩 Add a new product
def create_product(
    session: Session,
    name: str,
    description: str,
    price: float,
    stock: int,
    owner_id: int,
    product_type: str,
    category: str = "other",
    delivery_time: int = 1,
    image_url: str | None = None   # <-- NEW PARAM
):
    product = Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        category=category,
        owner_id=owner_id,
        product_type=product_type,
        delivery_time=delivery_time,
        image_url=image_url          # <-- STORE IT HERE
    )
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


# 🧩 Get all products (optionally filter by type)
def get_all_products(session: Session, product_type: str = None):
    if product_type:
        return session.exec(select(Product).where(Product.product_type == product_type)).all()
    return session.exec(select(Product)).all()


# 🧩 Get products owned by a specific user
def get_user_products(session: Session, owner_id: int):
    return session.exec(select(Product).where(Product.owner_id == owner_id)).all()
