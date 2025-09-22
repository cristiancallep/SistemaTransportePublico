"""
Módulo de configuración de base de datos
========================================

Este módulo contiene la configuración y conexión a la base de datos
usando SQLAlchemy.
"""

from .config import DATABASE_URL, create_tables, Base, get_db, engine, SessionLocal

__all__ = ["get_db", "create_tables", "DATABASE_URL", "Base", "engine", "SessionLocal"]
