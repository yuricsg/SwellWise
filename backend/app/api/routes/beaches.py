"""
Rotas para gerenciamento de praias
Integra com PostgreSQL via SQLAlchemy
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional
import logging

from app.core.database import get_async_db
from app.models.beach import Beach
from app.schemas.beach import BeachResponse, BeachList

router = APIRouter(prefix="/beaches", tags=["beaches"])
logger = logging.getLogger(__name__)


def _beach_to_response(beach: Beach) -> BeachResponse:
    """Converte modelo SQLAlchemy para schema de resposta com tags derivadas"""
    tags = []
    if beach.has_surf_schools:
        tags.append("surf")
    if beach.has_restaurants:
        tags.append("restaurantes")
    if beach.has_parking:
        tags.append("estacionamento")
    if beach.has_infrastructure:
        tags.append("infra completa")
    if beach.surf_quality in ("excellent", "good"):
        tags.append("ondas perfeitas")
    if beach.best_season:
        tags.append(f"melhor época: {beach.best_season}")

    return BeachResponse(
        id=beach.id,
        name=beach.name,
        city=beach.city,
        state=beach.state,
        latitude=beach.latitude,
        longitude=beach.longitude,
        description=beach.description,
        slug=beach.slug,
        region=beach.region,
        surf_quality=beach.surf_quality,
        best_season=beach.best_season,
        tags=tags,
        warning=beach.warning,
        created_at=beach.created_at,
    )


@router.get("/", response_model=BeachList)
async def list_beaches(
    state: Optional[str] = Query(None, description="Filtrar por estado (UF)", max_length=2),
    city: Optional[str] = Query(None, description="Filtrar por cidade"),
    search: Optional[str] = Query(None, description="Buscar por nome da praia"),
    limit: int = Query(6, ge=1, le=50, description="Número de praias por página"),
    offset: int = Query(0, ge=0, description="Número de praias para pular"),
    db: AsyncSession = Depends(get_async_db),
):
    try:
        query = select(Beach).where(Beach.is_active == True)

        if state:
            query = query.where(Beach.state == state.upper())

        if city:
            query = query.where(Beach.city.ilike(f"%{city}%"))

        if search:
            query = query.where(
                or_(
                    Beach.name.ilike(f"%{search}%"),
                    Beach.city.ilike(f"%{search}%"),
                )
            )

        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0

        query = query.order_by(Beach.name).limit(limit).offset(offset)
        result = await db.execute(query)
        beaches = result.scalars().all()

        beach_list = [_beach_to_response(b) for b in beaches]

        return BeachList(
            total=total,
            limit=limit,
            offset=offset,
            has_more=(offset + limit) < total,
            beaches=beach_list,
        )

    except Exception as e:
        logger.error(f"Erro ao listar praias: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Erro ao buscar praias no banco de dados"
        )


@router.get("/{beach_id}", response_model=BeachResponse)
async def get_beach(
    beach_id: str,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Retorna informações detalhadas de uma praia específica

    Args:
        beach_id: ID da praia
    """
    try:
        result = await db.execute(
            select(Beach).where(Beach.id == beach_id, Beach.is_active == True)
        )
        beach = result.scalar_one_or_none()

        if not beach:
            raise HTTPException(
                status_code=404,
                detail=f"Praia com ID '{beach_id}' não encontrada"
            )

        return _beach_to_response(beach)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar praia {beach_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Erro ao buscar praia no banco de dados"
        )


@router.get("/state/{state_uf}", response_model=BeachList)
async def get_beaches_by_state(
    state_uf: str,
    limit: int = Query(6, ge=1, le=50),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_async_db),
):
    
    return await list_beaches(
        state=state_uf,
        city=None,
        search=None,
        limit=limit,
        offset=offset,
        db=db,
    )
