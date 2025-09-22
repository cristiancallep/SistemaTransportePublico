from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from database import Base


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

    id_ruta = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False, unique=True, index=True)
    origen = Column(String(100), nullable=False)
    destino = Column(String(100), nullable=False)
    duracion_estimada = Column(Float, nullable=False)  # en minutos
    fecha_creacion = Column(DateTime, default=datetime.now, nullable=False)
    fecha_actualizacion = Column(
        DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )

    def __repr__(self):
        """Representación en string del objeto Ruta"""
        return f"<Ruta(id_ruta={self.id_ruta}, nombre='{self.nombre}', origen='{self.origen}', destino='{self.destino}')>"
