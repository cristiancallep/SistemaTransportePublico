"""
Router de Transporte
===================

Endpoints FastAPI para operaciones CRUD de la entidad Transporte.
Incluye crear, leer, actualizar y eliminar transportes.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from Crud.auditoria_crud import AuditoriaCRUD
from api.dependencies import get_db, get_pagination_params
from Crud.transporte_crud import TransporteCRUD
from Entities.transporte import TransporteCreate, TransporteUpdate, TransporteOut

router = APIRouter()


@router.get("/", response_model=List[TransporteOut])
async def listar_transportes(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(
        100, ge=1, le=1000, description="Número máximo de registros a retornar"
    ),
):
    """
    Obtener lista de todos los transportes.

    - **skip**: número de registros a saltar (para paginación)
    - **limit**: número máximo de registros a retornar
    """
    crud = TransporteCRUD(db)
    transportes = crud.listar_transportes()
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Transporte")
    return transportes[skip : skip + limit]


@router.get("/{transporte_id}", response_model=TransporteOut)
async def obtener_transporte(transporte_id: UUID, db: Session = Depends(get_db)):
    """
    Obtener un transporte específico por su ID.

    - **transporte_id**: ID único del transporte
    """
    crud = TransporteCRUD(db)
    transportes = crud.listar_transportes()

    transporte = next(
        (t for t in transportes if t.id_transporte == transporte_id), None
    )

    if not transporte:
        raise HTTPException(status_code=404, detail="Transporte no encontrado")
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Transporte")
    return transporte


@router.post("/", response_model=TransporteOut, status_code=201)
async def crear_transporte(transporte: TransporteCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo transporte.

    - **tipo**: tipo de transporte (bus, metro, etc.)
    - **placa**: placa única del vehículo
    - **capacidad**: capacidad máxima de pasajeros
    - **id_linea**: ID de la línea a la que pertenece
    """
    try:
        crud = TransporteCRUD(db)
        nuevo_transporte = crud.registrar_transporte(transporte)
        AuditoriaCRUD.agregar_auditoria_usuario("CREATE", "Transporte")
        return nuevo_transporte
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al crear transporte: {str(e)}"
        )


@router.put("/{transporte_id}", response_model=TransporteOut)
async def actualizar_transporte(
    transporte_id: UUID,
    transporte_update: TransporteUpdate,
    db: Session = Depends(get_db),
):
    """
    Actualizar un transporte existente.

    - **transporte_id**: ID único del transporte a actualizar
    - Campos opcionales a actualizar: tipo, placa, capacidad, estado, id_linea
    """
    try:
        crud = TransporteCRUD(db)
        transporte_actualizado = crud.modificar_transporte(
            transporte_id, transporte_update
        )
        AuditoriaCRUD.agregar_auditoria_usuario("UPDATE", "Transporte")
        return transporte_actualizado
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al actualizar transporte: {str(e)}"
        )


@router.delete("/{transporte_id}")
async def eliminar_transporte(transporte_id: UUID, db: Session = Depends(get_db)):
    """
    Eliminar un transporte.

    - **transporte_id**: ID único del transporte a eliminar
    """
    crud = TransporteCRUD(db)
    eliminado = crud.eliminar_transporte(transporte_id)

    if not eliminado:
        raise HTTPException(status_code=404, detail="Transporte no encontrado")
    AuditoriaCRUD.agregar_auditoria_usuario("DELETE", "Transporte")
    return {"message": "Transporte eliminado correctamente"}


@router.get("/placa/{placa}", response_model=TransporteOut)
async def obtener_transporte_por_placa(placa: str, db: Session = Depends(get_db)):
    """
    Obtener un transporte por su placa.

    - **placa**: placa del vehículo
    """
    crud = TransporteCRUD(db)
    transportes = crud.listar_transportes()

    transporte = next((t for t in transportes if t.placa == placa), None)

    if not transporte:
        raise HTTPException(
            status_code=404, detail="Transporte con esa placa no encontrado"
        )
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Transporte")
    return transporte
