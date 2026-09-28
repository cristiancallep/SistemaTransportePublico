"""
Dependencias de FastAPI
=======================

Funciones de dependencia para la aplicación FastAPI, incluyendo
manejo de sesiones de base de datos y autenticación.
"""

from typing import Generator
from database.config import SessionLocal
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

security = HTTPBearer(auto_error=False)

SECRET_KEY = os.getenv("SECRET_KEY", "tu_clave_secreta_super_segura_cambiar_en_produccion")
ALGORITHM = "HS256"


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[dict]:
    """
    Dependencia para obtener el usuario actual desde el header Authorization (Bearer token).

    Retorna un dict con keys `user_id` y `email`.
    """
    if not credentials:
        return None

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        email = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return {"user_id": user_id, "email": email}
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


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

