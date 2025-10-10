"""
Router de Empleado
=================

Endpoints FastAPI para operaciones CRUD de la entidad Empleado.
Incluye crear, leer, actualizar y eliminar empleados.
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from Crud.auditoria_crud import AuditoriaCRUD
from api.dependencies import get_db
from Crud.empleado_crud import EmpleadoCRUD
from Entities.empleado import EmpleadoCreate, EmpleadoUpdate, EmpleadoOut

router = APIRouter()


@router.get("/", response_model=List[EmpleadoOut])
async def listar_empleados(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(
        100, ge=1, le=1000, description="Número máximo de registros a retornar"
    ),
    rol: str = Query(None, description="Filtrar por rol del empleado"),
    estado: str = Query(None, description="Filtrar por estado (Activo, Inactivo)"),
):
    """
    Obtener lista de todos los empleados.

    - **skip**: número de registros a saltar (para paginación)
    - **limit**: número máximo de registros a retornar
    - **rol**: filtrar empleados por rol (opcional)
    - **estado**: filtrar empleados por estado (opcional)
    """
    crud = EmpleadoCRUD(db)
    empleados = crud.listar_empleados()

    if rol:
        empleados = [e for e in empleados if e.rol == rol]

    if estado:
        empleados = [e for e in empleados if e.estado == estado]
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Empleado")
    return empleados[skip : skip + limit]


@router.get("/{empleado_id}", response_model=EmpleadoOut)
async def obtener_empleado(empleado_id: UUID, db: Session = Depends(get_db)):
    """
    Obtener un empleado específico por su ID.

    - **empleado_id**: ID único del empleado
    """
    crud = EmpleadoCRUD(db)
    empleados = crud.listar_empleados()

    empleado = next(
        (e for e in empleados if str(e.id_empleado) == str(empleado_id)), None
    )

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Empleado")
    return empleado


@router.post("/", response_model=EmpleadoOut, status_code=201)
async def crear_empleado(empleado: EmpleadoCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo empleado.

    - **nombre**: nombre del empleado
    - **apellido**: apellido del empleado
    - **documento**: documento de identidad único
    - **email**: correo electrónico único
    - **rol**: rol del empleado en el sistema
    """
    try:
        crud = EmpleadoCRUD(db)
        nuevo_empleado = crud.crear_empleado(empleado)
        AuditoriaCRUD.agregar_auditoria_usuario("CREATE", "Empleado")
        return nuevo_empleado
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al crear empleado: {str(e)}"
        )


@router.put("/{empleado_id}", response_model=EmpleadoOut)
async def actualizar_empleado(
    empleado_id: UUID, empleado_update: EmpleadoUpdate, db: Session = Depends(get_db)
):
    """
    Actualizar un empleado existente.

    - **empleado_id**: ID único del empleado a actualizar
    - Campos opcionales a actualizar: nombre, apellido, email, rol, estado
    """
    try:
        crud = EmpleadoCRUD(db)
        empleado_actualizado = crud.actualizar_empleado(empleado_id, empleado_update)
        AuditoriaCRUD.agregar_auditoria_usuario("UPDATE", "Empleado")
        return empleado_actualizado
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al actualizar empleado: {str(e)}"
        )


@router.delete("/{empleado_id}")
async def eliminar_empleado(empleado_id: UUID, db: Session = Depends(get_db)):
    """
    Eliminar un empleado.

    - **empleado_id**: ID único del empleado a eliminar
    """
    crud = EmpleadoCRUD(db)
    eliminado = crud.eliminar_empleado(empleado_id)

    if not eliminado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    AuditoriaCRUD.agregar_auditoria_usuario("DELETE", "Empleado")
    return {"message": "Empleado eliminado correctamente"}


@router.get("/documento/{documento}", response_model=EmpleadoOut)
async def obtener_empleado_por_documento(documento: str, db: Session = Depends(get_db)):
    """
    Obtener un empleado por su documento de identidad.

    - **documento**: documento de identidad del empleado
    """
    crud = EmpleadoCRUD(db)
    empleados = crud.listar_empleados()

    empleado = next((e for e in empleados if e.documento == documento), None)

    if not empleado:
        raise HTTPException(
            status_code=404, detail="Empleado con ese documento no encontrado"
        )
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Empleado")
    return empleado


@router.get("/email/{email}", response_model=EmpleadoOut)
async def obtener_empleado_por_email(email: str, db: Session = Depends(get_db)):
    """
    Obtener un empleado por su email.

    - **email**: correo electrónico del empleado
    """
    crud = EmpleadoCRUD(db)
    empleados = crud.listar_empleados()

    empleado = next((e for e in empleados if e.email == email), None)

    if not empleado:
        raise HTTPException(
            status_code=404, detail="Empleado con ese email no encontrado"
        )
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Empleado")
    return empleado


@router.get("/rol/{rol}", response_model=List[EmpleadoOut])
async def obtener_empleados_por_rol(rol: str, db: Session = Depends(get_db)):
    """
    Obtener todos los empleados con un rol específico.

    - **rol**: rol de los empleados a buscar
    """
    crud = EmpleadoCRUD(db)
    empleados = crud.listar_empleados()

    empleados_filtrados = [e for e in empleados if e.rol == rol]
    AuditoriaCRUD.agregar_auditoria_usuario("READ", "Empleado")
    return empleados_filtrados
