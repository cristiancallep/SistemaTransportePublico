"""
Router de Transacciones
===================

Endpoints FastAPI para operaciones CRUD de la entidad Transacciones.
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
from Entities import usuario
from api.dependencies import get_db, get_pagination_params
from Crud.transacciones_crud import TransaccionCRUD
from Entities.transaccion import Transaccion, TransaccionOut
from Crud.auditoria_crud import AuditoriaCRUD

router = APIRouter()


@router.get("/", response_model=List[TransaccionOut])
async def consultar_transacciones(documento: str, db: Session = Depends(get_db)):
    """
    Consultar las transacciones de una tarjeta por el documento del usuario.
    - **documento**: Documento del usuario asociado a la tarjeta
    """

    crud = TransaccionCRUD(db)
    transacciones = crud.obtener_transacciones(documento)
    if not transacciones:
        raise HTTPException(status_code=404, detail="No se encontraron transacciones")
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Transaccion")
    return transacciones
