from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings
from app.db.prisma import db
from app.schemas.user import UserResponse
import json
import base64
import logging

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

async def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    """
    Get current user from JWT token in either:
    1. Authorization: Bearer <token> header
    2. next-auth.jwt cookie (set by NextAuth)
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Try Authorization header first
    if token:
        token_str = token
    else:
        # Try to get from NextAuth JWT cookie
        token_str = request.cookies.get("next-auth.jwt")
        
        if not token_str:
            logger.warning("No token found in Authorization header or cookies")
            raise credentials_exception
    
    try:
        # Decode JWT token
        payload = jwt.decode(token_str, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            logger.warning(f"Token missing 'sub' claim")
            raise credentials_exception
            
    except JWTError as e:
        logger.warning(f"JWT decode error: {str(e)}")
        raise credentials_exception
    
    # Ensure database connection
    if not db.is_connected():
        await db.connect()
    
    # Fetch user from database
    user = await db.user.find_unique(where={"id": user_id})
    if user is None:
        logger.warning(f"User not found: {user_id}")
        raise credentials_exception
    
    return user
