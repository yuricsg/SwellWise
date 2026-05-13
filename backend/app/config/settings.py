"""
Configurações da aplicação SwellWise
Gerencia variáveis de ambiente e configurações do sistema
"""
from pydantic_settings import BaseSettings
from pydantic import validator
from functools import lru_cache
from typing import List
import json


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # App
    APP_NAME: str = "SwellWise API 🌊"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "API para condições de praias do Brasil - Surf, Banho e Pesca"
    DEBUG: bool = True
    
    # CORS - Origens permitidas
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "https://swellwise.vercel.app",
    ]

    # CORS - Regex para origens dinâmicas (ex: previews do Vercel)
    ALLOWED_ORIGIN_REGEX: str = r"https://swell-wise.*\.vercel\.app"

    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_origins(cls, v):
        """Aceita lista Python ou string JSON (para variáveis de ambiente)"""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [origin.strip() for origin in v.split(",")]
        return v
    
    OPEN_METEO_MARINE_URL: str = "https://marine-api.open-meteo.com/v1/marine"
    OPEN_METEO_WEATHER_URL: str = "https://api.open-meteo.com/v1/forecast"
    OPEN_METEO_TIMEOUT: int = 15  # segundos
    
    GROQ_API_KEY: str = ""
    GROQ_API_URL: str = "https://api.groq.com/openai/v1/chat/completions"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_ENABLED: bool = True 
    
    DATABASE_URL_OVERRIDE: str = ""
    POSTGRES_USER: str = "swellwise"
    POSTGRES_PASSWORD: str = "swellwise123"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "swellwise"
    
    @property
    def DATABASE_URL(self) -> str:
        if self.DATABASE_URL_OVERRIDE:
            return self.DATABASE_URL_OVERRIDE
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        if self.DATABASE_URL_OVERRIDE:
            url = self.DATABASE_URL_OVERRIDE
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            # asyncpg usa ssl=true, não sslmode=require
            url = url.replace("sslmode=require", "ssl=true")
            url = url.replace("&channel_binding=require", "")
            return url
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
   
    # Cache
    CACHE_ENABLED: bool = True
    CACHE_TTL: int = 1800  # 30 minutos em segundos
    
    # Limites de API
    FORECAST_MAX_DAYS: int = 16
    FORECAST_DEFAULT_DAYS: int = 7
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
