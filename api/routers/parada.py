"""
Router de Parada
===============

Endpoints FastAPI para operaciones CRUD de la entidad Parada.
Incluye crear, leer, actualizar y eliminar paradas.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from api.dependencies import get_db
from Crud.parada_crud import ParadaCRUD
from Entities.parada import ParadaCreate, ParadaUpdate, ParadaOut

router = APIRouter()


@router.get("/", response_model=List[ParadaOut])
async def listar_paradas(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(
        100, ge=1, le=1000, description="Número máximo de registros a retornar"
    ),
    estado: str = Query(None, description="Filtrar por estado (Activa, Inactiva)"),
):
    """
    Obtener lista de todas las paradas.

    - **skip**: número de registros a saltar (para paginación)
    - **limit**: número máximo de registros a retornar
    - **estado**: filtrar paradas por estado (opcional)
    """
    crud = ParadaCRUD(db)
    paradas = crud.listar_paradas()

    # Filtrar por estado si se proporciona
    if estado:
        paradas = [p for p in paradas if p.estado == estado]

    # Aplicar paginación
    return paradas[skip : skip + limit]


@router.get("/{parada_id}", response_model=ParadaOut)
async def obtener_parada(parada_id: UUID, db: Session = Depends(get_db)):
    """
    Obtener una parada específica por su ID.

    - **parada_id**: ID único de la parada
    """
    crud = ParadaCRUD(db)
    paradas = crud.listar_paradas()

    # Buscar la parada por ID
    parada = next((p for p in paradas if str(p.id_parada) == str(parada_id)), None)

    if not parada:
        raise HTTPException(status_code=404, detail="Parada no encontrada")

    return parada


@router.post("/", response_model=ParadaOut, status_code=201)
async def crear_parada(parada: ParadaCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva parada.

    - **nombre**: nombre de la parada
    - **direccion**: dirección física de la parada
    - **coordenadas**: coordenadas GPS (opcional)
    """
    try:
        crud = ParadaCRUD(db)
        nueva_parada = crud.registrar_parada(parada)
        return nueva_parada
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear parada: {str(e)}")


@router.put("/{parada_id}", response_model=ParadaOut)
async def actualizar_parada(
    parada_id: UUID, parada_update: ParadaUpdate, db: Session = Depends(get_db)
):
    """
    Actualizar una parada existente.

    - **parada_id**: ID único de la parada a actualizar
    - Campos opcionales a actualizar: nombre, dirección, coordenadas, estado
    """
    try:
        crud = ParadaCRUD(db)
        parada_actualizada = crud.modificar_parada(parada_id, parada_update)
        return parada_actualizada
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al actualizar parada: {str(e)}"
        )


@router.delete("/{parada_id}")
async def eliminar_parada(parada_id: UUID, db: Session = Depends(get_db)):
    """
    Eliminar una parada.

    - **parada_id**: ID único de la parada a eliminar
    """
    crud = ParadaCRUD(db)
    eliminada = crud.eliminar_parada(parada_id)

    if not eliminada:
        raise HTTPException(status_code=404, detail="Parada no encontrada")

    return {"message": "Parada eliminada correctamente"}


# Endpoint adicional para buscar por nombre
@router.get("/buscar/nombre/{nombre}", response_model=List[ParadaOut])
async def buscar_paradas_por_nombre(nombre: str, db: Session = Depends(get_db)):
    """
    Buscar paradas que contengan un nombre específico.

    - **nombre**: texto a buscar en el nombre de las paradas
    """
    crud = ParadaCRUD(db)
    paradas = crud.listar_paradas()

    # Buscar paradas que contengan el nombre (case-insensitive)
    paradas_encontradas = [p for p in paradas if nombre.lower() in p.nombre.lower()]

    return paradas_encontradas


# Endpoint para obtener paradas por estado
@router.get("/estado/{estado}", response_model=List[ParadaOut])
async def obtener_paradas_por_estado(estado: str, db: Session = Depends(get_db)):
    """
    Obtener todas las paradas con un estado específico.

    - **estado**: estado de las paradas (Activa, Inactiva)
    """
    crud = ParadaCRUD(db)
    paradas = crud.listar_paradas()

    # Filtrar por estado
    paradas_filtradas = [p for p in paradas if p.estado == estado]

    return paradas_filtradas
