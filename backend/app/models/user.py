"""
Modelo de usuário (para implementação futura)
"""
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    """
    Modelo de usuário
    Para implementar no futuro: autenticação, favoritos, alertas
    """
    __tablename__ = "users"
    
    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Perfil
    full_name = Column(String(100), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
