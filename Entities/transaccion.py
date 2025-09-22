from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from database import Base


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

    id_transaccion = Column(Integer, primary_key=True, autoincrement=True)
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
