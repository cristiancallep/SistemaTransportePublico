"""
Módulo de operaciones CRUD
==========================

Este módulo contiene todas las operaciones CRUD (Create, Read, Update, Delete)
para las entidades del sistema.
"""

from .usuario_crud import UsuarioCRUD
from .tarjeta_crud import TarjetaCRUD

__all__ = ['UsuarioCRUD', 'TarjetaCRUD']
