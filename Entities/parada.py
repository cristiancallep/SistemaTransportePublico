"""
Entidad Parada
==============

Modelo de Parada con SQLAlchemy y esquemas de validación con Pydantic.
"""

from datetime import datetime
import uuid
from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from database import Base


class Parada(Base):
    """Modelo SQLAlchemy para la entidad Parada.
    Define la informacion de los puntos de parada disponibles en el sistema de transporte.
    """

    __tablename__ = "paradas"
    id_parada = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    coordenadas = Column(String, nullable=True)
    estado = Column(String, default="Activa")
    fecha_registro = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizar = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )


from uuid import UUID as UUIDType


class ParadaCreate(BaseModel):
    """Esquema de entrada para crear una nueva parada.
    Contiene la informacion basica necesaria.
    """

    nombre: str
    direccion: str
    coordenadas: str | None = None


class ParadaUpdate(BaseModel):
    """Esquema de entrada para actualizar los datos de una parada.
    Todos los campos son opcionales."""

    nombre: str | None = None
    direccion: str | None = None
    coordenadas: str | None = None
    estado: str | None = None


class ParadaOut(BaseModel):
    """Esquema de salida para representar una parada.
    Incluye los datos principales de identificacion y estado."""

    id_parada: UUIDType
    nombre: str
    direccion: str
    coordenadas: str | None
    estado: str

    class Config:
        """
        Configuración de Pydantic para habilitar la conversión
        desde objetos ORM (SQLAlchemy).
        """

        from_attributes = True
