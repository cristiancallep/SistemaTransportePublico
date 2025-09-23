"""
Entidad Transporte
==================

Modelo de Transporte con SQLAlchemy y esquemas de validación con Pydantic.
"""

import uuid
from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from database import Base


class Transporte(Base):
    __tablename__ = "transportes"
    id_transporte = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tipo = Column(String, nullable=False)
    placa = Column(String, unique=True, nullable=False)
    capacidad = Column(Integer, nullable=False)
    estado = Column(String, default="Activo")
    id_linea = Column(UUID(as_uuid=True), ForeignKey("lineas.id_linea"))


from uuid import UUID as UUIDType


class TransporteCreate(BaseModel):
    tipo: str
    placa: str
    capacidad: int
    id_linea: UUIDType


class TransporteUpdate(BaseModel):
    tipo: str | None = None
    placa: str | None = None
    capacidad: int | None = None
    estado: str | None = None
    id_linea: UUIDType | None = None


class TransporteOut(BaseModel):
    id_transporte: UUIDType
    tipo: str
    placa: str
    capacidad: int
    estado: str
    id_linea: int

    class Config:
        from_attributes = True
