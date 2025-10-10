"""
Sistema de Transporte Público - API REST
========================================

Aplicación FastAPI para el manejo del sistema de transporte público.
Incluye endpoints para Transporte, Parada, Empleado y AsignacionT.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError

# Importar todos los modelos ANTES de los routers para evitar problemas circulares
import Entities  # Esto importará todos los modelos en orden correcto

from api.routers import (
    transporte,
    parada,
    empleado,
    asignacion,
    linea,
    tarjeta,
    transaccion,
    ruta,
    usuarios,
    auditoria,
)

from api.exception_handlers import (
    validation_exception_handler,
    integrity_error_handler,
    http_exception_handler,
    general_exception_handler,
)

# Crear la aplicación FastAPI
app = FastAPI(
    title="Sistema de Transporte Público API",
    description="API REST para el manejo del sistema de transporte público",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar manejadores de excepciones
app.add_exception_handler(ValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Incluir routers
app.include_router(auditoria.router, prefix="/api/auditoria", tags=["Auditoria"])
app.include_router(usuarios.router, prefix="/api/usuarios", tags=["Usuarios"])
app.include_router(transporte.router, prefix="/api/transportes", tags=["Transportes"])
app.include_router(parada.router, prefix="/api/paradas", tags=["Paradas"])
app.include_router(empleado.router, prefix="/api/empleados", tags=["Empleados"])
app.include_router(asignacion.router, prefix="/api/asignaciones", tags=["Asignaciones"])
app.include_router(tarjeta.router, prefix="/api/tarjetas", tags=["Tarjetas"])
app.include_router(
    transaccion.router, prefix="/api/transacciones", tags=["Transacciones"]
)
app.include_router(linea.router, prefix="/api/lineas", tags=["Lineas"])
app.include_router(ruta.router, prefix="/api/rutas", tags=["Rutas"])


@app.get("/")
async def root():
    """Endpoint raíz que retorna información básica de la API."""
    return {
        "message": "Sistema de Transporte Público API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
async def health_check():
    """Endpoint para verificar el estado de la API."""
    return {"status": "healthy", "message": "API is running"}


if __name__ == "__main__":
    import uvicorn

    # Configuración por defecto
    HOST = "127.0.0.1"
    PORT = 8000

    print(" Iniciando Sistema de Transporte Público API...")
    print(f" Documentación disponible en: http://{HOST}:{PORT}/docs")
    print(f" ReDoc disponible en: http://{HOST}:{PORT}/redoc")
    print(f" Health check en: http://{HOST}:{PORT}/health")
    print(f" API Base URL: http://{HOST}:{PORT}")
    print("-" * 60)

    try:
        # Usar import string para habilitar reload correctamente
        uvicorn.run("main:app", host=HOST, port=PORT, reload=True, log_level="info")
    except Exception as e:
        print(f" Error al iniciar el servidor: {e}")
        print(" Sugerencias:")
        print("   - Verificar que el puerto no esté en uso")
        print("   - Comprobar permisos del sistema")
        print(f"   - Intentar con: uvicorn main:app --host {HOST} --port 8001")
