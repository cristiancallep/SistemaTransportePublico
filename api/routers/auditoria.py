"""
Router para manejar operaciones relacionadas con Auditoria.
===================================================

Endpoints FastAPI para operaciones CRUD de la entidad usuario.
Incluye leer las Auditorias.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from api.dependencies import get_db
from Crud.auditoria_crud import AuditoriaCRUD
from Entities.auditoria import Auditoria, AuditoriaOut

router = APIRouter()


@router.get("/", response_model=List[AuditoriaOut])
async def listar_Auditoria(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(
        100, ge=1, le=1000, description="Número máximo de registros a retornar"
    ),
    accion: str = Query(
        None,
        description="Filtrar por accion del Auditoria: CREATE, UPDATE, DELETE, READ",
    ),
):
    """
    Obtener lista de todos los Auditoria.

    - **skip**: número de registros a saltar (para paginación)
    - **limit**: número máximo de registros a retornar
    - **accion**: filtrar Auditoria por accion (opcional)
    """
    crud = AuditoriaCRUD(db)
    Auditoria = crud.obtener_todas()

    if accion:
        Auditoria = [e for e in Auditoria if e.accion == accion]

    return Auditoria[skip : skip + limit]
