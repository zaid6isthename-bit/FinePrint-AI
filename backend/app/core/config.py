from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinePrint AI"
    # Make these optional with defaults so the app can boot for health checks
    DATABASE_URL: Optional[str] = None
    SECRET_KEY: str = "temporary-secret-key-for-boot"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Optional flags for ML model configuration
    USE_GPU: bool = False
    LIGHTWEIGHT_ANALYSIS: bool = True

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore" # Ignore extra env vars Render might inject
    )

settings = Settings()
