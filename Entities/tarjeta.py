"""
Entidad Tarjeta
=================

Modelo de Tarjeta con SQLAlchemy y esquemas de validación con Pydantic.
"""
from sqlalchemy import Column, Integer, String, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List
from database import Base
from decimal import Decimal


class Tarjeta(Base):
    """
    Modelo de Tarjeta que representa la tabla 'tarjetas'
    
    Atributos:
        id_tarjeta: Identificador único de la tarjeta
        id_usuario: ID del usuario dueño de la tarjeta (clave foránea)
        tipo_tarjeta: Tipo de tarjeta (Ej: "Estudiante", "Normal", "VIP")
        descuento: Porcentaje de descuento (0.00 a 1.00)
        numero_tarjeta: Número único de la tarjeta
        saldo: Saldo actual de la tarjeta
        estado: Estado de la tarjeta (Ej: "Activa", "Inactiva")
        fecha_ultima_recarga: Fecha de la última recarga
    """
    
    __tablename__ = 'tarjetas'
    
    id_tarjeta = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('usuarios.id_usuario' , ondelete='CASCADE'), nullable=False, unique=True, index=True)
    tipo_tarjeta = Column(String(20), nullable=False, default='Frecuente')
    descuento = Column(Numeric(3, 2), nullable=False, default=0.00) 
    numero_tarjeta = Column(String(20), unique=True, nullable=False, index=True)
    saldo = Column(Numeric(10, 2), nullable=False, default=0.00) 
    estado = Column(String(20), nullable=False, default='Inactiva')
    fecha_ultima_recarga = Column(DateTime, default=datetime.now, nullable=True)
    
    # Relación con Usuario
    usuario = relationship("Usuario", back_populates="tarjetas")
    
    def __repr__(self):
        """Representación en string del objeto Tarjeta"""
        return f"<Tarjeta(id_tarjeta={self.id_tarjeta}, numero='{self.numero_tarjeta}', saldo={self.saldo})>"
    
    def to_dict(self):
        """Convierte el objeto a un diccionario"""
        return {
            'id_tarjeta': self.id_tarjeta,
            'id_usuario': self.id_usuario,
            'tipo_tarjeta': self.tipo_tarjeta,
            'descuento': float(self.descuento) if self.descuento else 0.00,
            'numero_tarjeta': self.numero_tarjeta,
            'saldo': float(self.saldo) if self.saldo else 0.00,
            'estado': self.estado,
            'fecha_ultima_recarga': self.fecha_ultima_recarga.isoformat() if self.fecha_ultima_recarga else None
        }

# Esquemas Pydantic para Tarjeta
class TarjetaBase(BaseModel):
    """Esquema base para Tarjeta"""
    id_usuario: int = Field(..., gt=0, description="ID del usuario dueño de la tarjeta")
    tipo_tarjeta: str = Field(..., min_length=2, max_length=20, description="Tipo de tarjeta")
    descuento: Decimal = Field(..., ge=0.00, le=1.00, max_digits=3, decimal_places=2, description="Porcentaje de descuento (0.00 a 1.00)")
    numero_tarjeta: str = Field(..., min_length=5, max_length=20, description="Número de la tarjeta")
    saldo: Decimal = Field(..., ge=0.00, max_digits=10, decimal_places=2, description="Saldo actual")
    
    @validator('tipo_tarjeta')
    def validar_tipo_tarjeta(cls, v):
        tipos_validos = ['Frecuente', 'Estudiante', 'Adulto_Mayor']
        if v not in tipos_validos:
            return f'Tipo de tarjeta inválido. Debe ser: {", ".join(tipos_validos)}'
        return v
    
    @validator('numero_tarjeta')
    def validar_numero_tarjeta(cls, v):
        if not v.strip():
            return 'El número de tarjeta no puede estar vacío'
        # Validar que solo contenga números
        if not v.strip().isdigit():
            return 'El número de tarjeta solo puede contener dígitos'
        return v.strip()

class TarjetaCreate(TarjetaBase):
    """Esquema para creación de tarjeta"""
    pass

class TarjetaUpdate(BaseModel):
    """Esquema para actualización de tarjeta"""
    tipo_tarjeta: Optional[str] = Field(None, min_length=2, max_length=20, description="Tipo de tarjeta")
    descuento: Optional[Decimal] = Field(None, ge=0.00, le=1.00, max_digits=3, decimal_places=2, description="Porcentaje de descuento")
    saldo: Optional[Decimal] = Field(None, ge=0.00, max_digits=10, decimal_places=2, description="Saldo actual")
    estado: Optional[str] = Field(None, min_length=2, max_length=20, description="Estado de la tarjeta")
    fecha_ultima_recarga: Optional[datetime] = Field(None, description="Fecha de última recarga")
    
    @validator('tipo_tarjeta')
    def validar_tipo_tarjeta_update(cls, v):
        if v is not None:
            tipos_validos = ['Normal', 'Estudiante', 'Adulto_Mayor']
            if v not in tipos_validos:
                return f'Tipo de tarjeta inválido. Debe ser: {", ".join(tipos_validos)}'
        return v
    
    @validator('estado')
    def validar_estado_update(cls, v):
        if v is not None:
            estados_validos = ['Activa', 'Inactiva', 'Bloqueada']
            if v not in estados_validos:
                return f'Estado inválido. Debe ser: {", ".join(estados_validos)}'
        return v

class TarjetaResponse(TarjetaBase):
    """Esquema para respuesta de tarjeta"""
    id_tarjeta: int
    fecha_ultima_recarga: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            Decimal: lambda v: float(v)  # Convertir Decimal a float para JSON
        }

class TarjetaListResponse(BaseModel):
    """Esquema para lista de Tarjetas"""
    tarjetas: List[TarjetaResponse]
    total: int
    pagina: int
    por_pagina: int
    
    class Config:
        from_attributes = True

# Actualizar la clase Usuario para agregar la relación
# Agregar esto a la clase Usuario existente:
# tarjetas = relationship("Tarjeta", back_populates="usuario", cascade="all, delete-orphan")