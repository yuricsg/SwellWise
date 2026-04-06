"""
Schemas para representação de praias
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class BeachBase(BaseModel):
    """Modelo base para praia"""
    name: str = Field(..., description="Nome da praia", min_length=1, max_length=100)
    city: str = Field(..., description="Cidade", min_length=1, max_length=100)
    state: str = Field(..., description="Estado (UF)", min_length=2, max_length=2)
    latitude: float = Field(..., description="Latitude", ge=-90, le=90)
    longitude: float = Field(..., description="Longitude", ge=-180, le=180)
    description: Optional[str] = Field(None, description="Descrição da praia", max_length=1000)


class BeachCreate(BeachBase):
    """Schema para criação de praia"""
    pass


class BeachResponse(BeachBase):
    """Schema para resposta de praia"""
    id: str = Field(..., description="ID único da praia")
    slug: Optional[str] = Field(None, description="URL-friendly name")
    region: Optional[str] = Field(None, description="Região geográfica")
    surf_quality: Optional[str] = Field(None, description="Qualidade do surf")
    best_season: Optional[str] = Field(None, description="Melhor época do ano")
    tags: List[str] = Field(default_factory=list, description="Tags da praia")
    warning: Optional[str] = Field(None, description="Alerta de segurança especial")
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "1",
                "name": "Maracaípe",
                "city": "Ipojuca",
                "state": "PE",
                "latitude": -8.5071,
                "longitude": -35.0217,
                "description": "Praia famosa por suas ondas perfeitas para surf",
                "tags": ["surf", "iniciante"],
                "created_at": "2026-02-25T15:00:00"
            }
        }


class BeachList(BaseModel):
    """Schema para lista de praias paginada"""
    total: int
    limit: int
    offset: int
    has_more: bool
    beaches: List[BeachResponse]
