"""
Entidad Usuario
=================

Modelo de Usuario con SQLAlchemy y esquemas de validación con Pydantic.
"""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional, List
from database import Base

class Usuario(Base):
    """
    Modelo de Usuario que representa la tabla 'usuarios'
    
    Atributos:
        id_usuario: Identificador único del usuario
        nombre: Nombre del usuario
        apellido: Apellido del usuario
        documento: Número de documento de identidad
        email: Correo electrónico del usuario
        fecha_registro: Fecha y hora de registro
    """
    
    __tablename__ = 'usuarios'
    
    id_usuario = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False, index=True)
    apellido = Column(String(50), nullable=False, index=True)
    documento = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    tipo_usuario = Column(String(20), nullable=False, default='cliente')
    fecha_registro = Column(DateTime, default=datetime.now, nullable=False)
    
    tarjetas = relationship("Tarjeta", back_populates="usuario", cascade="all, delete-orphan")
    
    def __repr__(self):
        """Representación en string del objeto Usuario"""
        return f"<Usuario(id_usuario={self.id_usuario}, nombre='{self.nombre}', email='{self.email}')>"
    
    def to_dict(self):
        """Convierte el objeto a un diccionario"""
        return {
            'id_usuario': self.id_usuario,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'documento': self.documento,
            'email': self.email,
            'fecha_registro': self.fecha_registro.isoformat() if self.fecha_registro else None
        }

class UsuarioBase(BaseModel):
    """Esquema base para Usuario"""
    nombre: str = Field(..., min_length=3, max_length=50, description="Nombre del usuario")
    apellido: str = Field(..., min_length=5, max_length=50, description="Apellido del usuario")
    documento: str = Field(..., min_length=8, max_length=20, description="Número de documento")
    email: EmailStr = Field(..., description="Correo electrónico del usuario")
    
    @validator('nombre')
    def validar_nombre(cls, v):
        if not v.strip():
            raise ValueError('El nombre no puede estar vacío')
        return v.strip().title()
    
    @validator('apellido')
    def validar_apellido(cls, v):
        if not v.strip():
            raise ValueError('El apellido no puede estar vacío')
        return v.strip().title()
    
    @validator('documento')
    def validar_documento(cls, v):
        if not v.strip():
            raise ValueError('El documento no puede estar vacío')
        if len(v.strip()) < 8:
            raise ValueError('El documento debe tener al menos 8 caracteres')
        return v.strip()
    
    @validator('email')
    def validar_email(cls, v):
        return v.lower().strip()
    
class UsuarioCreate(UsuarioBase):
    """Esquema para creación de usuario"""
    pass

class UsuarioUpdate(BaseModel):
    """Esquema para actualización de usuario"""
    nombre: Optional[str] = Field(None, min_length=2, max_length=50, description="Nombre del usuario")
    apellido: Optional[str] = Field(None, min_length=2, max_length=50, description="Apellido del usuario")
    documento: Optional[str] = Field(None, min_length=5, max_length=20, description="Número de documento")
    email: Optional[EmailStr] = Field(None, description="Correo electrónico del usuario")
    
    @validator('nombre')
    def validar_nombre(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError('El nombre no puede estar vacío')
            return v.strip().title()
        return v
    
    @validator('apellido')
    def validar_apellido(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError('El apellido no puede estar vacío')
            return v.strip().title()
        return v
    
    @validator('documento')
    def validar_documento_update(cls, v):
        if v is not None:  
            v = v.strip()
            if not v:
                raise ValueError('El documento no puede estar vacío')
            if len(v) < 8:
                raise ValueError('El documento debe tener al menos 8 caracteres')
        return v
    
    @validator('email')
    def validar_email(cls, v):
        if v is not None:
            return v.lower().strip()
        return v

class UsuarioResponse(UsuarioBase):
    """Esquema para respuesta de usuario"""
    id_usuario: int
    fecha_registro: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        
class UsuarioListResponse(BaseModel):
    """Esquema para lista de Usuarios"""
    usuarios: List[UsuarioResponse]
    total: int
    pagina: int
    por_pagina: int
    
    class Config:
        from_attributes = True