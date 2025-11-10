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
    TarjetaComplete,
)
from Crud.transacciones_crud import TransaccionCRUD

router = APIRouter()


@router.get("/", response_model=List[TarjetaComplete])
async def obtener_todas_tarjetas(db: Session = Depends(get_db)):
    """
    Obtiene todas las tarjetas registradas en el sistema.

    Returns:
        List[TarjetaComplete]: Lista con todas las tarjetas y su información completa.
    """
    crud = TarjetaCRUD(db)

    try:
        tarjetas = crud.obtener_todas_tarjetas()
        AuditoriaCRUD.agregar_auditoria_usuario("READ", "Tarjeta")
        return tarjetas
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al obtener tarjetas: {str(e)}"
        )


@router.get("/{documento}")
async def consultar_saldo(documento: str, db: Session = Depends(get_db)):
    """
    Consultar el saldo de una tarjeta por el documento del usuario.
    - **documento**: Documento del usuario asociado a la tarjeta
    """

    crud = TarjetaCRUD(db)
    transaccion_crud = TransaccionCRUD(db)

    try:
        # Obtener la tarjeta para conseguir el número
        tarjeta = crud.obtener_tarjeta_por_documento(documento)
        if not tarjeta:
            raise ValueError(
                "No se encontró la tarjeta para el documento proporcionado"
            )

        saldo = crud.obtener_saldo(documento)

        # Registrar la transacción de consulta
        transaccion_crud.registrar_transaccion(
            numero_tarjeta=tarjeta.numero_tarjeta, tipo_transaccion="consulta", monto=0
        )

        AuditoriaCRUD.agregar_auditoria_usuario("READ", "Tarjeta")

        return {"saldo": saldo}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/", response_model=TarjetaOutSaldo, status_code=201)
async def recargar_tarjeta(tarjeta: TarjetaUpdate, db: Session = Depends(get_db)):
    """
    Recargar saldo a una tarjeta existente.

    - **id_usuario**: ID del usuario al que pertenece la tarjeta
    - **monto**: Monto a recargar
    """
    crud = TarjetaCRUD(db)
    transaccion_crud = TransaccionCRUD(db)

    try:
        # Recargar la tarjeta
        tarjeta_recargada = crud.recargar_tarjeta(tarjeta.documento, tarjeta.saldo)

        # Registrar la transacción
        transaccion_crud.registrar_transaccion(
            numero_tarjeta=tarjeta_recargada.numero_tarjeta,
            tipo_transaccion="recarga",
            monto=tarjeta.saldo,
        )

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
    transaccion_crud = TransaccionCRUD(db)

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

        # Registrar la transacción de creación
        transaccion_crud.registrar_transaccion(
            numero_tarjeta=nueva_tarjeta.numero_tarjeta,
            tipo_transaccion="creacion",
            monto=0,
        )

        AuditoriaCRUD.agregar_auditoria_usuario("CREATE", "Tarjeta")
        return TarjetaOut(
            numero_tarjeta=nueva_tarjeta.numero_tarjeta,
            documento=tarjeta.documento,
            mensaje="Tarjeta creada exitosamente",
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{id_tarjeta}", status_code=200)
async def eliminar_tarjeta(id_tarjeta: UUID, db: Session = Depends(get_db)):
    """
    Eliminar una tarjeta del sistema.

    - **id_tarjeta**: UUID de la tarjeta a eliminar

    Returns:
        dict: Mensaje de confirmación de eliminación
    """
    crud = TarjetaCRUD(db)

    try:
        crud.eliminar_tarjeta(id_tarjeta)
        AuditoriaCRUD.agregar_auditoria_usuario("DELETE", "Tarjeta")
        return {
            "mensaje": "Tarjeta eliminada exitosamente",
            "id_tarjeta": str(id_tarjeta),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al eliminar tarjeta: {str(e)}"
        )
