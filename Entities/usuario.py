"""
Entidad Usuario
=================

Modelo de Usuario con SQLAlchemy y esquemas de validación con Pydantic.
"""

import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from database.config import Base


class Usuario(Base):
    """Modelo de Usuario

    Atributos:
        id_usuario (int): Identificador único del usuario.
        id_rol (int): Identificador del rol del usuario (1: admin, 2: cliente).
        nombre (str): Nombre del usuario.
        apellido (str): Apellido del usuario.
        documento (str): Número de documento del usuario.
        email (str): Correo electrónico del usuario.
        contrasena (str): Contraseña del usuario.
        fecha_registro (datetime): Fecha y hora de registro del usuario.
        fecha_actualizar (datetime): Fecha y hora de la última actualización del usuario.

    """

    __tablename__ = "usuarios"

    id_usuario = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_rol = Column(Integer, ForeignKey("roles.id_rol"), nullable=False, default=2)
    nombre = Column(String(50), nullable=False, index=True)
    apellido = Column(String(50), nullable=False, index=True)
    documento = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    contrasena = Column(String(200), nullable=False)
    fecha_registro = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizar = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )

    auditorias = relationship("Auditoria", back_populates="usuario")
    rol = relationship("Rol", back_populates="usuario")
    tarjetas = relationship(
        "Tarjeta", back_populates="usuario", cascade="all, delete-orphan"
    )

    def __repr__(self):
        """Representación en string del objeto Usuario"""
        return f"<Usuario(id_usuario={self.id_usuario}, nombre='{self.nombre}', email='{self.email}')>"


class UsuarioBase(BaseModel):
    """
    Esquema base para la entidad Usuario.
    Define los campos principales y validaciones comunes para creación y actualización.
    """

    id_rol: int = Field(
        2, description="Identificador del rol del usuario (1: admin, 2: cliente)"
    )
    nombre: str = Field(
        ..., min_length=3, max_length=50, description="Nombre del usuario"
    )
    apellido: str = Field(
        ..., min_length=5, max_length=50, description="Apellido del usuario"
    )
    documento: str = Field(
        ..., min_length=8, max_length=20, description="Número de documento"
    )
    email: EmailStr = Field(..., description="Correo electrónico del usuario")
    contrasena: str = Field(
        ..., min_length=6, max_length=200, description="Contraseña del usuario"
    )

    @validator("nombre")
    def validar_nombre(cls, v):
        """
        Valida que el nombre no esté vacío y lo formatea con la primera letra en mayúscula.
        """
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip().title()

    @validator("apellido")
    def validar_apellido(cls, v):
        """
        Valida que el apellido no esté vacío y lo formatea con la primera letra en mayúscula.
        """
        if not v.strip():
            raise ValueError("El apellido no puede estar vacío")
        return v.strip().title()

    @validator("documento")
    def validar_documento(cls, v):
        """
        Valida que el documento no esté vacío y tenga al menos 8 caracteres.
        """
        if not v.strip():
            raise ValueError("El documento no puede estar vacío")
        if len(v.strip()) < 8:
            raise ValueError("El documento debe tener al menos 8 caracteres")
        return v.strip()

    @validator("email")
    def validar_email(cls, v):
        """
        Normaliza el correo electrónico a minúsculas y sin espacios extra.
        """
        return v.lower().strip()

    def validar_id_rol(self):
        """
        Valida que el rol del usuario sea 1 (admin) o 2 (cliente).
        """
        if self.id_rol not in [1, 2]:
            raise ValueError("El id_rol debe ser 1 (admin) o 2 (cliente)")
        return self.id_rol


class UsuarioCreate(UsuarioBase):
    """
    Esquema para la creación de un nuevo usuario.
    Hereda validaciones y atributos del esquema base.
    """

    pass


class UsuarioUpdate(BaseModel):
    """
    Esquema para la actualización de un usuario existente.
    Todos los campos son opcionales y pueden modificarse parcialmente.
    """

    id_rol: Optional[int] = Field(
        None, description="Identificador del rol del usuario (1: admin, 2: cliente)"
    )
    nombre: Optional[str] = Field(
        None, min_length=2, max_length=50, description="Nombre del usuario"
    )
    apellido: Optional[str] = Field(
        None, min_length=2, max_length=50, description="Apellido del usuario"
    )
    email: Optional[EmailStr] = Field(
        None, description="Correo electrónico del usuario"
    )

    @validator("nombre")
    def validar_nombre(cls, v):
        """
        Valida que el nombre, si se proporciona, no esté vacío
        y lo formatea con la primera letra en mayúscula.
        """
        if v is not None:
            if not v.strip():
                raise ValueError("El nombre no puede estar vacío")
            return v.strip().title()
        return v

    @validator("apellido")
    def validar_apellido(cls, v):
        """
        Valida que el apellido, si se proporciona, no esté vacío
        y lo formatea con la primera letra en mayúscula.
        """

        if v is not None:
            if not v.strip():
                raise ValueError("El apellido no puede estar vacío")
            return v.strip().title()
        return v

    @validator("id_rol")
    def validar_id_rol(cls, v):
        """
        Valida que el rol, si se proporciona, sea 1 (admin) o 2 (cliente).
        """
        if v is not None:
            if v not in [1, 2]:
                raise ValueError("El id_rol debe ser 1 (admin) o 2 (cliente)")
            return v
        return v

    @validator("email")
    def validar_email(cls, v):
        """
        Normaliza el correo electrónico a minúsculas y sin espacios extra, si se proporciona.
        """
        if v is not None:
            return v.lower().strip()
        return v
