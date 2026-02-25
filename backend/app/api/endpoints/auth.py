from fastapi import APIRouter, Depends, status
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate):
    return await AuthService.create_user(user_in)

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin):
    return await AuthService.authenticate_user(user_in)
