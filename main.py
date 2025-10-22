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
    auth,
    dashboard,
)

from api.exception_handlers import (
    validation_exception_handler,
    integrity_error_handler,
    http_exception_handler,
    general_exception_handler,
)

app = FastAPI(
    title="Sistema de Transporte Público API",
    description="API REST para el manejo del sistema de transporte público",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(ValidationError, validation_exception_handler)  # type: ignore
app.add_exception_handler(IntegrityError, integrity_error_handler)  # type: ignore
app.add_exception_handler(HTTPException, http_exception_handler)  # type: ignore
app.add_exception_handler(Exception, general_exception_handler)


app.include_router(auth.router, prefix="/api/auth", tags=["Autenticación"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
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
    import subprocess
    import threading
    import time
    import os
    import sys

    HOST = "127.0.0.1"
    PORT = 8000
    FRONTEND_DIR = "sistema-transporte-frontend"

    def iniciar_frontend():
        """Función para iniciar el servidor Angular en un hilo separado."""
        try:
            print("Verificando Frontend Angular...")

            # Cambiar al directorio del frontend
            frontend_path = os.path.join(os.path.dirname(__file__), FRONTEND_DIR)

            if not os.path.exists(frontend_path):
                print(
                    f"Advertencia: No se encontro el directorio del frontend en {frontend_path}"
                )
                print("Continuando solo con el backend...")
                return

            if not os.path.exists(os.path.join(frontend_path, "package.json")):
                print(f"Advertencia: No se encontro package.json en {frontend_path}")
                print("Continuando solo con el backend...")
                return

            # Verificar si npm está disponible
            npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"

            try:
                subprocess.run(
                    [npm_cmd, "--version"], capture_output=True, check=True, timeout=5
                )
                print("Node.js/npm encontrado. Iniciando frontend...")
            except (
                subprocess.CalledProcessError,
                FileNotFoundError,
                subprocess.TimeoutExpired,
            ):
                print("Advertencia: Node.js/npm no disponible.")
                print("Para usar el frontend, instala Node.js desde https://nodejs.org")
                print("Continuando solo con el backend...")
                return

            # Ejecutar npm start con detached process
            subprocess.Popen(
                [npm_cmd, "start"],
                cwd=frontend_path,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=(
                    subprocess.CREATE_NEW_CONSOLE if sys.platform == "win32" else 0
                ),
            )

            print("Frontend iniciado en proceso separado")
            print("El frontend estara disponible en: http://localhost:4200")

        except Exception as e:
            print(f"Advertencia: Error al iniciar frontend: {e}")
            print("Continuando solo con el backend...")

    def iniciar_sistema():
        """Función principal para iniciar todo el sistema."""
        print("=" * 60)
        print("INICIANDO SISTEMA TRANSPORTE PUBLICO COMPLETO")
        print("=" * 60)

        # Iniciar frontend en hilo separado
        frontend_thread = threading.Thread(target=iniciar_frontend, daemon=True)
        frontend_thread.start()

        # Esperar un poco para que el frontend se inicie
        print("Esperando 5 segundos antes de iniciar el backend...")
        time.sleep(5)

        # Iniciar backend
        print("Iniciando Backend FastAPI...")
        print("-" * 60)
        print(f"Backend API: http://{HOST}:{PORT}")
        print(f"Documentacion: http://{HOST}:{PORT}/docs")
        print(f"Health check: http://{HOST}:{PORT}/health")
        print("Frontend: http://localhost:4200")
        print("-" * 60)

        try:
            uvicorn.run("main:app", host=HOST, port=PORT, reload=True, log_level="info")
        except KeyboardInterrupt:
            print("\nDeteniendo sistema...")
            print("Sistema detenido correctamente")
        except Exception as e:
            print(f"Error al iniciar el servidor: {e}")
            print("Sugerencias:")
            print("   - Verificar que el puerto no este en uso")
            print("   - Comprobar permisos del sistema")
            print(f"   - Intentar con: uvicorn main:app --host {HOST} --port 8001")

    # Iniciar todo el sistema
    iniciar_sistema()
