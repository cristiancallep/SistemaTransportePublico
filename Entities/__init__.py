"""
Módulo de entidades
==================

Este módulo contiene todas las entidades del sistema usando SQLAlchemy
y sus esquemas de validación con Pydantic.
Importa todos los modelos en el orden correcto para evitar problemas circulares.
"""

# Importar Base primero
from database.config import Base

# Importar modelos en orden de dependencias (menos a más dependientes)
from .roles import Rol, RolCreate, RolUpdate, RolOut
from .linea import Linea, LineaCreate, LineaUpdate, LineaOut
from .tarjeta import Tarjeta, TarjetaCreate, TarjetaUpdate, TarjetaComplete
from .usuario import Usuario, UsuarioCreate, UsuarioUpdate, UsuarioOut
from .empleado import Empleado, EmpleadoCreate, EmpleadoUpdate, EmpleadoOut
from .transporte import Transporte, TransporteCreate, TransporteUpdate, TransporteOut
from .parada import Parada, ParadaCreate, ParadaUpdate, ParadaOut
from .ruta import Ruta, RutaCreate, RutaUpdate, RutaOut
from .asignacionT import (
    AsignacionT,
    AsignacionTCreate,
    AsignacionTUpdate,
    AsignacionTOut,
)
from .transaccion import Transaccion, TransaccionCreate, TransaccionOut
from .auditoria import Auditoria, AuditoriaCreate, AuditoriaOut

__all__ = [
    # Modelos SQLAlchemy
    "Base",
    "Usuario",
    "Rol",
    "Auditoria",
    "Tarjeta",
    "Linea",
    "Ruta",
    "Empleado",
    "Transporte",
    "Parada",
    "AsignacionT",
    "Transaccion",
    # Esquemas Pydantic - Create
    "UsuarioCreate",
    "RolCreate",
    "AuditoriaCreate",
    "TarjetaCreate",
    "LineaCreate",
    "RutaCreate",
    "EmpleadoCreate",
    "TransporteCreate",
    "ParadaCreate",
    "AsignacionTCreate",
    "TransaccionCreate",
    # Esquemas Pydantic - Update
    "UsuarioUpdate",
    "RolUpdate",
    "TarjetaUpdate",
    "LineaUpdate",
    "RutaUpdate",
    "EmpleadoUpdate",
    "TransporteUpdate",
    "ParadaUpdate",
    "AsignacionTUpdate",
    # Esquemas Pydantic - Output
    "UsuarioOut",
    "RolOut",
    "AuditoriaOut",
    "TarjetaComplete",
    "LineaOut",
    "RutaOut",
    "EmpleadoOut",
    "TransporteOut",
    "ParadaOut",
    "AsignacionTOut",
    "TransaccionOut",
]
