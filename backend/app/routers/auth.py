# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import engine
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserRead
from app.utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserRead)
def register_user(user: UserCreate):
    with Session(engine) as session:
        existing_user = session.exec(select(User).where(User.email == user.email)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_pw = hash_password(user.password)
        new_user = User(
            name=user.name,
            email=user.email,
            password_hash=hashed_pw,
            role=user.role
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user


@router.post("/login")
def login_user(user: UserLogin):
    with Session(engine) as session:
        db_user = session.exec(select(User).where(User.email == user.email)).first()
        if not db_user or not verify_password(user.password, db_user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": db_user.email, "role": db_user.role})
        return {"access_token": token, "token_type": "bearer", "role": db_user.role}
