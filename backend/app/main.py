"""
SwellWise API - Backend Principal
Sistema de análise de condições de praias do Brasil

Fornece:
- Condições em tempo real de praias (ondas, vento, clima)
- Ratings para surf, banho e pesca
- Análises e recomendações geradas por IA
- Previsões estendidas

Desenvolvido com FastAPI + OpenMeteo + Groq AI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config.settings import settings
from app.api.routes import health, beaches, conditions

# Configurar logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Criar aplicação FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rotas
app.include_router(health.router)
app.include_router(beaches.router, prefix="/api/v1")
app.include_router(conditions.router, prefix="/api/v1")


@app.get("/")
async def root():
    """
    Endpoint raiz - Informações sobre a API
    """
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": "API para condições de praias do Brasil",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "beaches": "/api/v1/beaches",
            "conditions": "/api/v1/conditions/{beach_id}"
        },
        "status": "online"
    }


@app.on_event("startup")
async def startup_event():
    """Executado ao iniciar a aplicação"""
    logger.info(f"🌊 {settings.APP_NAME} v{settings.APP_VERSION} iniciando...")
    logger.info(f"Documentação disponível em: http://localhost:8000/docs")
    logger.info(f"IA habilitada: {settings.GROQ_ENABLED}")


@app.on_event("shutdown")
async def shutdown_event():
    """Executado ao encerrar a aplicação"""
    logger.info(f"🌊 {settings.APP_NAME} encerrando...")


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handler global para exceções não tratadas"""
    logger.error(f"Erro não tratado: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Erro interno do servidor",
            "error": str(exc) if settings.DEBUG else "Internal Server Error"
        }
    )