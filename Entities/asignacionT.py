"""
Entidad AsignacionT
===================

Modelo de AsignacionT con SQLAlchemy y esquemas de validación con Pydantic.
"""

import uuid
from datetime import datetime
from typing import Optional
from uuid import UUID as UUIDType

from sqlalchemy import Column, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, Field
from database.config import Base


class AsignacionT(Base):
    """Modelo SQLAlchemy que representa la tabla 'asignaciones'.
    Define la relación entre usuario, empleado, transporte y ruta.
    """

    __tablename__ = "asignaciones"
    id_asignacion = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_usuario = Column(UUID(as_uuid=True), ForeignKey("usuarios.id_usuario"))
    id_empleado = Column(
        UUID(as_uuid=True), ForeignKey("empleados.id_empleado", ondelete="CASCADE")
    )
    id_transporte = Column(UUID(as_uuid=True), ForeignKey("transportes.id_transporte"))
    id_ruta = Column(UUID(as_uuid=True), ForeignKey("rutas.id_ruta"))
    fecha_registro = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizar = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )


class AsignacionTCreate(BaseModel):
    """
    Esquema de entrada para crear una nueva asignación.
    Contiene los identificadores de usuario, empleado, transporte y ruta.
    """

    id_usuario: UUIDType = Field(
        ..., description="ID del usuario que realiza la asignación"
    )
    id_empleado: UUIDType = Field(..., description="ID del empleado asignado")
    id_transporte: UUIDType = Field(..., description="ID del transporte asignado")
    id_ruta: UUIDType = Field(..., description="ID de la ruta asignada")


class AsignacionTUpdate(BaseModel):
    """Esquema de entrada para actualizar una asignación existente.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """

    id_usuario: Optional[UUIDType] = Field(
        None, description="ID del usuario que realiza la asignación"
    )
    id_empleado: Optional[UUIDType] = Field(
        None, description="ID del empleado asignado"
    )
    id_transporte: Optional[UUIDType] = Field(
        None, description="ID del transporte asignado"
    )
    id_ruta: Optional[UUIDType] = Field(None, description="ID de la ruta asignada")


class AsignacionTOut(BaseModel):
    """Esquema de salida para representar una asignación.
    Incluye todos los campos relevantes de la asignación.
    """

    id_asignacion: UUIDType
    id_usuario: UUIDType
    id_empleado: UUIDType
    id_transporte: UUIDType
    id_ruta: UUIDType
    fecha_registro: datetime
    fecha_actualizar: datetime

    class Config:
        """Configuración para permitir la conversión desde objetos SQLAlchemy."""

        from_attributes = True
