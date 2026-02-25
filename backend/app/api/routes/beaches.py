"""
Rotas para gerenciamento de praias
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime

from app.schemas.beach import BeachResponse, BeachList

router = APIRouter(prefix="/beaches", tags=["beaches"])


# Database temporário em memória
# TODO: Mover para banco de dados real
BEACHES_DATABASE = [
    {
        "id": "1",
        "name": "Maracaípe",
        "city": "Ipojuca",
        "state": "PE",
        "latitude": -8.5071,
        "longitude": -35.0217,
        "description": "Praia famosa mundialmente por suas ondas perfeitas para surf. Oferece ondas tubulares e é sede de campeonatos internacionais.",
        "created_at": datetime.now()
    },
    {
        "id": "2",
        "name": "Boa Viagem",
        "city": "Recife",
        "state": "PE",
        "latitude": -8.1289,
        "longitude": -34.9043,
        "description": "Praia urbana de 7km protegida por recifes naturais. Popular para caminhadas e banhos em mar calmo.",
        "created_at": datetime.now()
    },
    {
        "id": "3",
        "name": "Porto de Galinhas",
        "city": "Ipojuca",
        "state": "PE",
        "latitude": -8.5042,
        "longitude": -35.0044,
        "description": "Uma das praias mais famosas do Brasil, conhecida pelas piscinas naturais e águas cristalinas.",
        "created_at": datetime.now()
    },
    {
        "id": "4",
        "name": "Carneiros",
        "city": "Tamandaré",
        "state": "PE",
        "latitude": -8.7078,
        "longitude": -35.0839,
        "description": "Praia paradisíaca com águas calmas e mornas, coqueiros e uma capela histórica à beira-mar.",
        "created_at": datetime.now()
    },
    {
        "id": "5",
        "name": "Copacabana",
        "city": "Rio de Janeiro",
        "state": "RJ",
        "latitude": -22.9711,
        "longitude": -43.1822,
        "description": "Praia icônica do Rio de Janeiro com 4km de extensão. Famosa mundialmente por sua orla e calçadão.",
        "created_at": datetime.now()
    },
    {
        "id": "6",
        "name": "Ipanema",
        "city": "Rio de Janeiro",
        "state": "RJ",
        "latitude": -22.9838,
        "longitude": -43.2047,
        "description": "Praia sofisticada e cosmopolita, famosa pelo Posto 9 e pelo pôr do sol no Arpoador.",
        "created_at": datetime.now()
    },
    {
        "id": "7",
        "name": "Jericoacoara",
        "city": "Jijoca de Jericoacoara",
        "state": "CE",
        "latitude": -2.7928,
        "longitude": -40.5147,
        "description": "Paraíso do kitesurf com dunas, lagoas e pôr do sol espetacular. Ventos constantes durante o ano todo.",
        "created_at": datetime.now()
    },
    {
        "id": "8",
        "name": "Maresias",
        "city": "São Sebastião",
        "state": "SP",
        "latitude": -23.7986,
        "longitude": -45.5522,
        "description": "Principal point de surf do litoral paulista. Ondas consistentes e boa infraestrutura.",
        "created_at": datetime.now()
    },
]


@router.get("/", response_model=BeachList)
async def list_beaches(
    state: Optional[str] = Query(None, description="Filtrar por estado (UF)", max_length=2),
    city: Optional[str] = Query(None, description="Filtrar por cidade"),
    search: Optional[str] = Query(None, description="Buscar por nome da praia")
):
    """
    Lista todas as praias disponíveis no sistema
    
    Pode filtrar por:
    - Estado (UF)
    - Cidade
    - Nome (busca parcial)
    """
    beaches = BEACHES_DATABASE.copy()
    
    # Aplicar filtros
    if state:
        beaches = [b for b in beaches if b["state"].upper() == state.upper()]
    
    if city:
        beaches = [b for b in beaches if city.lower() in b["city"].lower()]
    
    if search:
        beaches = [b for b in beaches if search.lower() in b["name"].lower()]
    
    return {
        "total": len(beaches),
        "beaches": beaches
    }


@router.get("/{beach_id}", response_model=BeachResponse)
async def get_beach(beach_id: str):
    """
    Retorna informações detalhadas de uma praia específica
    
    Args:
        beach_id: ID da praia
    """
    beach = next((b for b in BEACHES_DATABASE if b["id"] == beach_id), None)
    
    if not beach:
        raise HTTPException(
            status_code=404,
            detail=f"Praia com ID '{beach_id}' não encontrada"
        )
    
    return beach


@router.get("/state/{state_uf}")
async def get_beaches_by_state(state_uf: str):
    """
    Lista todas as praias de um estado específico
    
    Args:
        state_uf: Sigla do estado (ex: PE, RJ, SP)
    """
    beaches = [b for b in BEACHES_DATABASE if b["state"].upper() == state_uf.upper()]
    
    if not beaches:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhuma praia encontrada para o estado '{state_uf}'"
        )
    
    return {
        "state": state_uf.upper(),
        "total": len(beaches),
        "beaches": beaches
    }


@router.get("/city/{city_name}")
async def get_beaches_by_city(city_name: str):
    """
    Lista todas as praias de uma cidade específica
    
    Args:
        city_name: Nome da cidade
    """
    beaches = [b for b in BEACHES_DATABASE if city_name.lower() in b["city"].lower()]
    
    if not beaches:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhuma praia encontrada para a cidade '{city_name}'"
        )
    
    return {
        "city": city_name,
        "total": len(beaches),
        "beaches": beaches
    }
