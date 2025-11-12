from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.utils.deps import get_current_user
from app.schemas.order import OrderCreate

router = APIRouter(tags=["Orders"])

# 🧩 Place a retail order (customer → retailer)
@router.post("/")
def place_order(
    order: OrderCreate,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    """
    Allows customers to place retail orders.
    Retailers and wholesalers cannot call this endpoint.
    """

    # ✅ 1. Ensure only customers can place retail orders
    if user["role"] != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can place retail orders."
        )

    # ✅ 2. Unpack order details
    product_id = order.product_id
    quantity = order.quantity

    # ✅ 3. Fetch product from DB
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # ✅ 4. Ensure the product is retail
    if product.product_type != "retail":
        raise HTTPException(status_code=400, detail="Cannot order wholesale products")

    # ✅ 5. Check stock availability
    if quantity > product.stock:
        raise HTTPException(status_code=400, detail="Insufficient stock available")

    # ✅ 6. Calculate total price
    total_price = product.price * quantity

    # ✅ 7. Create the new order
    new_order = Order(
        customer_id=user["id"],
        product_id=product_id,
        quantity=quantity,
        total_price=total_price,
        status="Pending"
    )

    # ✅ 8. Update product stock
    product.stock -= quantity

    # ✅ 9. Commit transaction
    session.add(new_order)
    session.add(product)
    session.commit()
    session.refresh(new_order)

    return {
        "message": "Order placed successfully!",
        "order_id": new_order.id,
        "product": product.name,
        "total_price": total_price,
        "remaining_stock": product.stock
    }


# 🧩 View orders placed by a customer
@router.get("/my-orders")
def get_customer_orders(
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    """
    Returns all orders placed by the currently logged-in customer.
    """

    # ✅ 1. Ensure only customers can view their orders
    if user["role"] != "customer":
        raise HTTPException(
            status_code=403,
            detail="Only customers can view their orders."
        )

    # ✅ 2. Fetch orders for this customer
    orders = session.exec(
        select(Order).where(Order.customer_id == user["id"])
    ).all()

    return orders

# 🧩 Get all incoming orders for wholesaler’s products
@router.get("/wholesaler")
def get_wholesaler_orders(
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    """
    Returns all orders placed on the wholesaler's products.
    """

    if user["role"] != "wholesaler":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only wholesalers can view their incoming orders."
        )

    # Select all orders where the product's owner_id matches the wholesaler
    stmt = (
        select(Order)
        .join(Product)
        .where(Product.owner_id == user["id"])
    )
    orders = session.exec(stmt).all()

    return orders
# 🧩 Get all customer orders for a retailer’s products
@router.get("/retailer")
def get_retailer_orders(
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    """
    Returns all orders placed on the retailer's products.
    """

    if user["role"] != "retailer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only retailers can view orders for their products."
        )

    stmt = (
        select(Order)
        .join(Product)
        .where(Product.owner_id == user["id"])
    )
    orders = session.exec(stmt).all()

    return orders

# 🧩 Place a wholesale order (retailer → wholesaler)
@router.post("/wholesale")
def place_wholesale_order(
    order: OrderCreate,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    """
    Allows retailers to place wholesale orders (buying from wholesalers).
    """

    # ✅ 1. Only retailers can do this
    if user["role"] != "retailer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only retailers can place wholesale orders."
        )

    # ✅ 2. Fetch product
    product = session.get(Product, order.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # ✅ 3. Ensure it's wholesale
    if product.product_type != "wholesale":
        raise HTTPException(status_code=400, detail="Only wholesale products allowed")

    # ✅ 4. Check stock
    if order.quantity > product.stock:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    # ✅ 5. Calculate total
    total_price = product.price * order.quantity

    # ✅ 6. Create wholesale order (reusing Order model)
    new_order = Order(
        customer_id=user["id"],  # buyer is retailer
        product_id=order.product_id,
        quantity=order.quantity,
        total_price=total_price,
        status="Pending",
    )

    # ✅ 7. Reduce wholesaler’s stock
    product.stock -= order.quantity

    session.add(new_order)
    session.add(product)
    session.commit()
    session.refresh(new_order)

    return {
        "message": "Wholesale order placed successfully!",
        "order_id": new_order.id,
        "product": product.name,
        "total_price": total_price,
        "remaining_stock": product.stock,
    }
