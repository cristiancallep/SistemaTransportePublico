"""
Entidad Empleado
================

Modelo de Empleado con SQLAlchemy y esquemas de validación con Pydantic.
"""

from datetime import datetime
import uuid
from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from database import Base


class Empleado(Base):
    __tablename__ = "empleados"
    id_empleado = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    documento = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    rol = Column(String, nullable=False)
    estado = Column(String, default="Activo")
    fecha_registro = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizar = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )


from uuid import UUID as UUIDType


class EmpleadoCreate(BaseModel):
    nombre: str
    apellido: str
    documento: str
    email: str
    rol: str


class EmpleadoUpdate(BaseModel):
    nombre: str | None = None
    apellido: str | None = None
    email: str | None = None
    rol: str | None = None
    estado: str | None = None


class EmpleadoOut(BaseModel):
    id_empleado: UUIDType
    nombre: str
    apellido: str
    documento: str
    email: str
    rol: str
    estado: str

    class Config:
        from_attributes = True
