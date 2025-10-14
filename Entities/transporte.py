"""
Entidad Transporte
==================

Modelo de Transporte con SQLAlchemy y esquemas de validación con Pydantic.
"""

import uuid
from datetime import datetime
from typing import Optional
from uuid import UUID as UUIDType

from sqlalchemy import Column, DateTime, String, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, Field, field_validator
from database.config import Base


class Transporte(Base):
    """Modelo SQLAlchemy que representa la tabla 'transportes'.
    Define la informacion de los vehiculos registraos en el sistema.
    """

    __tablename__ = "transportes"
    id_transporte = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tipo = Column(String, nullable=False)
    placa = Column(String, unique=True, nullable=False)
    capacidad = Column(Integer, nullable=False)
    estado = Column(String, default="Activo")
    id_linea = Column(UUID(as_uuid=True), ForeignKey("lineas.id_linea"))
    fecha_registro = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizar = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )

    # Relación con Línea (comentada por ahora para evitar imports circulares)
    # linea = relationship("Linea", back_populates="transportes")


class TransporteCreate(BaseModel):
    """Esquema de entrada para crear un nuevo transporte.
    Contiene los datos obligatorios para el registro.
    """

    tipo: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Tipo de vehículo",
        examples=["Bus", "Buseta", "Articulado", "Metro"],
    )
    placa: str = Field(
        ...,
        min_length=6,
        max_length=10,
        description="Placa del vehículo",
        examples=["ABC123", "XYZ-456"],
    )
    capacidad: int = Field(
        ...,
        gt=0,
        le=200,
        description="Capacidad máxima de pasajeros",
        examples=[40, 80, 120],
    )
    id_linea: UUIDType = Field(
        ..., description="ID de la línea a la que pertenece el transporte"
    )

    @field_validator("tipo")
    @classmethod
    def validar_tipo(cls, v):
        """Valida y formatea el tipo de transporte."""
        if not v.strip():
            raise ValueError("El tipo no puede estar vacío")
        return v.strip().title()

    @field_validator("placa")
    @classmethod
    def validar_placa(cls, v):
        """Valida el formato de la placa."""
        if not v.strip():
            raise ValueError("La placa no puede estar vacía")
        placa_limpia = v.strip().upper()
        # Validación básica de formato de placa
        if len(placa_limpia) < 6:
            raise ValueError("La placa debe tener al menos 6 caracteres")
        return placa_limpia


class TransporteUpdate(BaseModel):
    """Esquema de entrada para actualizar un transporte existente.
    Todos los campos son opcionales.
    """

    tipo: Optional[str] = Field(
        None, min_length=3, max_length=50, description="Tipo de vehículo"
    )
    placa: Optional[str] = Field(
        None, min_length=6, max_length=10, description="Placa del vehículo"
    )
    capacidad: Optional[int] = Field(
        None, gt=0, le=200, description="Capacidad máxima de pasajeros"
    )
    estado: Optional[str] = Field(
        None,
        description="Estado del transporte",
        examples=["Activo", "Inactivo", "Mantenimiento"],
    )
    id_linea: Optional[UUIDType] = Field(
        None, description="ID de la línea a la que pertenece el transporte"
    )

    @field_validator("tipo")
    @classmethod
    def validar_tipo(cls, v):
        """Valida el tipo si no es nulo."""
        if v is not None and not v.strip():
            raise ValueError("El tipo no puede estar vacío")
        return v.strip().title() if v else v

    @field_validator("placa")
    @classmethod
    def validar_placa(cls, v):
        """Valida la placa si no es nula."""
        if v is not None:
            if not v.strip():
                raise ValueError("La placa no puede estar vacía")
            placa_limpia = v.strip().upper()
            if len(placa_limpia) < 6:
                raise ValueError("La placa debe tener al menos 6 caracteres")
            return placa_limpia
        return v


class TransporteOut(BaseModel):
    """Esquema de salida para mostrar la información de un transporte.
    Incluye datos de identificación, capacidad, estado y fechas.
    """

    id_transporte: UUIDType
    tipo: str
    placa: str
    capacidad: int
    estado: str
    id_linea: UUIDType
    fecha_registro: datetime
    fecha_actualizar: datetime

    class Config:
        """
        Configuración de Pydantic para habilitar la conversión
        desde objetos ORM (SQLAlchemy).
        """

        from_attributes = True
