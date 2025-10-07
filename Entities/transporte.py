"""
Entidad Transporte
==================

Modelo de Transporte con SQLAlchemy y esquemas de validación con Pydantic.
"""

import uuid
from sqlalchemy import Column, DateTime, String, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from database.config import Base
from pydantic import BaseModel


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


from uuid import UUID as UUIDType


class TransporteCreate(BaseModel):
    """Esquema de entrada para crear un nuevo transporte.
    Contiene los datos obligatorios para el registro.
    """

    tipo: str
    placa: str
    capacidad: int
    id_linea: UUIDType


class TransporteUpdate(BaseModel):
    """Esquema de entrada para actualizar un transporte existente.
    Todos los campos son opcionales.
    """

    tipo: str | None = None
    placa: str | None = None
    capacidad: int | None = None
    estado: str | None = None
    id_linea: UUIDType | None = None


class TransporteOut(BaseModel):
    """Esquema de salida para mostrar la informacion de un transporte.
    Incluye datos de identificacion, capacidad y estado.
    """

    id_transporte: UUIDType
    tipo: str
    placa: str
    capacidad: int
    estado: str
    id_linea: UUIDType

    class Config:
        """
        Configuración de Pydantic para habilitar la conversión
        desde objetos ORM (SQLAlchemy).
        """

        from_attributes = True
