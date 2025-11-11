"""
Router de Ruta
===================

Endpoints FastAPI para operaciones CRUD de la entidad Ruta.
Incluye consultar transacciones.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    select,
)

from api.dependencies import get_db, get_pagination_params
from Crud.ruta_crud import RutaCRUD
from Entities.ruta import RutaCreate, RutaUpdate, RutaOut
from Crud.auditoria_crud import AuditoriaCRUD

router = APIRouter()


@router.get("/", response_model=List[RutaOut])
async def listar_rutas(db: Session = Depends(get_db)):
    """Listar todas las rutas disponibles.

    Returns:
        List[RutaOut]: Lista completa de rutas con sus datos.
    """
    crud = RutaCRUD(db)
    try:
        rutas = crud.listar_rutas()
        AuditoriaCRUD.agregar_auditoria_usuario("READ", "Ruta")
        return rutas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar rutas: {str(e)}")


@router.post("/", response_model=RutaCreate, status_code=201)
async def crear_ruta(ruta: RutaCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva ruta.

    - **nombre**: Nombre de la ruta
    - **origen**: Punto de origen de la ruta
    - **destino**: Punto de destino de la ruta
    - **duracion_estimada**: Duración estimada del viaje en minutos
    - **id_linea**: ID de la línea asociada a la ruta
    """
    crud = RutaCRUD(db)
    try:
        nueva_ruta = crud.registrar_ruta(
            nombre_ruta=ruta.nombre,
            origen=ruta.origen,
            destino=ruta.destino,
            duracion=ruta.duracion_estimada,
            id_linea=ruta.id_linea,
        )
        AuditoriaCRUD.agregar_auditoria_usuario("CREATE", "Ruta")
        return {
            "nombre": nueva_ruta.nombre,
            "origen": nueva_ruta.origen,
            "destino": nueva_ruta.destino,
            "duracion_estimada": nueva_ruta.duracion_estimada,
            "id_linea": nueva_ruta.id_linea,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/", response_model=RutaUpdate, status_code=200)
async def actualizar_ruta(ruta: RutaUpdate, db: Session = Depends(get_db)):
    """
    Actualizar una ruta existente.

    - **id_ruta**: ID de la ruta a actualizar
    - **nombre**: Nuevo nombre de la ruta
    - **origen**: Nuevo punto de origen de la ruta
    - **destino**: Nuevo punto de destino de la ruta
    - **duracion_estimada**: Nueva duración estimada del viaje en minutos
    """
    crud = RutaCRUD(db)
    try:
        crud.modificar_ruta(
            id_ruta=ruta.id_ruta,
            nombre_ruta=ruta.nombre,
            origen=ruta.origen,
            destino=ruta.destino,
            duracion=ruta.duracion_estimada,
        )
        AuditoriaCRUD.agregar_auditoria_usuario("UPDATE", "Ruta")
        return {
            "id_ruta": ruta.id_ruta,
            "nombre": ruta.nombre,
            "origen": ruta.origen,
            "destino": ruta.destino,
            "duracion_estimada": ruta.duracion_estimada,
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{id_ruta}")
async def eliminar_ruta(id_ruta: UUID, db: Session = Depends(get_db)):
    """Eliminar una ruta por su ID."""
    crud = RutaCRUD(db)
    try:
        eliminado = crud.eliminar_ruta(id_ruta)
        if not eliminado:
            raise HTTPException(status_code=404, detail="Ruta no encontrada")
        AuditoriaCRUD.agregar_auditoria_usuario("DELETE", "Ruta")
        return {"message": "Ruta eliminada correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al eliminar ruta: {str(e)}")
