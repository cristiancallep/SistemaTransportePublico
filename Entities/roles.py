"""
Entidad Rol
===========

Modelo de Rol con SQLAlchemy y esquemas de validación con Pydantic.
"""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field, field_validator

from database.config import Base


class Rol(Base):
    """Modelo de Rol

    Atributos:
        id_rol (int): Identificador único del rol
        nombre (str): Nombre del rol (admin/cliente/conductor/supervisor)
    """

    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(20), nullable=False, unique=True, index=True)

    usuario = relationship("Usuario", back_populates="rol", passive_deletes=True)

    def __repr__(self):
        """Representación en string del objeto Rol"""
        return f"<Rol(id_rol={self.id_rol}, nombre='{self.nombre}')>"


class RolBase(BaseModel):
    """Esquema base para Rol"""

    nombre: str = Field(..., min_length=2, max_length=20, description="Nombre del rol")

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, v):
        """Valida que el nombre del rol sea válido."""
        v = v.strip().lower()
        roles_validos = ["admin", "cliente", "conductor", "supervisor", "operador"]
        if v not in roles_validos:
            raise ValueError(f'El rol debe ser uno de: {", ".join(roles_validos)}')
        return v.capitalize()


class RolCreate(RolBase):
    """Esquema para creación de rol"""
class RolUpdate(BaseModel):
    """Esquema para actualización de rol"""

    nombre: str = Field(
        ..., min_length=2, max_length=20, description="Nuevo nombre del rol"
    )

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, v):
        """Valida que el nombre del rol sea válido."""
        v = v.strip().lower()
        roles_validos = ["admin", "cliente", "conductor", "supervisor", "operador"]
        if v not in roles_validos:
            raise ValueError(f'El rol debe ser uno de: {", ".join(roles_validos)}')
        return v.capitalize()


class RolOut(BaseModel):
    """Esquema de salida para representar un rol."""

    id_rol: int
    nombre: str

    class Config:
        """Configuración para permitir la conversión desde objetos SQLAlchemy."""

        from_attributes = True
