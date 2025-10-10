from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from database.config import Base
import uuid


class Transaccion(Base):
    """Modelo de Transaccion

    Atributos:
        id_transaccion (int): Identificador único de la transacción.
        id_tarjeta (UUID): Identificador de la tarjeta asociada a la transacción.
        tipo_transaccion (str): Tipo de transacción (Ej: "Recarga", "Pago").
        monto                  (float): Monto de la transacción.
        fecha_transaccion (datetime): Fecha y hora de la transacción.
    """

    __tablename__ = "transacciones"
    import uuid

    id_transaccion = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    numero_tarjeta = Column(
        String(20),
        ForeignKey("tarjetas.numero_tarjeta", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    tipo_transaccion = Column(String(50), nullable=False)
    monto = Column(Float, nullable=False)
    fecha_transaccion = Column(DateTime, default=datetime.now, nullable=False)

    tarjeta = relationship("Tarjeta", back_populates="transacciones")

    def __repr__(self):
        """Representación en string del objeto Transaccion"""
        return f"<Transaccion(id_transaccion={self.id_transaccion}, tipo_transaccion='{self.tipo_transaccion}', monto={self.monto})>"


class TransaccionOut(BaseModel):
    """Esquema de salida para una transaccion."""

    id_transaccion: uuid.UUID
    numero_tarjeta: str
    tipo_transaccion: str
    monto: float
    fecha_transaccion: datetime

    class Config:
        from_atributes = True
