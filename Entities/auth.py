"""
Entidades relacionadas con la autenticación del sistema.
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    """Modelo para la solicitud de inicio de sesión."""

    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Modelo para la respuesta de inicio de sesión."""

    accessToken: str
    refreshToken: str
    user: dict
    expiresIn: int = 3600  # 1 hora por defecto


class TokenData(BaseModel):
    """Datos del token JWT."""

    email: Optional[str] = None
    user_id: Optional[str] = None
    exp: Optional[datetime] = None


class RefreshTokenRequest(BaseModel):
    """Solicitud para refrescar token."""

    refreshToken: str
