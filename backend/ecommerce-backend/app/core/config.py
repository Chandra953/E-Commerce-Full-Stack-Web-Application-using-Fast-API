from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 90
    JWT_SECRET_KEY: str = "supersecretkey"

    class Config:
        env_file = ".env"

settings = Settings()