"""
Router de Linea
===================

Endpoints FastAPI para operaciones CRUD de la entidad Linea.
Incluye crear lineas.
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
from Crud.linea_crud import LineaCRUD
from Entities.linea import LineaCreate, LineaOut, LineaUpdate
from Crud.auditoria_crud import AuditoriaCRUD


router = APIRouter()


@router.get("/", response_model=List[LineaOut])
async def listar_lineas(db: Session = Depends(get_db)):
    """
    Listar todas las líneas disponibles.

    Returns:
        List[LineaOut]: Lista de líneas con sus UUIDs y datos básicos.
    """
    crud = LineaCRUD(db)
    try:
        lineas = crud.listar_lineas()
        AuditoriaCRUD.agregar_auditoria_usuario("READ", "Linea")
        return lineas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar líneas: {str(e)}")


@router.post("/", response_model=LineaOut, status_code=201)
async def crear_linea(linea: LineaCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva línea.

    - **nombre**: Nombre de la línea
    - **descripcion**: Descripción de la línea
    """
    crud = LineaCRUD(db)
    try:
        nueva_linea = crud.registrar_linea(linea.nombre, linea.descripcion or "")
        AuditoriaCRUD.agregar_auditoria_usuario("CREATE", "Linea")
        return nueva_linea
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear línea: {str(e)}")


@router.put("/{linea_id}", response_model=LineaOut)
async def actualizar_linea(
    linea_id: UUID, linea_update: LineaUpdate, db: Session = Depends(get_db)
):
    """Actualizar una línea existente.

    - **linea_id**: ID único de la línea
    - Campos opcionales: nombre, descripcion
    """
    crud = LineaCRUD(db)
    try:
        linea_actualizada = crud.actualizar_linea(
            linea_id,
            nombre=linea_update.nombre,
            descripcion=linea_update.descripcion,
        )
        AuditoriaCRUD.agregar_auditoria_usuario("UPDATE", "Linea")
        return linea_actualizada
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al actualizar línea: {str(e)}"
        )


@router.delete("/{linea_id}")
async def eliminar_linea(linea_id: UUID, db: Session = Depends(get_db)):
    """Eliminar una línea por su ID."""
    crud = LineaCRUD(db)
    try:
        eliminado = crud.eliminar_linea(linea_id)
        if not eliminado:
            raise HTTPException(status_code=404, detail="Línea no encontrada")
        AuditoriaCRUD.agregar_auditoria_usuario("DELETE", "Linea")
        return {"message": "Línea eliminada correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al eliminar línea: {str(e)}"
        )
