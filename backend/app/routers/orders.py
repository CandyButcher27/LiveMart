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

    # ✅ 2. Fetch orders for this customer with product details
    orders = session.exec(
        select(Order, Product)
        .join(Product, Order.product_id == Product.id)
        .where(Order.customer_id == user["id"])
    ).all()

    # Format response to include product category
    result = []
    for order, product in orders:
        order_data = order.dict()
        order_data["category"] = product.category
        result.append(order_data)

    return result

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
    orders = session.exec(
        select(Order, Product)
        .join(Product, Order.product_id == Product.id)
        .where(Product.owner_id == user["id"])
    ).all()

    # Format response to include product category
    result = []
    for order, product in orders:
        order_data = order.dict()
        order_data["category"] = product.category
        result.append(order_data)

    return result
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

    orders = session.exec(
        select(Order, Product)
        .join(Product, Order.product_id == Product.id)
        .where(Product.owner_id == user["id"])
    ).all()

    # Format response to include product category
    result = []
    for order, product in orders:
        order_data = order.dict()
        order_data["category"] = product.category
        result.append(order_data)

    return result

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
    
@router.patch("/{order_id}/status")
def update_retail_order_status(
    order_id: int,
    payload: dict,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")

    # 1. Fetch order
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Fetch product linked to this order
    product = session.get(Product, order.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 3. Only retailers can update retail product orders
    if user["role"] != "retailer":
        raise HTTPException(
            status_code=403,
            detail="Only retailers can update order status"
        )

    # 4. Retailer must OWN this product
    if product.owner_id != user["id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to update this order"
        )

    # 5. Product must be retail
    if product.product_type != "retail":
        raise HTTPException(
            status_code=400,
            detail="Only retail product orders can be updated by retailers"
        )

    # 6. Update status
    order.status = new_status
    session.add(order)
    session.commit()
    session.refresh(order)

    return {
        "message": "Order status updated successfully",
        "order_id": order.id,
        "new_status": new_status
    }


@router.get("/my-wholesale-orders")
def get_my_wholesale_orders(
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
):
    if user["role"] != "retailer":
        raise HTTPException(
            status_code=403,
            detail="Only retailers can view their wholesale purchases."
        )

    orders = session.exec(
        select(Order, Product)
        .join(Product, Order.product_id == Product.id)
        .where(Order.customer_id == user["id"])   # retailer is the buyer
        .where(Product.product_type == "wholesale")
    ).all()

    result = []
    for order, product in orders:
        order_dict = order.dict()
        order_dict["product_name"] = product.name
        order_dict["supplier"] = product.owner_id
        order_dict["category"] = product.category
        result.append(order_dict)

    return result
