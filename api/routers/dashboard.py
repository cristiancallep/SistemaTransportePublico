"""
Router para el dashboard con estadísticas del sistema.
======================================================

Endpoints para obtener estadísticas y datos del dashboard.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date

from api.dependencies import get_db
from Entities.usuario import Usuario
from Entities.tarjeta import Tarjeta
from Entities.transporte import Transporte
from Entities.transaccion import Transaccion

router = APIRouter()


@router.get("/estadisticas")
async def obtener_estadisticas(db: Session = Depends(get_db)):
    """
    Obtener estadísticas generales del sistema para el dashboard.
    """
    try:
        # Contar usuarios totales
        total_usuarios = db.query(func.count(Usuario.id_usuario)).scalar() or 0

        # Contar tarjetas totales
        total_tarjetas = db.query(func.count(Tarjeta.id_tarjeta)).scalar() or 0

        # Contar transportes totales
        total_transportes = db.query(func.count(Transporte.id_transporte)).scalar() or 0

        # Contar transacciones de hoy
        hoy = date.today()
        transacciones_hoy = (
            db.query(func.count(Transaccion.id_transaccion))
            .filter(func.date(Transaccion.fecha_transaccion) == hoy)
            .scalar()
            or 0
        )

        # Usuarios activos (ejemplo: usuarios creados en los últimos 30 días)
        hace_30_dias = datetime.now().replace(day=1)  # Primer día del mes actual
        usuarios_activos = (
            db.query(func.count(Usuario.id_usuario))
            .filter(Usuario.fecha_registro >= hace_30_dias)
            .scalar()
            or 0
        )

        return {
            "usuarios": {"total": total_usuarios, "activos": usuarios_activos},
            "tarjetas": {
                "total": total_tarjetas,
                "transaccionesHoy": transacciones_hoy,
            },
            "transportes": {
                "total": total_transportes,
                "activos": total_transportes,  # Por ahora todos activos
            },
            "transacciones": {
                "hoy": transacciones_hoy,
                "mes": 0,  # Se puede agregar después
            },
        }

    except Exception as e:
        # En caso de error, devolver estadísticas de ejemplo
        print(f"Error obteniendo estadísticas: {e}")
        return {
            "usuarios": {"total": 0, "activos": 0},
            "tarjetas": {"total": 0, "transaccionesHoy": 0},
            "transportes": {"total": 0, "activos": 0},
            "transacciones": {"hoy": 0, "mes": 0},
        }


@router.get("/usuarios/estadisticas")
async def obtener_estadisticas_usuarios(db: Session = Depends(get_db)):
    """Estadísticas específicas de usuarios."""
    try:
        total = db.query(func.count(Usuario.id_usuario)).scalar() or 0
        return {"total": total}
    except Exception as e:
        print(f"Error obteniendo estadísticas de usuarios: {e}")
        return {"total": 0}


@router.get("/tarjetas/estadisticas")
async def obtener_estadisticas_tarjetas(db: Session = Depends(get_db)):
    """Estadísticas específicas de tarjetas."""
    try:
        total = db.query(func.count(Tarjeta.id_tarjeta)).scalar() or 0
        hoy = date.today()
        transacciones_hoy = (
            db.query(func.count(Transaccion.id_transaccion))
            .filter(func.date(Transaccion.fecha_transaccion) == hoy)
            .scalar()
            or 0
        )

        return {"total": total, "transaccionesHoy": transacciones_hoy}
    except Exception as e:
        print(f"Error obteniendo estadísticas de tarjetas: {e}")
        return {"total": 0, "transaccionesHoy": 0}


@router.get("/transportes/estadisticas")
async def obtener_estadisticas_transportes(db: Session = Depends(get_db)):
    """Estadísticas específicas de transportes."""
    try:
        total = db.query(func.count(Transporte.id_transporte)).scalar() or 0
        return {"total": total}
    except Exception as e:
        print(f"Error obteniendo estadísticas de transportes: {e}")
        return {"total": 0}
