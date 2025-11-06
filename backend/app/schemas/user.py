from pydantic import BaseModel, EmailStr
from typing import Optional

# 🧩 Base schema — shared attributes
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str  # "customer", "retailer", "wholesaler"

# ✅ Schema for creating a new user (includes password)
class UserCreate(UserBase):
    password: str

# ✅ Schema for reading user data (returned in responses)
class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True

# ✅ Schema for login
class UserLogin(BaseModel):
    email: EmailStr
    password: str
