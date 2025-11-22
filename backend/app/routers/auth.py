from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_session
from app.models.user import User
from app.models.otp import OTP
from app.schemas.user import UserCreate, UserRead
from app.schemas.otp import OTPRequest, OTPVerify, LoginWithOTP
from app.utils.auth import hash_password, verify_password, create_access_token
from app.utils.email import send_otp_email
from app.config import settings

router = APIRouter(tags=["Authentication"])


# ==========================================================
# Helper — Create & Send OTP
# ==========================================================
async def create_and_send_otp(email: str, session: Session, username: str | None = None):
    # Delete old OTPs
    session.exec(OTP.__table__.delete().where(OTP.email == email))

    otp = OTP.generate_otp()

    otp_record = OTP(
        email=email,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    )
    session.add(otp_record)
    session.commit()

    await send_otp_email(email, otp, username)
    return {"message": "OTP sent successfully"}


# ==========================================================
# Register — Request OTP
# ==========================================================
@router.post("/register/request-otp", status_code=status.HTTP_200_OK)
async def request_registration_otp(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(400, "User with this email already exists.")

    await create_and_send_otp(user_data.email, session, user_data.name)
    return {"message": "OTP sent to your email. Please verify to complete registration."}


# Payload for final registration step
class RegisterWithOTP(OTPVerify):
    name: str
    email: str
    password: str
    role: str
    city: str


# ==========================================================
# Register — Verify OTP & Create Account
# ==========================================================
@router.post("/register/verify-otp", response_model=UserRead, status_code=201)
async def verify_and_register(
    data: RegisterWithOTP,
    session: Session = Depends(get_session)
):
    otp_record = session.exec(
        select(OTP)
        .where(OTP.email == data.email)
        .where(OTP.otp == data.otp)
        .where(OTP.is_used == False)
        .where(OTP.expires_at > datetime.utcnow())
    ).first()

    if not otp_record:
        raise HTTPException(400, "Invalid or expired OTP")

    otp_record.is_used = True
    session.add(otp_record)

    hashed_pw = hash_password(data.password)
    new_user = User(
        name=data.name,
        email=data.email,
        password_hash=hashed_pw,
        role=data.role,
        city=data.city,
        is_verified=True
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user


# ==========================================================
# Login (OTP) — Request OTP
# ==========================================================
@router.post("/login/request-otp")
async def request_login_otp(
    otp_request: OTPRequest,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.email == otp_request.email)).first()
    if not user:
        raise HTTPException(404, "User not found")

    await create_and_send_otp(user.email, session, user.name)
    return {"message": "OTP sent to your email."}


# ==========================================================
# Login (OTP) — Verify OTP and Login
# ==========================================================
@router.post("/login/verify-otp")
async def verify_otp_and_login(
    login_data: LoginWithOTP,
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")

    otp_record = session.exec(
        select(OTP)
        .where(OTP.email == login_data.email)
        .where(OTP.otp == login_data.otp)
        .where(OTP.is_used == False)
        .where(OTP.expires_at > datetime.utcnow())
    ).first()

    if not otp_record:
        raise HTTPException(400, "Invalid or expired OTP")

    otp_record.is_used = True
    session.add(otp_record)
    session.commit()

    access_token = create_access_token({"sub": user.email, "role": user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "email": user.email,
        "city": user.city,       # ********** FIXED **********
    }


# ==========================================================
# Google Login — Request OTP
# ==========================================================
class GoogleOTPRequest(BaseModel):
    email: str
    name: str
    city: str | None = None


@router.post("/google/request-otp")
async def request_google_otp(
    google_data: GoogleOTPRequest,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.email == google_data.email)).first()

    if not user:
        random_pw = OTP.generate_otp(12)
        hashed_pw = hash_password(random_pw)

        user = User(
            email=google_data.email,
            name=google_data.name,
            password_hash=hashed_pw,
            role="customer",
            city=google_data.city or "Unknown"
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    await create_and_send_otp(google_data.email, session, google_data.name)
    return {"message": "OTP sent successfully"}


# ==========================================================
# Google Login — Verify OTP
# ==========================================================
class VerifyGoogleOTP(BaseModel):
    email: str
    otp: str


@router.post("/google/verify-otp")
async def verify_google_otp(
    verify_data: VerifyGoogleOTP,
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.email == verify_data.email)).first()
    if not user:
        raise HTTPException(404, "User not found")

    otp_record = session.exec(
        select(OTP)
        .where(OTP.email == verify_data.email)
        .where(OTP.otp == verify_data.otp)
    ).first()

    if not otp_record or otp_record.is_used or otp_record.expires_at < datetime.utcnow():
        raise HTTPException(400, "Invalid or expired OTP")

    otp_record.is_used = True
    session.add(otp_record)
    session.commit()

    if not user.is_verified:
        user.is_verified = True
        session.add(user)
        session.commit()

    access_token = create_access_token({"sub": user.email, "role": user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "email": user.email,
        "city": user.city,      # ********** FIXED **********
    }


# ==========================================================
# Legacy Login
# ==========================================================
@router.post("/login", deprecated=True)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    return await verify_otp_and_login(
        LoginWithOTP(
            email=form_data.username,
            password=form_data.password,
            otp=""
        ),
        session
    )
