import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from database import Base


class Linea(Base):
    """Modelo de Linea

    Atributos:
        id_linea (int): Identificador único de la línea.
        nombre (str): Nombre de la línea.
        descripcion (str): Descripción de la línea.
        fecha_creacion (datetime): Fecha y hora de creación de la línea.
        fecha_actualizacion (datetime): Fecha y hora de la última actualización de la línea.

    """

    __tablename__ = "lineas"

    id_linea = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(100), nullable=False, unique=True, index=True)
    descripcion = Column(String(255), nullable=True)
    fecha_creacion = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizacion = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )

    ruta = relationship("Ruta", back_populates="linea", cascade="all, delete-orphan")

    def __repr__(self):
        """Representación en string del objeto Linea"""
        return f"<Linea(id_linea={self.id_linea}, nombre='{self.nombre}', descripcion='{self.descripcion}')>"
