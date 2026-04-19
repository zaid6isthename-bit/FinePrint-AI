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
                    "lastName": user_in.lastName,
                    "clearanceLevel": "Level 1 // Operative"
                }
            )
            
            logger.info(f"User created successfully: {new_user.email}")
            return UserResponse.from_orm(new_user)
        except Exception as e:
            # Check if it was a missing column error
            if "clearanceLevel" in str(e):
                logger.warning(f"Retrying user creation without clearanceLevel column...")
                new_user = await db.user.create(
                    data={
                        "email": user_in.email,
                        "hashedPassword": hashed_password,
                        "firstName": user_in.firstName,
                        "lastName": user_in.lastName
                    }
                )
                # Manually set the field for the response
                user_data = new_user.dict()
                user_data["clearanceLevel"] = "Level 1 // Operative"
                return UserResponse(**user_data)
            raise e
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

            # Calculate Dynamic Clearance Level based on document count
            try:
                doc_count = await db.document.count(where={"userId": user.id})
                
                # Simple level logic
                new_level = "Level 1 // Operative"
                if doc_count > 10:
                    new_level = "Level 4 // Master Auditor"
                elif doc_count > 5:
                    new_level = "Level 3 // Senior Analyst"
                elif doc_count > 2:
                    new_level = "Level 2 // Special Agent"
                    
                # If level has changed, update it in DB
                # We check hasattr because the prisma client might not have the attribute yet in some cache states
                current_level = getattr(user, "clearanceLevel", "Level 1 // Operative")
                if current_level != new_level:
                    user = await db.user.update(
                        where={"id": user.id},
                        data={"clearanceLevel": new_level}
                    )
                    logger.info(f"User {user.email} promoted to {new_level}")
            except Exception as e:
                # If the column doesn't exist yet, just log and continue with default
                logger.warning(f"Could not update clearance level (column might be missing): {repr(e)}")
                if not hasattr(user, "clearanceLevel"):
                    setattr(user, "clearanceLevel", "Level 1 // Operative")

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
