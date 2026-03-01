from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.user import UserCreate, UserLogin
from app.utils.auth import get_password_hash, verify_password, create_access_token
from app.db.prisma import prisma
import asyncio
from datetime import timedelta
from app.core.config import settings

class AuthService:
    @staticmethod
    async def create_user(user_in: UserCreate):
        # Check if user exists
        if not prisma.is_connected():
            await prisma.connect()

        existing_user = await prisma.user.find_unique(where={"email": user_in.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        hashed_password = get_password_hash(user_in.password)
        
        new_user = await prisma.user.create(
            data={
                "email": user_in.email,
                "hashedPassword": hashed_password,
                "firstName": user_in.firstName,
                "lastName": user_in.lastName
            }
        )
        return new_user

    @staticmethod
    async def authenticate_user(user_in: UserLogin):
        if not prisma.is_connected():
            await prisma.connect()

        user = await prisma.user.find_unique(where={"email": user_in.email})
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not verify_password(user_in.password, user.hashedPassword):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.id}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer", "user": user}
