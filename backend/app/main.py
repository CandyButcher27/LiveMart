from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import auth, products, orders, wholesalers

# Initialize FastAPI app
app = FastAPI(
    title="LiveMART API",
    description="Backend API for LiveMART platform connecting customers, retailers, and wholesalers",
    version="1.0.0"
)

# Allow frontend to access the backend
origins = [
    "http://localhost:3000",   # React local dev
    "http://127.0.0.1:3000",
    "*"  # (Optional) Allow all origins — relax this in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables
@app.on_event("startup")
def on_startup():
    init_db()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(wholesalers.router, prefix="/wholesalers", tags=["Wholesalers"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to LiveMART API 🚀"}
