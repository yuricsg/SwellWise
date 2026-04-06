"""
Rotas para condições de praias (ondas, maré, vento, clima)
Integra OpenMeteo e IA para fornecer análises completas
Cache em memória de 30 minutos para Open-Meteo
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import logging
import time
from typing import Tuple, Dict, Optional

from app.core.database import get_async_db
from app.models.beach import Beach
from app.services.open_meteo_service import OpenMeteoService
from app.services.ai_service import AIService
from app.schemas.condition import (
    BeachCondition,
    WaveData,
    WindData,
    WeatherData,
    ActivityRating,
    AIReview
)

router = APIRouter(prefix="/conditions", tags=["conditions"])
logger = logging.getLogger(__name__)

_meteo_cache: Dict[str, Tuple[Dict, float]] = {}
METEO_CACHE_TTL = 1800


async def _get_beach_or_404(beach_id: str, db: AsyncSession) -> Beach:
    result = await db.execute(
        select(Beach).where(Beach.id == beach_id, Beach.is_active == True)
    )
    beach = result.scalar_one_or_none()
    if not beach:
        raise HTTPException(
            status_code=404,
            detail=f"Praia com ID '{beach_id}' não encontrada"
        )
    return beach


async def _get_cached_conditions(beach_id: str, lat: float, lon: float) -> Optional[Dict]:
    now = time.time()

    if beach_id in _meteo_cache:
        cached_data, cached_at = _meteo_cache[beach_id]
        if now - cached_at < METEO_CACHE_TTL:
            logger.info(f"Cache hit Open-Meteo para beach_id={beach_id}")
            return cached_data

    try:
        meteo_service = OpenMeteoService()
        conditions_data = await meteo_service.get_complete_conditions(lat, lon, forecast_days=1)

        if conditions_data:
            _meteo_cache[beach_id] = (conditions_data, now)

            expired = [k for k, (_, ts) in _meteo_cache.items() if now - ts > METEO_CACHE_TTL]
            for k in expired:
                del _meteo_cache[k]

        return conditions_data
    except Exception as e:
        logger.error(f"Erro ao buscar Open-Meteo para beach_id={beach_id}: {e}")
        return None


@router.get("/{beach_id}", response_model=BeachCondition)
async def get_beach_conditions(
    beach_id: str,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Retorna condições completas de uma praia: dados marinhos, meteorológicos e análise IA.

    - Dados de praia: vindos do banco PostgreSQL
    - Condições ambientais: Open-Meteo (cache 30min)
    - Análise IA: Groq (cache 30min)

    Em caso de falha da Open-Meteo, retorna erro 503 informativo.
    """
    beach = await _get_beach_or_404(beach_id, db)

    logger.info(f"Buscando condições para '{beach.name}' (lat={beach.latitude}, lon={beach.longitude})")

    conditions_data = await _get_cached_conditions(beach_id, beach.latitude, beach.longitude)

    if not conditions_data:
        raise HTTPException(
            status_code=503,
            detail="Dados ambientais temporariamente indisponíveis. Tente novamente em instantes."
        )

    try:
        logger.info(f"Gerando análise IA para '{beach.name}'")
        ai_service = AIService()
        ai_analysis = await ai_service.generate_beach_review(beach.name, conditions_data)
    except Exception as e:
        logger.error(f"Erro ao gerar análise IA: {e}")
        ai_analysis = {
            "surf_rating": 5,
            "swim_rating": 5,
            "fishing_rating": 5,
            "overall_rating": 5.0,
            "ai_review": None
        }

    ai_review_data = ai_analysis.get("ai_review")
    response = BeachCondition(
        beach_id=beach_id,
        beach_name=beach.name,
        timestamp=datetime.now(),
        wave=WaveData(
            height=conditions_data.get("wave_height", 0),
            direction=conditions_data.get("wave_direction"),
            period=conditions_data.get("wave_period"),
            swell_height=conditions_data.get("swell_height"),
            swell_period=conditions_data.get("swell_period"),
        ),
        wind=WindData(
            speed=conditions_data.get("wind_speed", 0),
            direction=conditions_data.get("wind_direction"),
            gusts=conditions_data.get("wind_gusts"),
        ),
        weather=WeatherData(
            temperature=conditions_data.get("temperature", 0),
            condition=conditions_data.get("weather_condition", "Desconhecido"),
            weather_code=conditions_data.get("weather_code", 0),
            visibility=conditions_data.get("visibility"),
            precipitation=conditions_data.get("precipitation"),
            cloud_cover=conditions_data.get("cloud_cover"),
            humidity=conditions_data.get("humidity"),
        ),
        ratings=ActivityRating(
            surf_rating=ai_analysis["surf_rating"],
            swim_rating=ai_analysis["swim_rating"],
            fishing_rating=ai_analysis["fishing_rating"],
            overall_rating=ai_analysis["overall_rating"],
        ),
        ai_review=AIReview(**ai_review_data) if ai_review_data else None,
    )

    return response


@router.get("/{beach_id}/forecast")
async def get_beach_forecast(
    beach_id: str,
    days: int = Query(default=7, ge=1, le=16, description="Número de dias de previsão (1-16)"),
    db: AsyncSession = Depends(get_async_db),
):
    
    beach = await _get_beach_or_404(beach_id, db)

    try:
        logger.info(f"Buscando previsão de {days} dias para '{beach.name}'")
        meteo_service = OpenMeteoService()
        forecast_data = await meteo_service.get_complete_conditions(
            beach.latitude, beach.longitude, forecast_days=days
        )

        if not forecast_data:
            raise HTTPException(
                status_code=503,
                detail="Dados ambientais temporariamente indisponíveis."
            )

        marine_hourly = forecast_data.get("forecast_data", {}).get("marine", {})
        weather_hourly = forecast_data.get("forecast_data", {}).get("weather", {})
        times = marine_hourly.get("time", [])

        hourly_forecast = []
        for i, t in enumerate(times):
            try:
                hourly_forecast.append({
                    "time": t.isoformat() if hasattr(t, 'isoformat') else str(t),
                    "wave_height": _safe_list_get(marine_hourly.get("wave_height"), i),
                    "wave_period": _safe_list_get(marine_hourly.get("wave_period"), i),
                    "wind_speed": _safe_list_get(weather_hourly.get("wind_speed_10m"), i),
                    "wind_direction": _safe_list_get(weather_hourly.get("wind_direction_10m"), i),
                    "temperature": _safe_list_get(weather_hourly.get("temperature_2m"), i),
                    "weather_code": int(_safe_list_get(weather_hourly.get("weather_code"), i) or 0),
                    "precipitation": _safe_list_get(weather_hourly.get("precipitation"), i),
                })
            except Exception as e:
                logger.warning(f"Erro ao processar hora {i}: {e}")
                continue

        return {
            "beach_id": beach_id,
            "beach_name": beach.name,
            "generated_at": datetime.now().isoformat(),
            "forecast_days": days,
            "total_hours": len(hourly_forecast),
            "hourly_forecast": hourly_forecast,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro na previsão para beach_id={beach_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


def _safe_list_get(lst, index):
    if not lst or index >= len(lst):
        return None
    val = lst[index]
    if val != val:
        return None
    return val
