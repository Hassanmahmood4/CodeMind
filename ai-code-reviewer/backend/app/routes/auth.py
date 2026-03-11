from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(name=data.name, email=data.email, hashed_password=get_password_hash(data.password))
    db.add(user)
    await db.flush()
    await db.refresh(user)
    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return Token(access_token=token, user=UserResponse(id=user.id, name=user.name, email=user.email, created_at=user.created_at.isoformat() if user.created_at else ""))


@router.post("/login", response_model=Token)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return Token(access_token=token, user=UserResponse(id=user.id, name=user.name, email=user.email, created_at=user.created_at.isoformat() if user.created_at else ""))
