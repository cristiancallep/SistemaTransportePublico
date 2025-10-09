import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from database.config import Base


class Ruta(Base):
    """Modelo de Ruta

    Atributos:
        id_ruta (int): Identificador único de la ruta.
        nombre (str): Nombre de la ruta.
        origen (str): Punto de origen de la ruta.
        destino (str): Punto de destino de la ruta.
        duracion_estimada (float): Duración estimada del viaje en minutos.
        fecha_creacion (datetime): Fecha y hora de creación de la ruta.
        fecha_actualizacion (datetime): Fecha y hora de la última actualización de la ruta.

    """

    __tablename__ = "rutas"

    id_ruta = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_linea = Column(
        UUID(as_uuid=True),
        ForeignKey("lineas.id_linea", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    nombre = Column(String(100), nullable=False, unique=True, index=True)
    origen = Column(String(100), nullable=False)
    destino = Column(String(100), nullable=False)
    duracion_estimada = Column(Float, nullable=False)  # en minutos
    fecha_creacion = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizacion = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )
    linea = relationship("Linea", back_populates="ruta")

    def __repr__(self):
        """Representación en string del objeto Ruta"""
        return f"<Ruta(id_ruta={self.id_ruta}, nombre='{self.nombre}', origen='{self.origen}', destino='{self.destino}')>"


class RutaCreate(BaseModel):
    """Esquema de creación para una ruta."""

    nombre: str = Field(..., max_length=100, example="Ruta A")
    origen: str = Field(..., max_length=100, example="Punto A")
    destino: str = Field(..., max_length=100, example="Punto B")
    duracion_estimada: float = Field(..., gt=0, example=30.5)  # en minutos
    id_linea: uuid.UUID = Field(..., example="123e4567-e89b-12d3-a456-426614174000")

    @validator("nombre")
    def nombre_no_vacio(cls, v):
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v


class RutaUpdate(BaseModel):
    """Esquema de actualización para una ruta."""

    id_ruta: uuid.UUID = Field(..., example="123e4567-e89b-12d3-a456-426614174000")
    nombre: Optional[str] = Field(None, max_length=100, example="Ruta A")
    origen: Optional[str] = Field(None, max_length=100, example="Punto A")
    destino: Optional[str] = Field(None, max_length=100, example="Punto B")
    duracion_estimada: Optional[float] = Field(None, gt=0, example=30.5)  # en minutos

    @validator("nombre")
    def nombre_no_vacio(cls, v):
        if v is not None and not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v
