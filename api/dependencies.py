"""
Dependencias de FastAPI
=======================

Funciones de dependencia para la aplicación FastAPI, incluyendo
manejo de sesiones de base de datos y autenticación.
"""

from typing import Generator
from database.config import SessionLocal
from sqlalchemy.orm import Session


def get_db() -> Generator[Session, None, None]:
    """
    Dependencia para obtener una sesión de base de datos.

    Yields:
        Session: Sesión de SQLAlchemy para interactuar con la base de datos.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Función para paginación
def get_pagination_params(skip: int = 0, limit: int = 100):
    """
    Parámetros de paginación para endpoints de listado.

    Args:
        skip (int): Número de registros a saltar (offset)
        limit (int): Número máximo de registros a retornar

    Returns:
        dict: Diccionario con skip y limit
    """
    return {"skip": skip, "limit": limit}


# TODO: Implementar autenticación JWT si es necesario
# from jose import JWTError, jwt
# from passlib.context import CryptContext
#
# def get_current_user():
#     """Dependencia para obtener el usuario actual autenticado."""
#     pass
