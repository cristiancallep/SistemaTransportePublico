"""
Manejadores de excepciones personalizados para FastAPI
===================================================

Manejo centralizado de errores y excepciones de la API.
"""

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError


async def validation_exception_handler(request: Request, exc: ValidationError):
    """
    Manejador para errores de validación de Pydantic.
    """
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Error de validación",
            "errors": exc.errors(),
            "message": "Los datos proporcionados no son válidos",
        },
    )


async def integrity_error_handler(request: Request, exc: IntegrityError):
    """
    Manejador para errores de integridad de la base de datos.
    """
    return JSONResponse(
        status_code=400,
        content={
            "detail": "Error de integridad de datos",
            "message": "Los datos violan restricciones de la base de datos (duplicados, referencias faltantes, etc.)",
        },
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Manejador personalizado para HTTPException.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url),
        },
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    Manejador para excepciones generales no capturadas.
    """
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Error interno del servidor",
            "message": "Ha ocurrido un error inesperado",
            "type": type(exc).__name__,
        },
    )
