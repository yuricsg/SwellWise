"""
Configurações da aplicação SwellWise
Gerencia variáveis de ambiente e configurações do sistema
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # App
    APP_NAME: str = "SwellWise API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "API para condições de praias do Brasil - Surf, Banho e Pesca"
    DEBUG: bool = True
    
    # CORS - Origens permitidas
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    
    # Open-Meteo API (GRATUITO - sem necessidade de API key!)
    OPEN_METEO_MARINE_URL: str = "https://marine-api.open-meteo.com/v1/marine"
    OPEN_METEO_WEATHER_URL: str = "https://api.open-meteo.com/v1/forecast"
    OPEN_METEO_TIMEOUT: int = 15  # segundos
    
    # Groq AI Service (Gratuito e rápido)
    # Registre-se em: https://console.groq.com/
    GROQ_API_KEY: str = ""
    GROQ_API_URL: str = "https://api.groq.com/openai/v1/chat/completions"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_ENABLED: bool = True  # Desabilitar se não tiver API key
    
    # PostgreSQL Database
    # Desenvolvimento: postgresql://usuario:senha@localhost:5432/swellwise
    # Docker: postgresql://swellwise:swellwise123@postgres:5432/swellwise
    POSTGRES_USER: str = "swellwise"
    POSTGRES_PASSWORD: str = "swellwise123"
    POSTGRES_SERVER: str = "localhost"  # Em Docker será "postgres"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "swellwise"
    
    @property
    def DATABASE_URL(self) -> str:
        """URL síncrona do banco de dados (para Alembic)"""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """URL assíncrona do banco de dados (para FastAPI)"""
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
    """
    Retorna instância única de Settings (Singleton)
    Usa cache para evitar recarregar configurações
    """
    return Settings()


# Instância global das configurações
settings = get_settings()
