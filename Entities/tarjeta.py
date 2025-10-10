import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from database.config import Base


class Tarjeta(Base):
    """Modelo de Tarjeta

    Atributos:
        id_tarjeta (int): Identificador único de la tarjeta.
        id_usuario (UUID): Identificador del usuario dueño de la tarjeta.
        tipo_tarjeta (str): Tipo de tarjeta (Ej: "Estudiante", "Normal", "VIP").
        numero_tarjeta (str): Número único de la tarjeta.
        estado (str): Estado de la tarjeta (Ej: "Activa", "Inactiva").
        fecha_ultima_recarga (datetime): Fecha de la última recarga.

    """

    __tablename__ = "tarjetas"

    id_tarjeta = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    id_usuario = Column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.id_usuario", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    tipo_tarjeta = Column(String(20), nullable=False, default="Frecuente")
    numero_tarjeta = Column(String(20), unique=True, nullable=False, index=True)
    estado = Column(String(20), nullable=False, default="Inactiva")
    fecha_ultima_recarga = Column(DateTime, default=datetime.now, nullable=True)
    saldo = Column(Float, nullable=False, default=0.0)
    # usuario = relationship("Usuario", back_populates="tarjetas")
    transacciones = relationship("Transaccion", back_populates="tarjeta")

    def __repr__(self):
        """Representación en string del objeto Tarjeta"""
        return f"<Tarjeta(id_tarjeta={self.id_tarjeta}, numero='{self.numero_tarjeta}', estado='{self.estado}', saldo={self.saldo} )>"


class TarjetaCreate(BaseModel):
    """Esquema de entrada para crear una nueva tarjeta.
    Contiene los datos obligatorios para el registro.
    """

    documento: str = Field(
        ..., description="Documento del usuario asociado a la tarjeta"
    )
    tipo_tarjeta: str = Field("Frecuente", max_length=20)
    estado: str = Field("Activa", max_length=20)
    saldo: float = Field(0.0, ge=0, description="Saldo inicial de la tarjeta")

    @validator("tipo_tarjeta")
    def validar_tipo_tarjeta(cls, v):
        tipos_validos = {"Estudiante", "Normal", "Frecuente"}
        if v not in tipos_validos:
            raise ValueError(
                f"Tipo de tarjeta inválido. Debe ser uno de {tipos_validos}"
            )
        return v


class TarjetaOutSaldo(BaseModel):
    """Esquema de salida para mostrar el saldo de una tarjeta."""

    id_tarjeta: uuid.UUID
    saldo: float


class TarjetaUpdate(BaseModel):
    """Esquema de actualización de una tarjeta (solo saldo)."""

    documento: str = Field(
        ..., description="Documento del usuario asociado a la tarjeta"
    )
    saldo: float = Field(
        ..., ge=0, description="Nuevo saldo de la tarjeta (no puede ser negativo)"
    )

    @validator("saldo")
    def validar_saldo(cls, v):
        if v < 0:
            raise ValueError("El saldo no puede ser negativo.")
        return v


class TarjetaOut(BaseModel):
    """Esquema de salida para la creación de tarjetas."""

    numero_tarjeta: str
    documento: str
    mensaje: str

    class Config:
        from_atributes = True
