"""
Entidad Rol
===========

Modelo de Rol con SQLAlchemy y esquemas de validación con Pydantic.
"""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field, validator
from typing import Optional
from database import Base


class Rol(Base):
    """Modelo de Rol

    Atributos:
        id_rol (int): Identificador único del rol
        nombre (str): Nombre del rol (admin/cliente)
    """

    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, default=2)
    nombre = Column(String(20), nullable=False, unique=True, index=True)

    usuario = relationship("Usuario", back_populates="rol", passive_deletes=True)

    def __repr__(self):
        """Representación en string del objeto Rol"""
        return f"<Rol(id_rol={self.id_rol}, nombre='{self.nombre}')>"


class RolBase(BaseModel):
    """Esquema base para Rol"""

    nombre: str = Field(..., min_length=2, max_length=20, description="Nombre del rol")

    @validator("nombre")
    def validar_nombre(cls, v):
        v = v.strip().lower()
        if v not in ["admin", "cliente"]:
            raise ValueError('El rol debe ser "admin" o "cliente"')
        return v


class RolCreate(RolBase):
    """Esquema para creación de rol"""

    pass
