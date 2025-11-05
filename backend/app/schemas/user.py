# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str

class UserRead(BaseModel):
    id: int
    name: str
    email: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
