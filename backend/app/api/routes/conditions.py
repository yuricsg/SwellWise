"""
Rotas para condições de praias (ondas, maré, vento, clima)
Integra OpenMeteo e IA para fornecer análises completas
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
import logging

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
from app.api.routes.beaches import BEACHES_DATABASE

router = APIRouter(prefix="/conditions", tags=["conditions"])
logger = logging.getLogger(__name__)


@router.get("/{beach_id}", response_model=BeachCondition)
async def get_beach_conditions(beach_id: str):
    """
    Retorna as condições atuais completas de uma praia
    
    Inclui:
    - Dados de ondas (altura, período, direção)
    - Dados de vento (velocidade, direção, rajadas)
    - Dados meteorológicos (temperatura, clima, visibilidade)
    - Ratings para surf, banho e pesca (0-10)
    - Análise e recomendações geradas por IA
    
    Args:
        beach_id: ID da praia
        
    Returns:
        Condições completas da praia
    """
    # Buscar praia no banco
    beach = next((b for b in BEACHES_DATABASE if b["id"] == beach_id), None)
    
    if not beach:
        raise HTTPException(
            status_code=404,
            detail=f"Praia com ID '{beach_id}' não encontrada"
        )
    
    try:
        # Buscar dados do Open-Meteo
        logger.info(f"Buscando condições para {beach['name']}")
        meteo_service = OpenMeteoService()
        conditions_data = await meteo_service.get_complete_conditions(
            beach["latitude"],
            beach["longitude"],
            forecast_days=1  # Apenas hoje
        )
        
        if not conditions_data:
            raise HTTPException(
                status_code=503,
                detail="Erro ao buscar dados meteorológicos. Tente novamente."
            )
        
        # Gerar análise com IA
        logger.info(f"Gerando análise IA para {beach['name']}")
        ai_service = AIService()
        ai_analysis = await ai_service.generate_beach_review(
            beach["name"],
            conditions_data
        )
        
        # Montar resposta estruturada
        response = BeachCondition(
            beach_id=beach_id,
            beach_name=beach["name"],
            timestamp=datetime.now(),
            wave=WaveData(
                height=conditions_data.get("wave_height", 0),
                direction=conditions_data.get("wave_direction"),
                period=conditions_data.get("wave_period"),
                swell_height=conditions_data.get("swell_height"),
                swell_period=conditions_data.get("swell_period")
            ),
            wind=WindData(
                speed=conditions_data.get("wind_speed", 0),
                direction=conditions_data.get("wind_direction"),
                gusts=conditions_data.get("wind_gusts")
            ),
            weather=WeatherData(
                temperature=conditions_data.get("temperature", 0),
                condition=conditions_data.get("weather_condition", "Desconhecido"),
                weather_code=conditions_data.get("weather_code", 0),
                visibility=conditions_data.get("visibility"),
                precipitation=conditions_data.get("precipitation"),
                cloud_cover=conditions_data.get("cloud_cover"),
                humidity=conditions_data.get("humidity")
            ),
            ratings=ActivityRating(
                surf_rating=ai_analysis["surf_rating"],
                swim_rating=ai_analysis["swim_rating"],
                fishing_rating=ai_analysis["fishing_rating"],
                overall_rating=ai_analysis["overall_rating"]
            ),
            ai_review=AIReview(**ai_analysis["ai_review"]) if ai_analysis.get("ai_review") else None
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao processar condições: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno ao processar condições da praia: {str(e)}"
        )


@router.get("/{beach_id}/forecast")
async def get_beach_forecast(
    beach_id: str,
    days: int = Query(
        default=7,
        ge=1,
        le=16,
        description="Número de dias de previsão (1-16)"
    )
):
    """
    Retorna previsão estendida para uma praia
    
    Fornece dados horários de:
    - Ondas
    - Vento
    - Clima
    - Temperatura
    
    Args:
        beach_id: ID da praia
        days: Número de dias de previsão (1 a 16)
        
    Returns:
        Previsão horária para os próximos N dias
    """
    # Buscar praia
    beach = next((b for b in BEACHES_DATABASE if b["id"] == beach_id), None)
    
    if not beach:
        raise HTTPException(
            status_code=404,
            detail=f"Praia com ID '{beach_id}' não encontrada"
        )
    
    try:
        # Buscar previsão
        logger.info(f"Buscando previsão de {days} dias para {beach['name']}")
        meteo_service = OpenMeteoService()
        forecast_data = await meteo_service.get_complete_conditions(
            beach["latitude"],
            beach["longitude"],
            forecast_days=days
        )
        
        if not forecast_data:
            raise HTTPException(
                status_code=503,
                detail="Erro ao buscar previsão. Tente novamente."
            )
        
        # Processar dados de previsão
        marine_hourly = forecast_data.get("forecast_data", {}).get("marine", {})
        weather_hourly = forecast_data.get("forecast_data", {}).get("weather", {})
        
        times = marine_hourly.get("time", [])
        
        # Construir previsão horária
        hourly_forecast = []
        for i, time in enumerate(times):
            try:
                hourly_forecast.append({
                    "time": time.isoformat() if hasattr(time, 'isoformat') else str(time),
                    "wave_height": marine_hourly.get("wave_height", [])[i] if i < len(marine_hourly.get("wave_height", [])) else None,
                    "wave_period": marine_hourly.get("wave_period", [])[i] if i < len(marine_hourly.get("wave_period", [])) else None,
                    "wind_speed": weather_hourly.get("wind_speed_10m", [])[i] if i < len(weather_hourly.get("wind_speed_10m", [])) else None,
                    "wind_direction": weather_hourly.get("wind_direction_10m", [])[i] if i < len(weather_hourly.get("wind_direction_10m", [])) else None,
                    "temperature": weather_hourly.get("temperature_2m", [])[i] if i < len(weather_hourly.get("temperature_2m", [])) else None,
                    "weather_code": int(weather_hourly.get("weather_code", [])[i]) if i < len(weather_hourly.get("weather_code", [])) else None,
                    "precipitation": weather_hourly.get("precipitation", [])[i] if i < len(weather_hourly.get("precipitation", [])) else None,
                })
            except (IndexError, TypeError) as e:
                logger.warning(f"Erro ao processar índice {i}: {e}")
                continue
        
        return {
            "beach_id": beach_id,
            "beach_name": beach["name"],
            "generated_at": datetime.now().isoformat(),
            "forecast_days": days,
            "total_hours": len(hourly_forecast),
            "hourly_forecast": hourly_forecast
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar previsão: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno ao buscar previsão: {str(e)}"
        )


@router.get("/{beach_id}/summary")
async def get_beach_summary(beach_id: str):
    """
    Retorna um resumo rápido das condições atuais
    Endpoint otimizado para resposta rápida
    
    Args:
        beach_id: ID da praia
        
    Returns:
        Resumo das condições
    """
    beach = next((b for b in BEACHES_DATABASE if b["id"] == beach_id), None)
    
    if not beach:
        raise HTTPException(
            status_code=404,
            detail=f"Praia com ID '{beach_id}' não encontrada"
        )
    
    try:
        meteo_service = OpenMeteoService()
        conditions = await meteo_service.get_complete_conditions(
            beach["latitude"],
            beach["longitude"],
            forecast_days=1
        )
        
        if not conditions:
            raise HTTPException(status_code=503, detail="Erro ao buscar dados")
        
        # Calcular rating rápido
        ai_service = AIService()
        ratings = ai_service._calculate_ratings(conditions)
        
        return {
            "beach_id": beach_id,
            "beach_name": beach["name"],
            "wave_height": conditions.get("wave_height", 0),
            "wind_speed": conditions.get("wind_speed", 0),
            "temperature": conditions.get("temperature", 0),
            "weather": conditions.get("weather_condition", ""),
            "surf_rating": ratings["surf"],
            "swim_rating": ratings["swim"],
            "overall_rating": ratings["overall"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao gerar resumo: {e}")
        raise HTTPException(status_code=500, detail=str(e))
