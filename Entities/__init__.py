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
from .roles import Rol, RolCreate
from .linea import Linea
from .tarjeta import Tarjeta  # Importar antes de Usuario
from .usuario import Usuario, UsuarioCreate, UsuarioUpdate
from .empleado import Empleado
from .transporte import Transporte
from .parada import Parada
from .ruta import Ruta
from .asignacionT import AsignacionT
from .transaccion import Transaccion
from .auditoria import Auditoria
from .auditoria import Auditoria

__all__ = [
    "Usuario",
    "UsuarioCreate",
    "UsuarioUpdate" "Rol",
    "RolCreate",
    "RolResponse",
    "Auditoria",
]
