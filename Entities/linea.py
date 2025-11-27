"""
Entidad Línea
=============

Modelo de Línea con SQLAlchemy y esquemas de validación con Pydantic.
Define las líneas de transporte del sistema.
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, Field, field_validator

from database.config import Base


class Linea(Base):
    """Modelo de Linea

    Atributos:
        id_linea (int): Identificador único de la línea.
        nombre (str): Nombre de la línea.
        descripcion (str): Descripción de la línea.
        fecha_creacion (datetime): Fecha y hora de creación de la línea.
        fecha_actualizacion (datetime): Fecha y hora de la última actualización de la línea.

    """

    __tablename__ = "lineas"

    id_linea = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(100), nullable=False, unique=True, index=True)
    descripcion = Column(String(255), nullable=True)
    fecha_creacion = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizacion = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )

    ruta = relationship("Ruta", back_populates="linea", cascade="all, delete-orphan")

    def __repr__(self):
        """Representación en string del objeto Linea"""
        return f"<Linea(id_linea={self.id_linea}, nombre='{self.nombre}', descripcion='{self.descripcion}')>"


class LineaCreate(BaseModel):
    """Esquema de creación para una línea."""

    nombre: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Nombre de la línea",
        examples=["Línea 1", "Línea Amarilla"],
    )
    descripcion: Optional[str] = Field(
        None,
        max_length=255,
        description="Descripción de la línea",
        examples=["Línea que conecta A con B", "Ruta principal centro-periferia"],
    )

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v):
        """Valida que el nombre de la línea no esté vacío."""
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip()


class LineaUpdate(BaseModel):
    """Esquema para actualizar una línea existente."""

    nombre: Optional[str] = Field(
        None, min_length=1, max_length=100, description="Nombre de la línea"
    )
    descripcion: Optional[str] = Field(
        None, max_length=255, description="Descripción de la línea"
    )

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, v):
        """Valida que el nombre no esté vacío si se proporciona."""
        if v is not None and not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip() if v else v


class LineaOut(BaseModel):
    """Esquema de salida para una línea."""

    id_linea: uuid.UUID
    nombre: str
    descripcion: Optional[str]
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        """Configuración para permitir la conversión desde objetos SQLAlchemy."""

        from_attributes = True
