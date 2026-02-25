"""
Script para popular o banco de dados com praias iniciais
Execute: python -m app.scripts.populate_beaches
"""
import sys
from pathlib import Path

# Adicionar o diretório raiz ao path
sys.path.append(str(Path(__file__).parents[2]))

from app.core.database import SessionLocal
from app.models.beach import Beach
import uuid


def create_slug(name: str) -> str:
    """Cria slug URL-friendly"""
    import unicodedata
    import re
    
    # Normalizar e remover acentos
    slug = unicodedata.normalize('NFKD', name)
    slug = slug.encode('ASCII', 'ignore').decode('ASCII')
    
    # Converter para minúsculas e substituir espaços
    slug = slug.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    
    return slug


def populate_beaches():
    """Popula o banco com praias iniciais"""
    
    beaches_data = [
        {
            "name": "Maracaípe",
            "city": "Ipojuca",
            "state": "PE",
            "region": "Nordeste",
            "latitude": -8.5071,
            "longitude": -35.0217,
            "description": "Praia famosa mundialmente por suas ondas perfeitas para surf. Oferece ondas tubulares e é sede de campeonatos internacionais.",
            "surf_quality": "excellent",
            "best_season": "verão",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": True,
        },
        {
            "name": "Boa Viagem",
            "city": "Recife",
            "state": "PE",
            "region": "Nordeste",
            "latitude": -8.1289,
            "longitude": -34.9043,
            "description": "Praia urbana de 7km protegida por recifes naturais. Popular para caminhadas e banhos em mar calmo.",
            "surf_quality": "fair",
            "best_season": "ano todo",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": False,
        },
        {
            "name": "Porto de Galinhas",
            "city": "Ipojuca",
            "state": "PE",
            "region": "Nordeste",
            "latitude": -8.5042,
            "longitude": -35.0044,
            "description": "Uma das praias mais famosas do Brasil, conhecida pelas piscinas naturais e águas cristalinas.",
            "surf_quality": "poor",
            "best_season": "verão",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": False,
        },
        {
            "name": "Carneiros",
            "city": "Tamandaré",
            "state": "PE",
            "region": "Nordeste",
            "latitude": -8.7078,
            "longitude": -35.0839,
            "description": "Praia paradisíaca com águas calmas e mornas, coqueiros e uma capela histórica à beira-mar.",
            "surf_quality": "poor",
            "best_season": "verão",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": False,
        },
        {
            "name": "Copacabana",
            "city": "Rio de Janeiro",
            "state": "RJ",
            "region": "Sudeste",
            "latitude": -22.9711,
            "longitude": -43.1822,
            "description": "Praia icônica do Rio de Janeiro com 4km de extensão. Famosa mundialmente por sua orla e calçadão.",
            "surf_quality": "good",
            "best_season": "outono/inverno",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": True,
        },
        {
            "name": "Ipanema",
            "city": "Rio de Janeiro",
            "state": "RJ",
            "region": "Sudeste",
            "latitude": -22.9838,
            "longitude": -43.2047,
            "description": "Praia sofisticada e cosmopolita, famosa pelo Posto 9 e pelo pôr do sol no Arpoador.",
            "surf_quality": "good",
            "best_season": "outono/inverno",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": True,
        },
        {
            "name": "Jericoacoara",
            "city": "Jijoca de Jericoacoara",
            "state": "CE",
            "region": "Nordeste",
            "latitude": -2.7928,
            "longitude": -40.5147,
            "description": "Paraíso do kitesurf com dunas, lagoas e pôr do sol espetacular. Ventos constantes durante o ano todo.",
            "surf_quality": "excellent",
            "best_season": "ano todo",
            "has_infrastructure": True,
            "has_parking": False,
            "has_restaurants": True,
            "has_surf_schools": True,
        },
        {
            "name": "Maresias",
            "city": "São Sebastião",
            "state": "SP",
            "region": "Sudeste",
            "latitude": -23.7986,
            "longitude": -45.5522,
            "description": "Principal point de surf do litoral paulista. Ondas consistentes e boa infraestrutura.",
            "surf_quality": "excellent",
            "best_season": "outono/inverno",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": True,
        },
        {
            "name": "Itacaré",
            "city": "Itacaré",
            "state": "BA",
            "region": "Nordeste",
            "latitude": -14.2758,
            "longitude": -38.9969,
            "description": "Destino de surf com praias selvagens e ondas poderosas. Ótima infraestrutura turística.",
            "surf_quality": "excellent",
            "best_season": "verão",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": True,
        },
        {
            "name": "Joaquina",
            "city": "Florianópolis",
            "state": "SC",
            "region": "Sul",
            "latitude": -27.6289,
            "longitude": -48.4447,
            "description": "Praia famosa por suas ondas fortes e campeonatos de surf. Dunas para sandboard.",
            "surf_quality": "excellent",
            "best_season": "outono/inverno",
            "has_infrastructure": True,
            "has_parking": True,
            "has_restaurants": True,
            "has_surf_schools": True,
        },
    ]
    
    db = SessionLocal()
    
    try:
        print("🌊 Populando banco de dados com praias...")
        print()
        
        for beach_data in beaches_data:
            # Verificar se já existe
            existing = db.query(Beach).filter(
                Beach.name == beach_data["name"],
                Beach.city == beach_data["city"]
            ).first()
            
            if existing:
                print(f"  ⏭️  {beach_data['name']} ({beach_data['city']}) - já existe")
                continue
            
            # Criar nova praia
            beach = Beach(
                id=str(uuid.uuid4())[:8],
                slug=create_slug(beach_data["name"]),
                **beach_data
            )
            
            db.add(beach)
            print(f"  ✅ {beach_data['name']} ({beach_data['city']}, {beach_data['state']})")
        
        db.commit()
        print()
        print("✨ Banco de dados populado com sucesso!")
        
        # Mostrar contagem
        total = db.query(Beach).count()
        print(f"📊 Total de praias no banco: {total}")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    populate_beaches()
