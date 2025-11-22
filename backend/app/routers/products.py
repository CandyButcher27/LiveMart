from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductRead
from app.utils.deps import get_current_user

router = APIRouter()


# ======================================================
# CREATE PRODUCT
# ======================================================
@router.post("/", response_model=ProductRead)
def add_product(
    product_data: ProductCreate,
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
):
    if user["role"] not in ["retailer", "wholesaler"]:
        raise HTTPException(403, "Only retailers or wholesalers can add products.")

    product_type = (
        "retail" if user["role"] == "retailer" else "wholesale"
    )

    product = Product(
        **product_data.dict(),
        owner_id=user["id"],
        product_type=product_type
    )

    session.add(product)
    session.commit()
    session.refresh(product)
    return product


# ======================================================
# GET ALL PRODUCTS BASED ON ROLE (Main endpoint)
# ======================================================
@router.get("/", response_model=list[ProductRead])
def get_products(
    session: Session = Depends(get_session),
    user = Depends(get_current_user),
    city: str | None = Query(None)
):
    role = user["role"]

    # Base query depending on user type
    if role == "customer":
        query = select(Product).where(Product.product_type == "retail")

    elif role == "retailer":
        query = select(Product).where(
            (Product.product_type == "wholesale") &
            (Product.owner_id != user["id"])
        )

    elif role == "wholesaler":
        query = select(Product).where(Product.owner_id == user["id"])

    else:
        raise HTTPException(403, "Invalid role")

    # Apply optional city filter
    if city:
        query = query.where(Product.city == city)

    products = session.exec(query).all()
    return products


# ======================================================
# MY PRODUCTS (retailer only)
# ======================================================
@router.get("/my-products", response_model=list[ProductRead])
def get_my_products(
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
):
    if user["role"] != "retailer":
        raise HTTPException(403, "Only retailers can view their own products.")

    query = select(Product).where(
        (Product.owner_id == user["id"]) &
        (Product.product_type == "retail")
    )

    return session.exec(query).all()


# ======================================================
# CUSTOMER → PROXY MODE (Wholesale visibility)
# ======================================================
@router.get("/proxy-wholesale", response_model=list[ProductRead])
def get_wholesale_proxy(
    session: Session = Depends(get_session),
    user = Depends(get_current_user),
    city: str | None = Query(None)
):
    if user["role"] != "customer":
        raise HTTPException(403, "Only customers can use proxy mode")

    query = select(Product).where(Product.product_type == "wholesale")

    if city:
        query = query.where(Product.city == city)

    return session.exec(query).all()
