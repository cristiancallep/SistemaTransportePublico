"""
Módulo de entidades
==================

Este módulo contiene todas las entidades del sistema usando SQLAlchemy
y sus esquemas de validación con Pydantic.
"""

from .usuario import Usuario, UsuarioCreate, UsuarioUpdate
from .roles import Rol, RolCreate, RolUpdate
from .auditoria import Auditoria, AuditoriaBase, AuditoriaCreate

__all__ = [
    'Usuario', 'UsuarioCreate', 'UsuarioUpdate'
    'Rol', 'RolCreate', 'RolUpdate', 'RolResponse', 
    'Auditoria', 'AuditoriaBase', 'AuditoriaCreate', 'AuditoriaUpdate'
]