"""
Rota de health check
"""
from fastapi import APIRouter
from app.config.settings import settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """
    Health check endpoint
    Verifica se a API está funcionando
    """
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }
