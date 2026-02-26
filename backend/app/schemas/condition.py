"""
Schemas para condições de praias (maré, ondas, vento, clima)
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class WaveData(BaseModel):
    """Dados de ondas"""
    height: float = Field(..., description="Altura das ondas em metros", ge=0)
    direction: Optional[str] = Field(None, description="Direção das ondas (cardinal)")
    period: Optional[float] = Field(None, description="Período das ondas em segundos", ge=0)
    swell_height: Optional[float] = Field(None, description="Altura do swell em metros", ge=0)
    swell_period: Optional[float] = Field(None, description="Período do swell em segundos", ge=0)


class WindData(BaseModel):
    """Dados de vento"""
    speed: float = Field(..., description="Velocidade do vento em km/h", ge=0)
    direction: Optional[str] = Field(None, description="Direção do vento (cardinal)")
    gusts: Optional[float] = Field(None, description="Rajadas de vento em km/h", ge=0)


class WeatherData(BaseModel):
    """Dados meteorológicos"""
    temperature: float = Field(..., description="Temperatura em °C")
    condition: str = Field(..., description="Condição do clima")
    weather_code: int = Field(..., description="Código WMO do clima")
    visibility: Optional[float] = Field(None, description="Visibilidade em km", ge=0)
    precipitation: Optional[float] = Field(None, description="Precipitação em mm", ge=0)
    cloud_cover: Optional[int] = Field(None, description="Cobertura de nuvens em %", ge=0, le=100)
    humidity: Optional[int] = Field(None, description="Umidade relativa em %", ge=0, le=100)


class ActivityRating(BaseModel):
    """Avaliação para atividades na praia"""
    surf_rating: int = Field(..., description="Nota para surf (0-10)", ge=0, le=10)
    swim_rating: int = Field(..., description="Nota para banho (0-10)", ge=0, le=10)
    fishing_rating: int = Field(..., description="Nota para pesca (0-10)", ge=0, le=10)
    overall_rating: float = Field(..., description="Nota geral (0-10)", ge=0, le=10)


class AIReview(BaseModel):
    """Review gerado por IA"""
    review_pt: str = Field(..., description="Review em português")
    recommendations: List[str] = Field(default_factory=list, description="Recomendações")
    warnings: List[str] = Field(default_factory=list, description="Avisos importantes")
    best_time: Optional[str] = Field(None, description="Melhor horário do dia")


class BeachCondition(BaseModel):
    """Condições completas da praia"""
    beach_id: str = Field(..., description="ID da praia")
    beach_name: str = Field(..., description="Nome da praia")
    timestamp: datetime = Field(default_factory=datetime.now, description="Data/hora da consulta")
    
    # Dados principais
    wave: WaveData = Field(..., description="Dados de ondas")
    wind: WindData = Field(..., description="Dados de vento")
    weather: WeatherData = Field(..., description="Dados meteorológicos")
    
    # Avaliações
    ratings: ActivityRating = Field(..., description="Notas para atividades")
    ai_review: Optional[AIReview] = Field(None, description="Análise da IA")
    
    class Config:
        json_schema_extra = {
            "example": {
                "beach_id": "1",
                "beach_name": "Maracaípe",
                "timestamp": "2026-02-25T15:00:00",
                "wave": {
                    "height": 1.5,
                    "direction": "NE",
                    "period": 8.0,
                    "swell_height": 1.2,
                    "swell_period": 9.0
                },
                "wind": {
                    "speed": 15.0,
                    "direction": "E",
                    "gusts": 22.0
                },
                "weather": {
                    "temperature": 28.0,
                    "condition": "Parcialmente nublado",
                    "weather_code": 2,
                    "visibility": 10.0,
                    "precipitation": 0.0,
                    "cloud_cover": 40,
                    "humidity": 75
                },
                "ratings": {
                    "surf_rating": 8,
                    "swim_rating": 6,
                    "fishing_rating": 7,
                    "overall_rating": 7.0
                },
                "ai_review": {
                    "review_pt": "Excelentes condições para surf com ondas de 1.5m vindas de nordeste.",
                    "recommendations": ["Melhor período entre 8h e 12h", "Ondas ideais para iniciantes"],
                    "warnings": ["Atenção às correntes"],
                    "best_time": "manhã"
                }
            }
        }


class ForecastHour(BaseModel):
    """Previsão para uma hora específica"""
    time: datetime
    wave_height: Optional[float]
    wind_speed: Optional[float]
    temperature: Optional[float]
    weather_code: Optional[int]
    surf_rating: Optional[int]


class BeachForecast(BaseModel):
    """Previsão estendida para a praia"""
    beach_id: str
    beach_name: str
    generated_at: datetime = Field(default_factory=datetime.now)
    forecast_days: int
    hourly_forecast: List[ForecastHour]
    daily_summary: Optional[List[Dict[str, Any]]] = None
