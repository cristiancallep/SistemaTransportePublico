"""
Módulo de entidades
==================

Este módulo contiene todas las entidades del sistema usando SQLAlchemy
y sus esquemas de validación con Pydantic.
"""

from .usuario import Usuario, UsuarioCreate, UsuarioUpdate
from .roles import Rol, RolCreate
from .auditoria import Auditoria

__all__ = [
    "Usuario",
    "UsuarioCreate",
    "UsuarioUpdate" "Rol",
    "RolCreate",
    "RolResponse",
    "Auditoria",
]
