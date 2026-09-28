"""
Entidad Empleado
================

Modelo de Empleado con SQLAlchemy y esquemas de validación con Pydantic.
"""

from datetime import datetime
import uuid
from typing import Optional
from uuid import UUID as UUIDType

from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, Field, field_validator, EmailStr
from database.config import Base


class Empleado(Base):
    """
    Modelo SQLAlchemy para la entidad Empleado.
    Define los atributos y relaciones de la tabla empleados en la base de datos.
    """

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


class EmpleadoCreate(BaseModel):
    """Esquema de entrada para crear un nuevo empleado.
    Contiene la información básica obligatoria.
    """

    nombre: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Nombre del empleado",
        examples=["Juan", "María José"],
    )
    apellido: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Apellido del empleado",
        examples=["Pérez", "García López"],
    )
    documento: str = Field(
        ...,
        min_length=8,
        max_length=20,
        description="Número de documento de identidad",
        examples=["12345678", "CC-12345678"],
    )
    email: EmailStr = Field(
        ...,
        description="Correo electrónico del empleado",
        examples=["empleado@empresa.com"],
    )
    rol: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Rol del empleado en el sistema",
        examples=["Conductor", "Supervisor", "Administrador"],
    )

    @field_validator("nombre", "apellido")
    @classmethod
    def validar_nombres(cls, v):
        """Valida que nombres y apellidos no estén vacíos y los formatea."""
        if not v.strip():
            raise ValueError("El campo no puede estar vacío")
        return v.strip().title()

    @field_validator("documento")
    @classmethod
    def validar_documento(cls, v):
        """Valida el formato del documento."""
        if not v.strip():
            raise ValueError("El documento no puede estar vacío")
        return v.strip().upper()

    @field_validator("rol")
    @classmethod
    def validar_rol(cls, v):
        """Valida y formatea el rol del empleado."""
        if not v.strip():
            raise ValueError("El rol no puede estar vacío")
        return v.strip().title()


class EmpleadoUpdate(BaseModel):
    """Esquema de entrada para actualizar un empleado existente.
    Todos los campos son opcionales.
    """

    nombre: Optional[str] = Field(
        None, min_length=2, max_length=100, description="Nombre del empleado"
    )
    apellido: Optional[str] = Field(
        None, min_length=2, max_length=100, description="Apellido del empleado"
    )
    email: Optional[EmailStr] = Field(
        None, description="Correo electrónico del empleado"
    )
    rol: Optional[str] = Field(
        None, min_length=2, max_length=50, description="Rol del empleado en el sistema"
    )
    estado: Optional[str] = Field(
        None,
        description="Estado del empleado",
        examples=["Activo", "Inactivo", "Suspendido"],
    )

    @field_validator("nombre", "apellido", "rol")
    @classmethod
    def validar_campos_texto(cls, v):
        """Valida y formatea campos de texto si no son nulos."""
        if v is not None and not v.strip():
            raise ValueError("El campo no puede estar vacío")
        return v.strip().title() if v else v


class EmpleadoOut(BaseModel):
    """Esquema de salida para representar un empleado.
    Incluye toda la información relevante del empleado.
    """

    id_empleado: UUIDType
    nombre: str
    apellido: str
    documento: str
    email: str
    rol: str
    estado: str
    fecha_registro: datetime
    fecha_actualizar: datetime

    class Config:
        """Configuración para permitir la conversión desde objetos SQLAlchemy."""

        from_attributes = True
