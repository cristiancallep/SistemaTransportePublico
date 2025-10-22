"""
Módulo de Entidades - Ruta
==========================

Este módulo contiene la definición de la entidad Ruta y sus esquemas
de validación para el sistema de transporte público.

Classes:
    Ruta: Modelo SQLAlchemy para la tabla rutas
    RutaCreate: Esquema para crear nuevas rutas
    RutaUpdate: Esquema para actualizar rutas existentes
"""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator
from sqlalchemy import Column, DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from database.config import Base


class Ruta(Base):
    """Modelo de Ruta

    Atributos:
        id_ruta (int): Identificador único de la ruta.
        nombre (str): Nombre de la ruta.
        origen (str): Punto de origen de la ruta.
        destino (str): Punto de destino de la ruta.
        duracion_estimada (float): Duración estimada del viaje en minutos.
        fecha_creacion (datetime): Fecha y hora de creación de la ruta.
        fecha_actualizacion (datetime): Fecha y hora de la última actualización de la ruta.

    """

    __tablename__ = "rutas"

    id_ruta = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_linea = Column(
        UUID(as_uuid=True),
        ForeignKey("lineas.id_linea", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    nombre = Column(String(100), nullable=False, unique=True, index=True)
    origen = Column(String(100), nullable=False)
    destino = Column(String(100), nullable=False)
    duracion_estimada = Column(Float, nullable=False)  # en minutos
    fecha_creacion = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizacion = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )
    linea = relationship("Linea", back_populates="ruta")

    def __repr__(self):
        """Representación en string del objeto Ruta"""
        return f"<Ruta(id_ruta={self.id_ruta}, nombre='{self.nombre}', origen='{self.origen}', destino='{self.destino}')>"


class RutaCreate(BaseModel):
    """Esquema de creación para una ruta."""

    nombre: str = Field(..., max_length=100, description="Nombre de la ruta")
    origen: str = Field(..., max_length=100, description="Punto de origen")
    destino: str = Field(..., max_length=100, description="Punto de destino")
    duracion_estimada: float = Field(
        ..., gt=0, description="Duración estimada en minutos"
    )
    id_linea: uuid.UUID = Field(..., description="ID de la línea asociada")

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v):
        """
        Valida que el nombre de la ruta no esté vacío.

        Args:
            v (str): El nombre de la ruta a validar.

        Returns:
            str: El nombre validado.

        Raises:
            ValueError: Si el nombre está vacío.
        """
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v


class RutaUpdate(BaseModel):
    """Esquema de actualización para una ruta."""

    id_ruta: uuid.UUID = Field(..., description="ID único de la ruta")
    nombre: Optional[str] = Field(
        None, max_length=100, description="Nuevo nombre de la ruta"
    )
    origen: Optional[str] = Field(
        None, max_length=100, description="Nuevo punto de origen"
    )
    destino: Optional[str] = Field(
        None, max_length=100, description="Nuevo punto de destino"
    )
    duracion_estimada: Optional[float] = Field(
        None, gt=0, description="Nueva duración estimada en minutos"
    )

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v):
        """
        Valida que el nombre de la ruta no esté vacío si se proporciona.

        Args:
            v (Optional[str]): El nombre de la ruta a validar.

        Returns:
            Optional[str]: El nombre validado.

        Raises:
            ValueError: Si el nombre está vacío.
        """
        if v is not None and not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v


class RutaOut(BaseModel):
    """Esquema de salida completo para representar una ruta."""

    id_ruta: uuid.UUID
    id_linea: uuid.UUID
    nombre: str
    origen: str
    destino: str
    duracion_estimada: float
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True
