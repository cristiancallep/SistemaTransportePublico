from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from database import Base


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

    import uuid

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
    usuario = relationship("Usuario", back_populates="tarjetas")
    transacciones = relationship("Transaccion", back_populates="tarjeta")

    def __repr__(self):
        """Representación en string del objeto Tarjeta"""
        return f"<Tarjeta(id_tarjeta={self.id_tarjeta}, numero='{self.numero_tarjeta}', estado='{self.estado}', saldo={self.saldo} )>"
