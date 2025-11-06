from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from app.utils.auth import SECRET_KEY, ALGORITHM
from app.models.user import User
from sqlmodel import Session, select
from app.database import engine

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # ✅ Return both email and role
        return {"email": user.email, "role": user.role, "id": user.id}
