"""
Serviço de IA para análise de condições de praia
Usa Groq API (gratuito) ou fallback baseado em regras
"""
import httpx
import json
import logging
from typing import Dict, Optional, List, Tuple

from app.config.settings import settings

logger = logging.getLogger(__name__)


class AIService:
    """
    Serviço para gerar análises inteligentes das condições de praia
    
    Usa Groq API (gratuita) quando disponível, ou algoritmo baseado em regras
    como fallback
    """
    
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.api_url = settings.GROQ_API_URL
        self.model = settings.GROQ_MODEL
        self.enabled = settings.GROQ_ENABLED and bool(self.api_key)
    
    async def generate_beach_review(
        self,
        beach_name: str,
        conditions: Dict
    ) -> Dict:
        """
        Gera avaliação completa das condições da praia
        
        Args:
            beach_name: Nome da praia
            conditions: Dicionário com dados de ondas, vento e clima
            
        Returns:
            Dict com ratings e review
        """
        # Primeiro calcular ratings básicos
        ratings = self._calculate_ratings(conditions)
        
        # Tentar gerar review com IA
        if self.enabled:
            ai_review = await self._generate_ai_review(beach_name, conditions, ratings)
        else:
            ai_review = self._generate_rule_based_review(beach_name, conditions, ratings)
        
        return {
            "surf_rating": ratings["surf"],
            "swim_rating": ratings["swim"],
            "fishing_rating": ratings["fishing"],
            "overall_rating": ratings["overall"],
            "ai_review": ai_review
        }
    
    def _calculate_ratings(self, conditions: Dict) -> Dict[str, int]:
        """
        Calcula notas baseadas em regras para cada atividade
        Retorna notas de 0 a 10
        """
        wave_height = conditions.get("wave_height", 0)
        wind_speed = conditions.get("wind_speed", 0)
        weather_code = conditions.get("weather_code", 0)
        visibility = conditions.get("visibility", 10)
        precipitation = conditions.get("precipitation", 0)
        
        # Rating para SURF
        surf_rating = self._calculate_surf_rating(
            wave_height, wind_speed, weather_code, visibility
        )
        
        # Rating para BANHO
        swim_rating = self._calculate_swim_rating(
            wave_height, wind_speed, weather_code, precipitation
        )
        
        # Rating para PESCA
        fishing_rating = self._calculate_fishing_rating(
            wind_speed, weather_code, visibility
        )
        
        # Rating geral (média ponderada)
        overall = (surf_rating * 0.4 + swim_rating * 0.4 + fishing_rating * 0.2)
        
        return {
            "surf": surf_rating,
            "swim": swim_rating,
            "fishing": fishing_rating,
            "overall": round(overall, 1)
        }
    
    def _calculate_surf_rating(
        self,
        wave_height: float,
        wind_speed: float,
        weather_code: int,
        visibility: float
    ) -> int:
        """Calcula nota para surf (0-10)"""
        rating = 5  # Começa com nota média
        
        # Altura das ondas (fator mais importante)
        if 0.8 <= wave_height <= 2.5:
            rating += 3  # Ondas ideais
        elif 0.5 <= wave_height < 0.8 or 2.5 < wave_height <= 3.0:
            rating += 1  # Ondas razoáveis
        elif wave_height > 3.5:
            rating -= 2  # Ondas muito grandes (perigoso)
        elif wave_height < 0.3:
            rating -= 3  # Ondas muito pequenas (flat)
        
        # Vento (offshore é melhor para surf)
        if wind_speed < 10:
            rating += 2  # Vento fraco (bom)
        elif wind_speed < 20:
            rating += 0  # Vento moderado
        else:
            rating -= 2  # Vento forte (ruim)
        
        # Clima
        if weather_code in [0, 1, 2]:  # Céu limpo/parcialmente nublado
            rating += 1
        elif weather_code >= 61:  # Chuva
            rating -= 1
        
        return max(0, min(10, rating))
    
    def _calculate_swim_rating(
        self,
        wave_height: float,
        wind_speed: float,
        weather_code: int,
        precipitation: float
    ) -> int:
        """Calcula nota para banho (0-10)"""
        rating = 5
        
        # Altura das ondas (para banho, ondas menores são melhores)
        if wave_height < 0.5:
            rating += 3  # Mar calmo (ideal)
        elif 0.5 <= wave_height < 1.0:
            rating += 1  # Ondas pequenas (bom)
        elif 1.0 <= wave_height < 1.5:
            rating += 0  # Ondas moderadas
        elif 1.5 <= wave_height < 2.0:
            rating -= 2  # Ondas grandes (cuidado)
        else:
            rating -= 4  # Ondas muito grandes (perigoso)
        
        # Vento
        if wind_speed < 15:
            rating += 2  # Vento fraco
        elif wind_speed < 25:
            rating += 0  # Vento moderado
        else:
            rating -= 2  # Vento forte
        
        # Clima
        if weather_code in [0, 1, 2]:  # Bom tempo
            rating += 2
        elif weather_code == 3:  # Nublado
            rating += 0
        elif weather_code >= 61:  # Chuva
            rating -= 3
        
        # Precipitação
        if precipitation > 5:
            rating -= 2
        
        return max(0, min(10, rating))
    
    def _calculate_fishing_rating(
        self,
        wind_speed: float,
        weather_code: int,
        visibility: float
    ) -> int:
        """Calcula nota para pesca (0-10)"""
        rating = 5
        
        # Vento (vento moderado pode ser bom para pesca)
        if 5 <= wind_speed <= 20:
            rating += 2  # Bom para pesca
        elif wind_speed < 5:
            rating += 1  # Muito calmo
        else:
            rating -= 2  # Vento muito forte
        
        # Clima (nublado pode ser bom, chuva forte é ruim)
        if weather_code in [2, 3]:  # Nublado
            rating += 1  # Bom para pesca
        elif weather_code >= 65:  # Chuva forte/tempestade
            rating -= 3
        elif weather_code in [51, 53, 61, 63]:  # Chuva leve
            rating += 0  # Neutro
        
        # Visibilidade
        if visibility < 2:
            rating -= 2
        
        return max(0, min(10, rating))
    
    async def _generate_ai_review(
        self,
        beach_name: str,
        conditions: Dict,
        ratings: Dict
    ) -> Dict:
        """Gera review usando Groq API"""
        try:
            prompt = self._build_prompt(beach_name, conditions, ratings)
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.api_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "Você é um especialista em condições de praia, surf, meteorologia marinha e pesca. Forneça análises precisas e práticas em português do Brasil."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 400,
                        "response_format": {"type": "json_object"}
                    },
                    timeout=15.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    ai_data = json.loads(content)
                    
                    return {
                        "review_pt": ai_data.get("review", ""),
                        "recommendations": ai_data.get("recommendations", []),
                        "warnings": ai_data.get("warnings", []),
                        "best_time": ai_data.get("best_time", None)
                    }
                else:
                    logger.warning(f"Groq API retornou erro: {response.status_code}")
                    return self._generate_rule_based_review(beach_name, conditions, ratings)
                    
        except Exception as e:
            logger.error(f"Erro ao chamar Groq API: {e}")
            return self._generate_rule_based_review(beach_name, conditions, ratings)
    
    def _build_prompt(self, beach_name: str, conditions: Dict, ratings: Dict) -> str:
        """Constrói prompt para a IA"""
        return f"""
Analise as condições da praia {beach_name}:

CONDIÇÕES ATUAIS:
- Ondas: {conditions.get('wave_height', 0):.1f}m, período {conditions.get('wave_period', 0):.0f}s
- Vento: {conditions.get('wind_speed', 0):.0f} km/h, direção {conditions.get('wind_direction', 'N/A')}
- Temperatura: {conditions.get('temperature', 0):.0f}°C
- Clima: {conditions.get('weather_condition', 'Desconhecido')}
- Visibilidade: {conditions.get('visibility', 0):.0f} km

RATINGS CALCULADOS:
- Surf: {ratings['surf']}/10
- Banho: {ratings['swim']}/10
- Pesca: {ratings['fishing']}/10

Forneça uma análise em formato JSON com:
{{
  "review": "Um parágrafo curto (2-3 frases) descrevendo as condições gerais",
  "recommendations": ["dica 1", "dica 2"],
  "warnings": ["aviso importante se houver"],
  "best_time": "manhã/tarde/noite ou null"
}}

Seja objetivo e prático. Use linguagem acessível.
"""
    
    def _generate_rule_based_review(
        self,
        beach_name: str,
        conditions: Dict,
        ratings: Dict
    ) -> Dict:
        """Gera review baseado em regras quando IA não está disponível"""
        wave_height = conditions.get("wave_height", 0)
        wind_speed = conditions.get("wind_speed", 0)
        weather_condition = conditions.get("weather_condition", "")
        
        # Gerar review textual
        review_parts = []
        
        # Análise de ondas
        if wave_height < 0.5:
            review_parts.append(f"Mar calmo com ondas de {wave_height:.1f}m")
        elif wave_height < 1.5:
            review_parts.append(f"Ondas moderadas de {wave_height:.1f}m")
        else:
            review_parts.append(f"Mar agitado com ondas de {wave_height:.1f}m")
        
        # Análise de vento
        if wind_speed < 15:
            review_parts.append(f"vento fraco ({wind_speed:.0f} km/h)")
        elif wind_speed < 30:
            review_parts.append(f"vento moderado ({wind_speed:.0f} km/h)")
        else:
            review_parts.append(f"vento forte ({wind_speed:.0f} km/h)")
        
        review = f"{beach_name}: {', '.join(review_parts)}. Clima: {weather_condition.lower()}."
        
        # Recomendações
        recommendations = []
        if ratings["surf"] >= 7:
            recommendations.append("Boas condições para surf")
        if ratings["swim"] >= 7:
            recommendations.append("Ideal para banho")
        if ratings["fishing"] >= 7:
            recommendations.append("Favorável para pesca")
        
        # Avisos
        warnings = []
        if wave_height > 2.0:
            warnings.append("Ondas altas - cuidado ao entrar na água")
        if wind_speed > 30:
            warnings.append("Vento forte - atenção redobrada")
        if conditions.get("weather_code", 0) >= 95:
            warnings.append("Alerta de tempestade - evite a praia")
        
        return {
            "review_pt": review,
            "recommendations": recommendations if recommendations else ["Condições regulares"],
            "warnings": warnings,
            "best_time": "manhã" if ratings["overall"] >= 6 else None
        }
