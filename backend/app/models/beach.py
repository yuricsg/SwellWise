"""
Modelo de dados para praias
"""
from sqlalchemy import Column, String, Float, Text, DateTime, Boolean, Enum as SAEnum
from sqlalchemy.sql import func
from datetime import datetime

from app.core.database import Base


class Beach(Base):
    """
    Modelo de praia
    
    Armazena informações básicas de cada praia cadastrada no sistema
    """
    __tablename__ = "beaches"
    
    id = Column(String(50), primary_key=True, index=True)
    
    name = Column(String(100), nullable=False, index=True)
    slug = Column(String(150), unique=True, index=True)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(2), nullable=False, index=True)
    region = Column(String(20), nullable=True)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    description = Column(Text, nullable=True)
    surf_quality = Column(String(20), nullable=True)
    best_season = Column(String(50), nullable=True)
    
    has_infrastructure = Column(Boolean, default=False)
    has_parking = Column(Boolean, default=False)
    has_restaurants = Column(Boolean, default=False)
    has_surf_schools = Column(Boolean, default=False)
    
    warning = Column(Text, nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    view_count = Column(Float, default=0)
    
    def __repr__(self):
        return f"<Beach(id={self.id}, name={self.name}, city={self.city}, state={self.state})>"
    
    def to_dict(self):
        """Converte o modelo para dicionário"""
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "city": self.city,
            "state": self.state,
            "region": self.region,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "description": self.description,
            "surf_quality": self.surf_quality,
            "best_season": self.best_season,
            "has_infrastructure": self.has_infrastructure,
            "has_parking": self.has_parking,
            "has_restaurants": self.has_restaurants,
            "has_surf_schools": self.has_surf_schools,
            "warning": self.warning,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "view_count": self.view_count
        }
