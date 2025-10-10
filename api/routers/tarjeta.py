"""
Router de Tarjeta
===================

Endpoints FastAPI para operaciones CRUD de la entidad Tarjeta.
Incluye crear, consultar, recargar@.
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
from Crud.auditoria_crud import AuditoriaCRUD
from Crud.tarjeta_crud import TarjetaCRUD
from Entities.tarjeta import (
    TarjetaCreate,
    TarjetaUpdate,
    Tarjeta,
    TarjetaOut,
    TarjetaOutSaldo,
)
from Crud.transacciones_crud import TransaccionCRUD

router = APIRouter()


@router.get("/{documento}")
async def consultar_saldo(documento: str, db: Session = Depends(get_db)):
    """
    Consultar el saldo de una tarjeta por el documento del usuario.
    - **documento**: Documento del usuario asociado a la tarjeta
    """

    crud = TarjetaCRUD(db)
    saldo = crud.obtener_saldo(documento)
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Tarjeta")

    return {"saldo": saldo}


@router.put("/", response_model=TarjetaOutSaldo, status_code=201)
async def recargar_tarjeta(tarjeta: TarjetaUpdate, db: Session = Depends(get_db)):
    """
    Recargar saldo a una tarjeta existente.

    - **id_usuario**: ID del usuario al que pertenece la tarjeta
    - **monto**: Monto a recargar
    """
    crud = TarjetaCRUD(db)
    try:
        tarjeta_recargada = crud.recargar_tarjeta(tarjeta.documento, tarjeta.saldo)

        AuditoriaCRUD.agregar_auditoria_usuario("UPDATE", "Tarjeta")

        return TarjetaOutSaldo(
            documento=tarjeta.documento,
            saldo=tarjeta_recargada.saldo,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/", response_model=TarjetaOut, status_code=201)
async def crear_tarjeta(tarjeta: TarjetaCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva tarjeta para un usuario.
    - **documento**: Documento del usuario asociado a la tarjeta
    - **tipo_tarjeta**: Tipo de tarjeta (Estudiante, Normal, Frecuente)
    - **estado**: Estado inicial de la tarjeta (Activa, Inactiva)
    """
    crud = TarjetaCRUD(db)
    try:
        id_usuario_obj = db.execute(
            select(usuario.Usuario).where(
                usuario.Usuario.documento == tarjeta.documento
            )
        ).scalar_one_or_none()

        if not id_usuario_obj:
            raise ValueError("Usuario no encontrado con el documento proporcionado.")

        id_usuario = id_usuario_obj.id_usuario

        tarjeta_existente = db.query(Tarjeta).filter_by(id_usuario=id_usuario).first()
        if tarjeta_existente:
            raise ValueError(
                "El usuario ya tiene una tarjeta registrada. No se puede crear otra."
            )

        nueva_tarjeta = crud.registrar_tarjeta(
            id_usuario, tarjeta.tipo_tarjeta, tarjeta.estado, tarjeta.saldo
        )
        AuditoriaCRUD.agregar_auditoria_usuario("CREATE", "Tarjeta")
        return TarjetaOut(
            numero_tarjeta=nueva_tarjeta.numero_tarjeta,
            documento=tarjeta.documento,
            mensaje="Tarjeta creada exitosamente",
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
