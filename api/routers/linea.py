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
from Entities.linea import LineaCreate
from Crud.auditoria_crud import AuditoriaCRUD


router = APIRouter()


@router.post("/", response_model=LineaCreate, status_code=201)
async def crear_linea(linea: LineaCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva línea.

    - **nombre**: Nombre de la línea
    - **descripcion**: Descripción de la línea
    """
    crud = LineaCRUD(db)
    try:
        nueva_linea = crud.registrar_linea(linea.nombre, linea.descripcion)
        AuditoriaCRUD.agregar_auditoria_usuario("CREATE", "Linea")
        return {
            "nombre": nueva_linea.nombre,
            "descripcion": nueva_linea.descripcion,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
