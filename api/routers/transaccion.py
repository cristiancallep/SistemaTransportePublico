"""
Router de Transacciones
===================

Endpoints FastAPI para operaciones CRUD de la entidad Transacciones.
Incluye consultar transacciones.
"""

from typing import List, Optional
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
from Entities import usuario
from api.dependencies import get_db, get_pagination_params
from Crud.transacciones_crud import TransaccionCRUD
from Entities.transaccion import Transaccion, TransaccionOut
from Crud.auditoria_crud import AuditoriaCRUD

router = APIRouter()


@router.get("/", response_model=List[TransaccionOut])
async def consultar_transacciones(
    usuario_id: Optional[UUID] = Query(None),
    documento: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Consultar las transacciones.

    Se pueden pasar opcionalmente filtros:
    - **usuario_id**: ID del usuario (UUID)
    - **documento**: Documento del usuario

    Si no se pasa ningún filtro, devuelve todas las transacciones.
    """

    crud = TransaccionCRUD(db)

    transacciones = crud.obtener_todas_transacciones()

    # Registrar auditoría (lectura)
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Transaccion")

    # Devolver lista (vacía si no hay registros)
    return transacciones
