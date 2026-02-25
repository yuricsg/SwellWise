"""
Serviço para buscar dados de maré, ondas e clima do Open-Meteo
API gratuita e sem necessidade de chave de API

Documentação:
- Marine API: https://open-meteo.com/en/docs/marine-weather-api
- Weather API: https://open-meteo.com/en/docs
"""
import openmeteo_requests
import requests_cache
from retry_requests import retry
from typing import Dict, Optional, List, Tuple
from datetime import datetime
import logging

from app.config.settings import settings

# Configurar logging
logger = logging.getLogger(__name__)


class OpenMeteoService:
    """
    Serviço para integração com Open-Meteo API
    Fornece dados de ondas, vento, maré e condições meteorológicas
    """
    
    def __init__(self):
        """Inicializa o serviço com cache e retry"""
        # Setup cache e retry
        cache_session = requests_cache.CachedSession('.cache', expire_after=settings.CACHE_TTL)
        retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
        self.client = openmeteo_requests.Client(session=retry_session)
        
        self.marine_url = settings.OPEN_METEO_MARINE_URL
        self.weather_url = settings.OPEN_METEO_WEATHER_URL
    
    async def get_complete_conditions(
        self, 
        latitude: float, 
        longitude: float,
        forecast_days: int = 1
    ) -> Optional[Dict]:
        """
        Busca todas as condições da praia: ondas, vento, clima
        
        Args:
            latitude: Latitude da praia
            longitude: Longitude da praia
            forecast_days: Número de dias de previsão (padrão: 1 = apenas hoje)
            
        Returns:
            Dicionário com todos os dados ou None se houver erro
        """
        try:
            # Buscar dados marinhos e meteorológicos
            marine_data = self._get_marine_data(latitude, longitude, forecast_days)
            weather_data = self._get_weather_data(latitude, longitude, forecast_days)
            
            if not marine_data or not weather_data:
                logger.error("Falha ao buscar dados do Open-Meteo")
                return None
            
            # Combinar e processar dados
            return self._combine_data(marine_data, weather_data)
            
        except Exception as e:
            logger.error(f"Erro ao buscar condições: {e}")
            return None
    
    def _get_marine_data(
        self, 
        latitude: float, 
        longitude: float,
        forecast_days: int
    ) -> Optional[Dict]:
        """
        Busca dados marinhos (ondas)
        
        Parâmetros disponíveis:
        - wave_height: Altura significativa das ondas (m)
        - wave_direction: Direção média das ondas (graus)
        - wave_period: Período médio das ondas (s)
        - wind_wave_height: Altura das ondas geradas localmente pelo vento
        - swell_wave_height: Altura do swell (ondas de longe)
        - swell_wave_direction: Direção do swell
        - swell_wave_period: Período do swell
        """
        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "hourly": [
                    "wave_height",
                    "wave_direction",
                    "wave_period",
                    "wind_wave_height",
                    "swell_wave_height",
                    "swell_wave_direction",
                    "swell_wave_period"
                ],
                "forecast_days": forecast_days,
                "timezone": "America/Sao_Paulo"
            }
            
            responses = self.client.weather_api(self.marine_url, params=params)
            
            if not responses:
                return None
            
            response = responses[0]
            hourly = response.Hourly()
            
            # Extrair dados
            data = {
                "latitude": response.Latitude(),
                "longitude": response.Longitude(),
                "timezone": response.Timezone(),
                "hourly": {
                    "time": [datetime.fromtimestamp(t) for t in range(
                        int(hourly.Time()),
                        int(hourly.TimeEnd()),
                        int(hourly.Interval())
                    )],
                    "wave_height": list(hourly.Variables(0).ValuesAsNumpy()),
                    "wave_direction": list(hourly.Variables(1).ValuesAsNumpy()),
                    "wave_period": list(hourly.Variables(2).ValuesAsNumpy()),
                    "wind_wave_height": list(hourly.Variables(3).ValuesAsNumpy()),
                    "swell_wave_height": list(hourly.Variables(4).ValuesAsNumpy()),
                    "swell_wave_direction": list(hourly.Variables(5).ValuesAsNumpy()),
                    "swell_wave_period": list(hourly.Variables(6).ValuesAsNumpy()),
                }
            }
            
            return data
            
        except Exception as e:
            logger.error(f"Erro ao buscar dados marinhos: {e}")
            return None
    
    def _get_weather_data(
        self,
        latitude: float,
        longitude: float,
        forecast_days: int
    ) -> Optional[Dict]:
        """
        Busca dados meteorológicos: vento, temperatura, clima
        
        Parâmetros:
        - temperature_2m: Temperatura a 2m de altura (°C)
        - relative_humidity_2m: Umidade relativa (%)
        - wind_speed_10m: Velocidade do vento a 10m (km/h)
        - wind_direction_10m: Direção do vento (graus)
        - wind_gusts_10m: Rajadas de vento (km/h)
        - weather_code: Código WMO do clima
        - visibility: Visibilidade (m)
        - precipitation: Precipitação (mm)
        - cloud_cover: Cobertura de nuvens (%)
        """
        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "wind_speed_10m",
                    "wind_direction_10m",
                    "weather_code"
                ],
                "hourly": [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "wind_speed_10m",
                    "wind_direction_10m",
                    "wind_gusts_10m",
                    "weather_code",
                    "visibility",
                    "precipitation",
                    "cloud_cover"
                ],
                "forecast_days": forecast_days,
                "timezone": "America/Sao_Paulo"
            }
            
            responses = self.client.weather_api(self.weather_url, params=params)
            
            if not responses:
                return None
            
            response = responses[0]
            current = response.Current()
            hourly = response.Hourly()
            
            # Extrair dados atuais
            current_data = {
                "temperature_2m": current.Variables(0).Value(),
                "relative_humidity_2m": current.Variables(1).Value(),
                "wind_speed_10m": current.Variables(2).Value(),
                "wind_direction_10m": current.Variables(3).Value(),
                "weather_code": int(current.Variables(4).Value()),
            }
            
            # Extrair dados horários
            hourly_data = {
                "time": [datetime.fromtimestamp(t) for t in range(
                    int(hourly.Time()),
                    int(hourly.TimeEnd()),
                    int(hourly.Interval())
                )],
                "temperature_2m": list(hourly.Variables(0).ValuesAsNumpy()),
                "relative_humidity_2m": list(hourly.Variables(1).ValuesAsNumpy()),
                "wind_speed_10m": list(hourly.Variables(2).ValuesAsNumpy()),
                "wind_direction_10m": list(hourly.Variables(3).ValuesAsNumpy()),
                "wind_gusts_10m": list(hourly.Variables(4).ValuesAsNumpy()),
                "weather_code": list(hourly.Variables(5).ValuesAsNumpy()),
                "visibility": list(hourly.Variables(6).ValuesAsNumpy()),
                "precipitation": list(hourly.Variables(7).ValuesAsNumpy()),
                "cloud_cover": list(hourly.Variables(8).ValuesAsNumpy()),
            }
            
            return {
                "current": current_data,
                "hourly": hourly_data
            }
            
        except Exception as e:
            logger.error(f"Erro ao buscar dados meteorológicos: {e}")
            return None
    
    def _combine_data(self, marine_data: Dict, weather_data: Dict) -> Dict:
        """
        Combina dados marinhos e meteorológicos
        Retorna dados atuais (primeira hora) + dados completos para previsão
        """
        try:
            # Índice 0 = agora (dados atuais)
            current_index = 0
            
            # Dados de ondas atuais
            marine_hourly = marine_data.get("hourly", {})
            wave_height = self._safe_get_value(marine_hourly.get("wave_height"), current_index)
            wave_direction_deg = self._safe_get_value(marine_hourly.get("wave_direction"), current_index)
            wave_period = self._safe_get_value(marine_hourly.get("wave_period"), current_index)
            swell_height = self._safe_get_value(marine_hourly.get("swell_wave_height"), current_index)
            swell_period = self._safe_get_value(marine_hourly.get("swell_wave_period"), current_index)
            
            # Dados meteorológicos atuais
            current_weather = weather_data.get("current", {})
            temperature = current_weather.get("temperature_2m", 0)
            wind_speed = current_weather.get("wind_speed_10m", 0)
            wind_direction_deg = current_weather.get("wind_direction_10m", 0)
            weather_code = current_weather.get("weather_code", 0)
            humidity = current_weather.get("relative_humidity_2m", 0)
            
            # Dados horários para rajadas
            weather_hourly = weather_data.get("hourly", {})
            wind_gusts = self._safe_get_value(weather_hourly.get("wind_gusts_10m"), current_index)
            visibility = self._safe_get_value(weather_hourly.get("visibility"), current_index)
            precipitation = self._safe_get_value(weather_hourly.get("precipitation"), current_index)
            cloud_cover = self._safe_get_value(weather_hourly.get("cloud_cover"), current_index)
            
            # Combinar tudo
            return {
                # Ondas
                "wave_height": wave_height or 0,
                "wave_direction": self._degrees_to_cardinal(wave_direction_deg),
                "wave_period": wave_period,
                "swell_height": swell_height,
                "swell_period": swell_period,
                
                # Vento
                "wind_speed": wind_speed,
                "wind_direction": self._degrees_to_cardinal(wind_direction_deg),
                "wind_gusts": wind_gusts,
                
                # Clima
                "temperature": temperature,
                "weather_condition": self._weather_code_to_pt(weather_code),
                "weather_code": weather_code,
                "visibility": visibility / 1000 if visibility else None,  # converter m para km
                "precipitation": precipitation,
                "cloud_cover": int(cloud_cover) if cloud_cover else None,
                "humidity": int(humidity) if humidity else None,
                
                # Dados completos para previsão
                "forecast_data": {
                    "marine": marine_hourly,
                    "weather": weather_hourly,
                }
            }
            
        except Exception as e:
            logger.error(f"Erro ao combinar dados: {e}")
            return {}
    
    @staticmethod
    def _safe_get_value(data_list: Optional[List], index: int) -> Optional[float]:
        """Retorna valor de forma segura, tratando None e índices inválidos"""
        if not data_list or index >= len(data_list):
            return None
        value = data_list[index]
        # Checar se é NaN
        if value != value:  # NaN check
            return None
        return float(value)
    
    @staticmethod
    def _degrees_to_cardinal(degrees: Optional[float]) -> str:
        """Converte graus em direção cardeal (N, S, E, W, etc)"""
        if degrees is None:
            return "N/A"
        
        directions = [
            "N", "NNE", "NE", "ENE",
            "E", "ESE", "SE", "SSE",
            "S", "SSO", "SO", "OSO",
            "O", "ONO", "NO", "NNO"
        ]
        
        index = round(degrees / 22.5) % 16
        return directions[index]
    
    @staticmethod
    def _weather_code_to_pt(code: Optional[int]) -> str:
        """
        Converte código WMO para descrição em português
        Códigos: https://open-meteo.com/en/docs
        """
        if code is None:
            return "Desconhecido"
        
        weather_codes = {
            0: "Céu limpo",
            1: "Principalmente limpo",
            2: "Parcialmente nublado",
            3: "Nublado",
            45: "Nevoeiro",
            48: "Nevoeiro com geada",
            51: "Garoa leve",
            53: "Garoa moderada",
            55: "Garoa intensa",
            61: "Chuva leve",
            63: "Chuva moderada",
            65: "Chuva forte",
            71: "Neve leve",
            73: "Neve moderada",
            75: "Neve intensa",
            77: "Granizo",
            80: "Pancadas de chuva leves",
            81: "Pancadas de chuva moderadas",
            82: "Pancadas de chuva fortes",
            85: "Pancadas de neve leves",
            86: "Pancadas de neve fortes",
            95: "Trovoada",
            96: "Trovoada com granizo leve",
            99: "Trovoada com granizo forte"
        }
        
        return weather_codes.get(int(code), "Indefinido")
