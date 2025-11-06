# 🛒 LiveMART Backend

**LiveMART** is a FastAPI-powered backend for a supply-chain marketplace connecting **Customers**, **Retailers**, and **Wholesalers** in a single system.

This backend handles:
- Authentication with JWT
- Role-based access control
- Product management (retail & wholesale)
- Order handling (retail and wholesale chains)

---

## 🚀 Tech Stack

| Component | Technology |
|------------|-------------|
| Framework | **FastAPI** |
| ORM | **SQLModel (SQLAlchemy + Pydantic)** |
| Database | **SQLite (Dev)** |
| Auth | **JWT** via `python-jose` |
| Password Hashing | **Passlib (sha256_crypt)** |
| Server | **Uvicorn** |
| Language | **Python 3.10+** |

---

## 🧱 Project Structure

```
backend/
│
├── app/
│   ├── main.py                # FastAPI entry point
│   ├── database.py            # SQLModel engine and DB session
│   │
│   ├── models/                # Database models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── wholesale_order.py
│   │
│   ├── routers/               # API route handlers
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   └── wholesalers.py
│   │
│   ├── schemas/               # Request/response models
│   │   ├── user.py
│   │   ├── product.py
│   │   └── wholesale_order.py
│   │
│   ├── services/              # Business logic layer
│   │   ├── product_service.py
│   │   └── wholesale_service.py
│   │
│   └── utils/                 # Utility functions
│       ├── auth.py
│       └── deps.py
│
├── livemart.db                # SQLite database (auto-created)
└── requirements.txt
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/LiveMART-Backend.git
cd LiveMART-Backend/backend
```

### 2️⃣ Create a virtual environment

```bash
python -m venv venv
.
env\Scripts ctivate     # On Windows
# OR
source venv/bin/activate    # On Mac/Linux
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run the FastAPI server

```bash
uvicorn app.main:app --reload
```

Your backend will start at:  
👉 **http://127.0.0.1:8000**

Swagger UI (API docs):  
👉 **http://127.0.0.1:8000/docs**

---

## 🧩 Key Models

### 🧍 User
| Field | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| name | str | User’s name |
| email | str | Unique email |
| password_hash | str | Hashed password |
| role | str | `"customer"`, `"retailer"`, `"wholesaler"` |

### 📦 Product
| Field | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| name | str | Product name |
| description | str | Product description |
| price | float | Unit price |
| stock | int | Available stock |
| owner_id | int | Creator (retailer/wholesaler) |
| product_type | str | `"retail"` or `"wholesale"` |

### 🧾 Order
Retail order from **customer → retailer**

### 🏭 WholesaleOrder
Wholesale order from **retailer → wholesaler**

---

## 🔐 Authentication Flow

### Register
`POST /auth/register`
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "1234",
  "role": "customer"
}
```

### Login
`POST /auth/login`
Form fields:
```
username = alice@example.com
password = 1234
```

Response:
```json
{
  "access_token": "<JWT_TOKEN>",
  "token_type": "bearer",
  "role": "customer"
}
```

Use this token in Swagger’s **Authorize** button:
```
Bearer <JWT_TOKEN>
```

---

## 🛠️ Core Endpoints

| Endpoint | Method | Role | Description |
|-----------|---------|------|-------------|
| `/auth/register` | POST | All | Register a new user |
| `/auth/login` | POST | All | Get JWT token |
| `/products/` | POST | Retailer / Wholesaler | Add new product |
| `/products/` | GET | All | View products (filtered by role) |
| `/products/all` | GET | Any | View all products |
| `/orders/` | POST | Customer | Place retail order |
| `/orders/my-orders` | GET | Customer | View customer’s orders |
| `/wholesalers/orders` | POST | Retailer | Place wholesale order |
| `/wholesalers/orders` | GET | Wholesaler | View received orders |

---

## 🧪 Testing the Backend via Swagger

### Step 1️⃣ Start Server
```bash
uvicorn app.main:app --reload
```

Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Step 2️⃣ Register 3 Users
- Customer → `customer@example.com`
- Retailer → `retailer@example.com`
- Wholesaler → `wholesaler@example.com`

### Step 3️⃣ Login & Copy Token
Use `/auth/login` → copy the `access_token`

Click **Authorize** → paste:
```
Bearer <token>
```

### Step 4️⃣ Test Role-Based APIs

#### 🏪 Retailer adds retail product
`POST /products/`
```json
{
  "name": "Organic Honey",
  "description": "Pure honey from farms",
  "price": 15.5,
  "stock": 25
}
```

#### 🏭 Wholesaler adds wholesale product
```json
{
  "name": "Bulk Honey Drum",
  "description": "15kg container for retailers",
  "price": 200.0,
  "stock": 50
}
```

#### 👤 Customer buys from retailer
`POST /orders/`
```
product_id: 1
quantity: 2
```

#### 🏪 Retailer buys from wholesaler
`POST /wholesalers/orders`
```
product_id: 2
quantity: 5
```

#### 🏭 Wholesaler views incoming orders
`GET /wholesalers/orders`

✅ Done — end-to-end backend flow verified via Swagger.

---

## 🧠 Role Permissions Summary

| Role | Permissions |
|------|--------------|
| Customer | Can view retail products, place retail orders |
| Retailer | Can add retail products, buy wholesale stock |
| Wholesaler | Can add wholesale products, view incoming wholesale orders |

---

## 🧰 Developer Notes

- Database auto-creates on startup (`livemart.db`).
- For a clean slate, delete the DB:
  ```bash
  del livemart.db
  ```
- CORS is preconfigured for `http://localhost:3000` (React frontend).
- Use `.env` for production secrets.

---

## 📦 Example Requirements (`requirements.txt`)

```txt
fastapi==0.115.0
sqlmodel==0.0.21
uvicorn==0.31.1
python-jose==3.3.0
passlib==1.7.4
pydantic==2.8.2
```



