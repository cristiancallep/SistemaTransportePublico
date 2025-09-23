"""
Entidad AsignacionT
===================

Modelo de AsignacionT con SQLAlchemy y esquemas de validación con Pydantic.
"""

import uuid
from sqlalchemy import Column, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
from database import Base


class AsignacionT(Base):
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


from uuid import UUID as UUIDType


class AsignacionTCreate(BaseModel):
    id_usuario: UUIDType
    id_empleado: UUIDType
    id_transporte: UUIDType
    id_ruta: UUIDType


class AsignacionTUpdate(BaseModel):
    id_usuario: UUIDType | None = None
    id_empleado: UUIDType | None = None
    id_transporte: UUIDType | None = None
    id_ruta: UUIDType | None = None


class AsignacionTOut(BaseModel):
    id_asignacion: UUIDType
    id_usuario: UUIDType
    id_empleado: UUIDType
    id_transporte: UUIDType
    id_ruta: UUIDType
    fecha_asignacion: datetime

    class Config:
        from_attributes = True
