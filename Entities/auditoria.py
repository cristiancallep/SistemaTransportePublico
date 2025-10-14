"""
Entidad Auditoría
=================

Modelo de Auditoría con SQLAlchemy y esquemas de validación con Pydantic.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from database.config import Base
from uuid import UUID as UUIDType


class Auditoria(Base):
    """Modelo de Auditoría

    Atributos:
        id_auditoria (UUID): Identificador único de la auditoría.
        id_usuario: Identificador del usuario que realizó la acción.
        tabla_afectada (str): Nombre de la tabla afectada.
        accion (str): Acción realizada (crear, actualizar, eliminar).
        descripcion (str): Descripción de la acción realizada.
        fecha (datetime): Fecha y hora de la acción.
    """

    __tablename__ = "auditoria"

    id_auditoria = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_usuario = Column(
        UUID(as_uuid=True), ForeignKey("usuarios.id_usuario"), nullable=False
    )
    tabla_afectada = Column(String(20), nullable=False)
    accion = Column(String(20), nullable=False)
    descripcion = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.now, nullable=False)

    usuario = relationship("Usuario", back_populates="auditorias")

    def __repr__(self):
        """Representación en string del objeto Auditoria"""
        return f"<Auditoria(id_auditoria={self.id_auditoria}, id_usuario={self.id_usuario}, tabla_afectada='{self.tabla_afectada}', accion='{self.accion}', fecha={self.fecha})>"


class AuditoriaCreate(BaseModel):
    """Esquema de entrada para crear un nuevo registro de auditoría."""

    id_usuario: UUIDType
    tabla_afectada: str
    accion: str
    descripcion: str


class AuditoriaOut(BaseModel):
    """Esquema de salida para representar una auditoría.
    Incluye toda la información del registro de auditoría.
    """

    id_auditoria: UUIDType
    id_usuario: UUIDType
    tabla_afectada: str
    accion: str
    descripcion: str
    fecha: datetime

    class Config:
        """Configuración para permitir la conversión desde objetos SQLAlchemy."""

        from_attributes = True
