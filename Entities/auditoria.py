import uuid
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import Optional
from database import Base

class Auditoria(Base):
    """Modelo de Auditoría
        
    Atributos:
        id_auditoria (UUID): Identificador único de la auditoría.
        id_usuario (UUID): Identificador del usuario que realizó la acción.
        tabla_afectada (str): Nombre de la tabla afectada.
        accion (str): Acción realizada (crear, actualizar, eliminar).
        descripcion (str): Descripción de la acción realizada.
        fecha (datetime): Fecha y hora de la acción.
    """
    
    __tablename__ = 'auditoria'

    id_auditoria = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_usuario = Column(UUID(as_uuid=True), ForeignKey('usuarios.id_usuario'), nullable=False)
    tabla_afectada = Column(String(20), nullable=False)
    accion = Column(String(20), nullable=False)
    descripcion = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.now, nullable=False)

    usuario = relationship("Usuario", back_populates="auditorias")

    def __repr__(self):
        return f"<Auditoria(id_auditoria={self.id_auditoria}, id_usuario={self.id_usuario}, tabla_afectada='{self.tabla_afectada}', accion='{self.accion}', fecha={self.fecha})>"

class AuditoriaBase(BaseModel):
    """Esquema base para Auditoría"""
    
    id_usuario: uuid.UUID = Field(..., description="ID del usuario que realizó la acción")
    tabla_afectada: str = Field(..., min_length=3, max_length=50, description="Tabla afectada")
    accion: str = Field(..., min_length=3, max_length=20, description="Acción realizada")
    descripcion: str = Field(..., min_length=3, max_length=255, description="Descripción de la acción")

    @validator('tabla_afectada')
    def validar_tabla_afectada(cls, v):
        if not v.strip():
            raise ValueError('La tabla afectada no puede estar vacía')
        return v.strip()

    @validator('accion')
    def validar_accion(cls, v):
        if not v.strip():
            raise ValueError('La acción no puede estar vacía')
        return v.strip().lower()

    @validator('descripcion')
    def validar_descripcion(cls, v):
        if not v.strip():
            raise ValueError('La descripción no puede estar vacía')
        return v.strip()

class AuditoriaCreate(AuditoriaBase):
    """Esquema para creación de auditoría"""
    pass
