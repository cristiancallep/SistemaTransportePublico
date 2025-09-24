"""
Módulo de operaciones CRUD
==========================

Este módulo contiene todas las operaciones CRUD (Create, Read, Update, Delete)
para las entidades del sistema.
"""

from .usuario_crud import UsuarioCRUD
from .auditoria_crud import AuditoriaCRUD

__all__ = ["UsuarioCRUD", "AuditoriaCRUD"]
