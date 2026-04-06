"""
Serviço de IA para análise de condições de praia
Usa Groq API (gratuito) ou fallback baseado em regras
Cache em memória de 30 minutos para economizar tokens
"""
import httpx
import json
import logging
import time
from typing import Dict, Optional, Tuple
from hashlib import md5

from app.config.settings import settings

logger = logging.getLogger(__name__)

_ai_cache: Dict[str, Tuple[Dict, float]] = {}
CACHE_TTL = 1800


def _make_cache_key(beach_name: str, conditions: Dict) -> str:
    """Gera chave de cache baseada nos dados principais (arredondados)"""
    wave = round(conditions.get("wave_height", 0), 1)
    wind = round(conditions.get("wind_speed", 0), 0)
    temp = round(conditions.get("temperature", 0), 0)
    wcode = conditions.get("weather_code", 0)
    raw = f"{beach_name}|{wave}|{wind}|{temp}|{wcode}"
    return md5(raw.encode()).hexdigest()


class AIService:
    
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
        Gera avaliação completa das condições da praia.
        Usa cache de 30min para evitar chamadas repetidas à Groq.
        """
        cache_key = _make_cache_key(beach_name, conditions)

        if cache_key in _ai_cache:
            cached_result, cached_at = _ai_cache[cache_key]
            if time.time() - cached_at < CACHE_TTL:
                logger.info(f"Cache hit para '{beach_name}' (AI)")
                return cached_result

        ratings = self._calculate_ratings(conditions)

        if self.enabled:
            ai_review = await self._generate_ai_review(beach_name, conditions, ratings)
        else:
            ai_review = self._generate_rule_based_review(beach_name, conditions, ratings)

        result = {
            "surf_rating": ratings["surf"],
            "swim_rating": ratings["swim"],
            "fishing_rating": ratings["fishing"],
            "overall_rating": ratings["overall"],
            "ai_review": ai_review
        }

        _ai_cache[cache_key] = (result, time.time())

        now = time.time()
        expired = [k for k, (_, ts) in _ai_cache.items() if now - ts > CACHE_TTL]
        for k in expired:
            del _ai_cache[k]

        return result

    def _calculate_ratings(self, conditions: Dict) -> Dict[str, float]:
        """Calcula notas baseadas em regras para cada atividade (0-10)"""
        wave_height = conditions.get("wave_height", 0)
        wind_speed = conditions.get("wind_speed", 0)
        weather_code = conditions.get("weather_code", 0)
        visibility = conditions.get("visibility", 10)
        precipitation = conditions.get("precipitation", 0)

        surf_rating = self._calculate_surf_rating(wave_height, wind_speed, weather_code, visibility)
        swim_rating = self._calculate_swim_rating(wave_height, wind_speed, weather_code, precipitation)
        fishing_rating = self._calculate_fishing_rating(wind_speed, weather_code, visibility)
        overall = (surf_rating * 0.4 + swim_rating * 0.4 + fishing_rating * 0.2)

        return {
            "surf": surf_rating,
            "swim": swim_rating,
            "fishing": fishing_rating,
            "overall": round(overall, 1)
        }

    def _calculate_surf_rating(self, wave_height: float, wind_speed: float,
                                weather_code: int, visibility: float) -> int:
        rating = 5
        if 0.8 <= wave_height <= 2.5:
            rating += 3
        elif 0.5 <= wave_height < 0.8 or 2.5 < wave_height <= 3.0:
            rating += 1
        elif wave_height > 3.5:
            rating -= 2
        elif wave_height < 0.3:
            rating -= 3

        if wind_speed < 10:
            rating += 2
        elif wind_speed >= 20:
            rating -= 2

        if weather_code in [0, 1, 2]:
            rating += 1
        elif weather_code >= 61:
            rating -= 1

        return max(0, min(10, rating))

    def _calculate_swim_rating(self, wave_height: float, wind_speed: float,
                                weather_code: int, precipitation: float) -> int:
        rating = 5
        if wave_height < 0.5:
            rating += 3
        elif 0.5 <= wave_height < 1.0:
            rating += 1
        elif 1.5 <= wave_height < 2.0:
            rating -= 2
        elif wave_height >= 2.0:
            rating -= 4

        if wind_speed < 15:
            rating += 2
        elif wind_speed >= 25:
            rating -= 2

        if weather_code in [0, 1, 2]:
            rating += 2
        elif weather_code >= 61:
            rating -= 3

        if precipitation and precipitation > 5:
            rating -= 2

        return max(0, min(10, rating))

    def _calculate_fishing_rating(self, wind_speed: float,
                                   weather_code: int, visibility: float) -> int:
        rating = 5
        if 5 <= wind_speed <= 20:
            rating += 2
        elif wind_speed < 5:
            rating += 1
        else:
            rating -= 2

        if weather_code in [2, 3]:
            rating += 1
        elif weather_code >= 65:
            rating -= 3

        if visibility and visibility < 2:
            rating -= 2

        return max(0, min(10, rating))

    async def _generate_ai_review(self, beach_name: str, conditions: Dict, ratings: Dict) -> Dict:
        """Gera review usando Groq API com prompt curto e determinístico"""
        try:
            prompt = self._build_prompt(beach_name, conditions, ratings)

            async with httpx.AsyncClient(timeout=15.0) as client:
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
                                "content": "Você é um especialista em condições oceânicas. Responda APENAS em JSON válido, sem markdown."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.3,
                        "max_tokens": 300,
                        "response_format": {"type": "json_object"}
                    }
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
                    logger.warning(f"Groq retornou {response.status_code}: {response.text[:200]}")
                    return self._generate_rule_based_review(beach_name, conditions, ratings)

        except Exception as e:
            logger.error(f"Erro ao chamar Groq: {e}")
            return self._generate_rule_based_review(beach_name, conditions, ratings)

    def _build_prompt(self, beach_name: str, conditions: Dict, ratings: Dict) -> str:
        """Prompt curto e determinístico para economizar tokens"""
        return (
            f"Praia: {beach_name}\n"
            f"Ondas: {conditions.get('wave_height', 0):.1f}m, período {conditions.get('wave_period', 0) or 0:.0f}s\n"
            f"Vento: {conditions.get('wind_speed', 0):.0f}km/h\n"
            f"Temp: {conditions.get('temperature', 0):.0f}°C, Clima: {conditions.get('weather_condition', '')}\n"
            f"Surf:{ratings['surf']}/10 Natação:{ratings['swim']}/10 Pesca:{ratings['fishing']}/10\n\n"
            f"Responda em JSON:\n"
            f'{{"review":"<2 frases sobre as condições>","recommendations":["<dica1>","<dica2>"],'
            f'"warnings":["<aviso se necessário>"],"best_time":"<manhã|tarde|noite ou null>"}}'
        )

    def _generate_rule_based_review(self, beach_name: str, conditions: Dict, ratings: Dict) -> Dict:
        """Fallback com análise baseada em regras quando IA não disponível"""
        wave_height = conditions.get("wave_height", 0)
        wind_speed = conditions.get("wind_speed", 0)
        weather_condition = conditions.get("weather_condition", "")

        if wave_height < 0.5:
            wave_desc = f"mar calmo ({wave_height:.1f}m)"
        elif wave_height < 1.5:
            wave_desc = f"ondas moderadas ({wave_height:.1f}m)"
        else:
            wave_desc = f"mar agitado ({wave_height:.1f}m)"

        if wind_speed < 15:
            wind_desc = f"vento fraco ({wind_speed:.0f}km/h)"
        elif wind_speed < 30:
            wind_desc = f"vento moderado ({wind_speed:.0f}km/h)"
        else:
            wind_desc = f"vento forte ({wind_speed:.0f}km/h)"

        review = (
            f"{beach_name} apresenta {wave_desc} com {wind_desc}. "
            f"Clima: {weather_condition.lower()}."
        )

        recommendations = []
        if ratings["surf"] >= 7:
            recommendations.append("Boas condições para surf")
        if ratings["swim"] >= 7:
            recommendations.append("Ideal para natação e banho")
        if ratings["fishing"] >= 7:
            recommendations.append("Favorável para pesca")
        if not recommendations:
            recommendations = ["Condições regulares para atividades leves"]

        warnings = []
        if wave_height > 2.0:
            warnings.append("Ondas altas — cuidado ao entrar na água")
        if wind_speed > 30:
            warnings.append("Vento forte — atenção redobrada")
        if conditions.get("weather_code", 0) >= 95:
            warnings.append("Alerta de tempestade — evite a praia")

        return {
            "review_pt": review,
            "recommendations": recommendations,
            "warnings": warnings,
            "best_time": "manhã" if ratings["overall"] >= 6 else None
        }
