"""
Router de AsignacionT
====================

Endpoints FastAPI para operaciones CRUD de la entidad AsignacionT.
Incluye crear, leer y eliminar asignaciones entre usuarios, empleados, transportes y rutas.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from api.dependencies import get_db
from Crud.asignacionT_crud import AsignacionTCRUD
from Entities.asignacionT import AsignacionTCreate, AsignacionTOut

router = APIRouter()


@router.get("/", response_model=List[AsignacionTOut])
async def listar_asignaciones(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(
        100, ge=1, le=1000, description="Número máximo de registros a retornar"
    ),
):
    """
    Obtener lista de todas las asignaciones.

    - **skip**: número de registros a saltar (para paginación)
    - **limit**: número máximo de registros a retornar
    """
    crud = AsignacionTCRUD(db)
    asignaciones = crud.listar_asignaciones()

    # Aplicar paginación
    return asignaciones[skip : skip + limit]


@router.get("/{asignacion_id}", response_model=AsignacionTOut)
async def obtener_asignacion(asignacion_id: UUID, db: Session = Depends(get_db)):
    """
    Obtener una asignación específica por su ID.

    - **asignacion_id**: ID único de la asignación
    """
    crud = AsignacionTCRUD(db)
    asignaciones = crud.listar_asignaciones()

    # Buscar la asignación por ID
    asignacion = next(
        (a for a in asignaciones if str(a.id_asignacion) == str(asignacion_id)), None
    )

    if not asignacion:
        raise HTTPException(status_code=404, detail="Asignación no encontrada")

    return asignacion


@router.post("/", response_model=AsignacionTOut, status_code=201)
async def crear_asignacion(
    asignacion: AsignacionTCreate, db: Session = Depends(get_db)
):
    """
    Crear una nueva asignación.

    - **id_usuario**: ID del usuario que hace la asignación
    - **id_empleado**: ID del empleado asignado
    - **id_transporte**: ID del transporte asignado
    - **id_ruta**: ID de la ruta asignada
    """
    try:
        crud = AsignacionTCRUD(db)
        nueva_asignacion = crud.registrar_asignacion(asignacion)
        return nueva_asignacion
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al crear asignación: {str(e)}"
        )


@router.delete("/{asignacion_id}")
async def eliminar_asignacion(asignacion_id: UUID, db: Session = Depends(get_db)):
    """
    Eliminar una asignación.

    - **asignacion_id**: ID único de la asignación a eliminar
    """
    crud = AsignacionTCRUD(db)
    eliminada = crud.eliminar_asignacion(asignacion_id)

    if not eliminada:
        raise HTTPException(status_code=404, detail="Asignación no encontrada")

    return {"message": "Asignación eliminada correctamente"}


# Endpoints adicionales para consultas específicas


@router.get("/usuario/{usuario_id}", response_model=List[AsignacionTOut])
async def obtener_asignaciones_por_usuario(
    usuario_id: UUID, db: Session = Depends(get_db)
):
    """
    Obtener todas las asignaciones realizadas por un usuario específico.

    - **usuario_id**: ID del usuario
    """
    crud = AsignacionTCRUD(db)
    asignaciones = crud.obtener_por_usuario(usuario_id)

    if not asignaciones:
        raise HTTPException(
            status_code=404, detail="No se encontraron asignaciones para este usuario"
        )

    return asignaciones


@router.get("/empleado/{empleado_id}", response_model=List[AsignacionTOut])
async def obtener_asignaciones_por_empleado(
    empleado_id: UUID, db: Session = Depends(get_db)
):
    """
    Obtener todas las asignaciones de un empleado específico.

    - **empleado_id**: ID del empleado
    """
    crud = AsignacionTCRUD(db)
    asignaciones = crud.obtener_por_empleado(empleado_id)

    if not asignaciones:
        raise HTTPException(
            status_code=404, detail="No se encontraron asignaciones para este empleado"
        )

    return asignaciones


@router.get("/transporte/{transporte_id}", response_model=List[AsignacionTOut])
async def obtener_asignaciones_por_transporte(
    transporte_id: UUID, db: Session = Depends(get_db)
):
    """
    Obtener todas las asignaciones de un transporte específico.

    - **transporte_id**: ID del transporte
    """
    crud = AsignacionTCRUD(db)
    asignaciones = crud.obtener_por_transporte(transporte_id)

    if not asignaciones:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron asignaciones para este transporte",
        )

    return asignaciones


# Endpoint para verificar disponibilidad
@router.get("/disponibilidad/empleado/{empleado_id}")
async def verificar_disponibilidad_empleado(
    empleado_id: UUID, db: Session = Depends(get_db)
):
    """
    Verificar si un empleado tiene asignaciones activas.

    - **empleado_id**: ID del empleado a verificar
    """
    crud = AsignacionTCRUD(db)
    asignaciones = crud.obtener_por_empleado(empleado_id)

    return {
        "empleado_id": str(empleado_id),
        "tiene_asignaciones": len(asignaciones) > 0,
        "total_asignaciones": len(asignaciones),
    }


@router.get("/disponibilidad/transporte/{transporte_id}")
async def verificar_disponibilidad_transporte(
    transporte_id: UUID, db: Session = Depends(get_db)
):
    """
    Verificar si un transporte tiene asignaciones activas.

    - **transporte_id**: ID del transporte a verificar
    """
    crud = AsignacionTCRUD(db)
    asignaciones = crud.obtener_por_transporte(transporte_id)

    return {
        "transporte_id": str(transporte_id),
        "tiene_asignaciones": len(asignaciones) > 0,
        "total_asignaciones": len(asignaciones),
    }
