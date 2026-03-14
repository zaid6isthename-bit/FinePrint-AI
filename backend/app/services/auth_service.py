from fastapi import HTTPException, status
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.utils.auth import get_password_hash, verify_password, create_access_token
from app.db.prisma import db, ensure_db_connected
from datetime import timedelta
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    async def create_user(user_in: UserCreate) -> UserResponse:
        try:
            await ensure_db_connected()
            # Check if user already exists
            existing_user = await db.user.find_unique(where={"email": user_in.email})
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )

            # Hash password and create user
            hashed_password = get_password_hash(user_in.password)

            new_user = await db.user.create(
                data={
                    "email": user_in.email,
                    "hashedPassword": hashed_password,
                    "firstName": user_in.firstName,
                    "lastName": user_in.lastName
                }
            )
            
            logger.info(f"User created successfully: {new_user.email}")
            return UserResponse.from_orm(new_user)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )

    @staticmethod
    async def authenticate_user(user_in: UserLogin):
        try:
            await ensure_db_connected()
            # Find user by email
            user = await db.user.find_unique(where={"email": user_in.email})
            
            if not user:
                logger.warning(f"Login attempt with non-existent email: {user_in.email}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )
            
            # Verify password
            if not user.hashedPassword or not verify_password(user_in.password, user.hashedPassword):
                logger.warning(f"Failed password verification for: {user_in.email}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )

            # Create access token
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.id}, expires_delta=access_token_expires
            )

            logger.info(f"User authenticated successfully: {user.email}")
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": UserResponse.from_orm(user)
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error during authentication: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication failed"
            )
