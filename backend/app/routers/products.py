from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductRead
from app.utils.deps import get_current_user

router = APIRouter()

# 🧩 Add a new product (retailer or wholesaler)
@router.post("/", response_model=ProductRead)
def add_product(
    product_data: ProductCreate,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    # Only retailers or wholesalers can add products
    if user["role"] not in ["retailer", "wholesaler"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only retailers or wholesalers can add products."
        )

    product_type = "retail" if user["role"] == "retailer" else "wholesale"

    product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        stock=product_data.stock,
        owner_id=user["id"],
        product_type=product_type
    )
    session.add(product)
    session.commit()
    session.refresh(product)

    return product


# 🧩 Get all products (for debugging or admin)
@router.get("/all", response_model=list[ProductRead])
def get_all_products(session: Session = Depends(get_session)):
    products = session.exec(select(Product)).all()
    return products


@router.get("/", response_model=list[ProductRead])
def get_products(
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    role = user["role"]

    # Customer → see only retail products
    if role == "customer":
        products = session.exec(
            select(Product).where(Product.product_type == "retail")
        ).all()

    # Retailer → see wholesale products (posted by wholesalers)
    elif role == "retailer":
        products = session.exec(
            select(Product)
            .where(Product.product_type == "wholesale")
            .where(Product.owner_id != user["id"])  # not their own
        ).all()

    # Wholesaler → see only their own products
    elif role == "wholesaler":
        products = session.exec(
            select(Product).where(Product.owner_id == user["id"])
        ).all()

    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid role")

    return products
