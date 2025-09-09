"""
Módulo de configuración de base de datos
========================================

Este módulo contiene la configuración y conexión a la base de datos
usando SQLAlchemy.
"""

from .database import get_engine, get_session, create_tables, check_connection, Base, get_session_context
from .config import DATABASE_URL

__all__ = ['get_engine', 'get_session', 'create_tables', 'DATABASE_URL', 'check_connection', 'Base', 'get_session_context']