"""
Entidad Parada
==============

Modelo de Parada con SQLAlchemy y esquemas de validación con Pydantic.
"""

from datetime import datetime
import uuid
from typing import Optional
from uuid import UUID as UUIDType

from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, Field, field_validator
from database.config import Base


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


class ParadaCreate(BaseModel):
    """Esquema de entrada para crear una nueva parada.
    Contiene la información básica necesaria.
    """

    nombre: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Nombre de la parada",
        examples=[
            "Terminal Central",
            "Estación Universidad",
            "Parada Centro Comercial",
        ],
    )
    direccion: str = Field(
        ...,
        min_length=10,
        max_length=255,
        description="Dirección física de la parada",
        examples=["Calle 123 # 45-67", "Av. Principal con Calle 50"],
    )
    coordenadas: Optional[str] = Field(
        None,
        max_length=100,
        description="Coordenadas GPS de la parada",
        examples=["4.6097, -74.0817", "10.4806, -66.9036"],
    )

    @field_validator("nombre", "direccion")
    @classmethod
    def validar_campos_texto(cls, v):
        """Valida que los campos no estén vacíos."""
        if not v.strip():
            raise ValueError("El campo no puede estar vacío")
        return v.strip()

    @field_validator("coordenadas")
    @classmethod
    def validar_coordenadas(cls, v):
        """Valida el formato de coordenadas si se proporciona."""
        if v is not None:
            v = v.strip()
            if v and "," not in v:
                raise ValueError(
                    "Las coordenadas deben tener formato 'latitud, longitud'"
                )
        return v


class ParadaUpdate(BaseModel):
    """Esquema de entrada para actualizar los datos de una parada.
    Todos los campos son opcionales."""

    nombre: Optional[str] = Field(
        None, min_length=3, max_length=100, description="Nombre de la parada"
    )
    direccion: Optional[str] = Field(
        None, min_length=10, max_length=255, description="Dirección física de la parada"
    )
    coordenadas: Optional[str] = Field(
        None, max_length=100, description="Coordenadas GPS de la parada"
    )
    estado: Optional[str] = Field(
        None,
        description="Estado de la parada",
        examples=["Activa", "Inactiva", "Mantenimiento"],
    )

    @field_validator("nombre", "direccion")
    @classmethod
    def validar_campos_texto(cls, v):
        """Valida campos de texto si no son nulos."""
        if v is not None and not v.strip():
            raise ValueError("El campo no puede estar vacío")
        return v.strip() if v else v

    @field_validator("coordenadas")
    @classmethod
    def validar_coordenadas(cls, v):
        """Valida coordenadas si no son nulas."""
        if v is not None:
            v = v.strip()
            if v and "," not in v:
                raise ValueError(
                    "Las coordenadas deben tener formato 'latitud, longitud'"
                )
        return v


class ParadaOut(BaseModel):
    """Esquema de salida para representar una parada.
    Incluye todos los datos de identificación, ubicación y estado."""

    id_parada: UUIDType
    nombre: str
    direccion: str
    coordenadas: Optional[str]
    estado: str
    fecha_registro: datetime
    fecha_actualizar: datetime

    class Config:
        """
        Configuración de Pydantic para habilitar la conversión
        desde objetos ORM (SQLAlchemy).
        """

        from_attributes = True
